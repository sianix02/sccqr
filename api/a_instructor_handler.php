<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in and is admin
if(!isset($_SESSION['session_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

// Include database connection
require_once('../sql_php/connection.php');

// Get the action from query parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch($action) {
    case 'get_all':
        getAllInstructors($conn);
        break;
    
    case 'create':
        createInstructor($conn);
        break;
    
    case 'update':
        updateInstructor($conn);
        break;
    
    case 'delete':
        deleteInstructor($conn);
        break;
    
    case 'assign_sets':
        assignSets($conn);
        break;
    
    case 'get_instructor_sets':
        getInstructorSets($conn);
        break;
    
    case 'get_available_sets':
        getAvailableSets($conn);
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

/**
 * Get all instructors with their assigned sets
 * Year Level and Sets are now separate!
 */
function getAllInstructors($conn) {
    // Get instructors with aggregated sets
    $sql = "SELECT 
                i.*,
                GROUP_CONCAT(ins.set_name ORDER BY ins.set_name SEPARATOR ', ') as assigned_sets,
                COUNT(ins.set_name) as set_count
            FROM instructor i
            LEFT JOIN instructor_sets ins ON i.adviser_id = ins.adviser_id
            GROUP BY i.adviser_id
            ORDER BY i.adviser_id DESC";
    
    $result = $conn->query($sql);
    
    $instructors = [];
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Convert assigned_sets string to array for easier frontend handling
            $row['sets_array'] = $row['assigned_sets'] ? explode(', ', $row['assigned_sets']) : [];
            $instructors[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'instructors' => $instructors
    ]);
}

/**
 * Create new instructor with year level and set assignments
 */
function createInstructor($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if(empty($data['first_name']) || empty($data['last_name']) || 
       empty($data['department']) || empty($data['position']) ||
       empty($data['year_level_assigned'])) {
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
        return;
    }
    
    $first_name = $conn->real_escape_string($data['first_name']);
    $middle_initial = isset($data['middle_initial']) ? $conn->real_escape_string($data['middle_initial']) : '';
    $last_name = $conn->real_escape_string($data['last_name']);
    $department = $conn->real_escape_string($data['department']);
    $position = $conn->real_escape_string($data['position']);
    
    // Year level is separate from sets now!
    $year_level_assigned = $conn->real_escape_string($data['year_level_assigned']);
    
    // Sets are optional and stored in separate table
    $sets = isset($data['assigned_sets']) ? $data['assigned_sets'] : [];
    
    // Begin transaction
    $conn->begin_transaction();
    
    try {
        // Insert instructor with year level
        $sql = "INSERT INTO instructor (first_name, middle_initial, last_name, year_level_assigned, department, position) 
                VALUES ('$first_name', '$middle_initial', '$last_name', '$year_level_assigned', '$department', '$position')";
        
        if (!$conn->query($sql)) {
            throw new Exception('Error creating instructor: ' . $conn->error);
        }
        
        $adviser_id = $conn->insert_id;
        
        // Insert set assignments (A, B, C, D) in separate table
        if (!empty($sets)) {
            foreach ($sets as $set) {
                $set = $conn->real_escape_string($set);
                $set_sql = "INSERT INTO instructor_sets (adviser_id, set_name) 
                           VALUES ($adviser_id, '$set')";
                
                if (!$conn->query($set_sql)) {
                    throw new Exception('Error assigning sets: ' . $conn->error);
                }
            }
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Instructor added successfully with ' . count($sets) . ' set(s)',
            'instructor_id' => $adviser_id
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

/**
 * Update instructor and their set assignments
 * Year level stays in instructor table, sets in instructor_sets table
 */
function updateInstructor($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if(empty($data['adviser_id']) || empty($data['first_name']) || 
       empty($data['last_name']) || empty($data['department']) || 
       empty($data['position']) || empty($data['year_level_assigned'])) {
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
        return;
    }
    
    $adviser_id = intval($data['adviser_id']);
    $first_name = $conn->real_escape_string($data['first_name']);
    $middle_initial = isset($data['middle_initial']) ? $conn->real_escape_string($data['middle_initial']) : '';
    $last_name = $conn->real_escape_string($data['last_name']);
    $department = $conn->real_escape_string($data['department']);
    $position = $conn->real_escape_string($data['position']);
    
    // Year level is stored in instructor table
    $year_level_assigned = $conn->real_escape_string($data['year_level_assigned']);
    
    // Sets are stored in instructor_sets table
    $sets = isset($data['assigned_sets']) ? $data['assigned_sets'] : [];
    
    // Begin transaction
    $conn->begin_transaction();
    
    try {
        // Update instructor basic info including year level
        $sql = "UPDATE instructor 
                SET first_name = '$first_name',
                    middle_initial = '$middle_initial',
                    last_name = '$last_name',
                    year_level_assigned = '$year_level_assigned',
                    department = '$department',
                    position = '$position'
                WHERE adviser_id = $adviser_id";
        
        if (!$conn->query($sql)) {
            throw new Exception('Error updating instructor: ' . $conn->error);
        }
        
        // Delete existing set assignments
        $delete_sql = "DELETE FROM instructor_sets WHERE adviser_id = $adviser_id";
        if (!$conn->query($delete_sql)) {
            throw new Exception('Error removing old set assignments: ' . $conn->error);
        }
        
        // Insert new set assignments
        if (!empty($sets)) {
            foreach ($sets as $set) {
                $set = $conn->real_escape_string($set);
                $set_sql = "INSERT INTO instructor_sets (adviser_id, set_name) 
                           VALUES ($adviser_id, '$set')";
                
                if (!$conn->query($set_sql)) {
                    throw new Exception('Error assigning sets: ' . $conn->error);
                }
            }
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Instructor updated successfully with ' . count($sets) . ' set(s)'
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

/**
 * Delete instructor (cascade delete will handle set assignments)
 */
function deleteInstructor($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if(empty($data['adviser_id'])) {
        echo json_encode(['success' => false, 'message' => 'Instructor ID is required']);
        return;
    }
    
    $adviser_id = intval($data['adviser_id']);
    
    // Check if instructor exists
    $check_sql = "SELECT * FROM instructor WHERE adviser_id = $adviser_id";
    $result = $conn->query($check_sql);
    
    if($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Instructor not found']);
        return;
    }
    
    // Delete instructor (cascade will delete set assignments automatically)
    $sql = "DELETE FROM instructor WHERE adviser_id = $adviser_id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success' => true,
            'message' => 'Instructor deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting instructor: ' . $conn->error
        ]);
    }
}

/**
 * Assign multiple sets to instructor (alternative to update)
 */
function assignSets($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if(empty($data['adviser_id']) || !isset($data['sets'])) {
        echo json_encode(['success' => false, 'message' => 'Instructor ID and sets are required']);
        return;
    }
    
    $adviser_id = intval($data['adviser_id']);
    $sets = $data['sets'];
    
    // Begin transaction
    $conn->begin_transaction();
    
    try {
        // Delete existing assignments
        $delete_sql = "DELETE FROM instructor_sets WHERE adviser_id = $adviser_id";
        if (!$conn->query($delete_sql)) {
            throw new Exception('Error removing old assignments: ' . $conn->error);
        }
        
        // Insert new assignments
        if (!empty($sets)) {
            foreach ($sets as $set) {
                $set = $conn->real_escape_string($set);
                $insert_sql = "INSERT INTO instructor_sets (adviser_id, set_name) 
                              VALUES ($adviser_id, '$set')";
                
                if (!$conn->query($insert_sql)) {
                    throw new Exception('Error assigning sets: ' . $conn->error);
                }
            }
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Sets assigned successfully'
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

/**
 * Get sets assigned to a specific instructor
 */
function getInstructorSets($conn) {
    $adviser_id = isset($_GET['adviser_id']) ? intval($_GET['adviser_id']) : 0;
    
    if ($adviser_id === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid instructor ID']);
        return;
    }
    
    $sql = "SELECT set_name FROM instructor_sets WHERE adviser_id = $adviser_id ORDER BY set_name";
    $result = $conn->query($sql);
    
    $sets = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $sets[] = $row['set_name'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'sets' => $sets
    ]);
}

/**
 * Get all available sets from the student table
 */
function getAvailableSets($conn) {
    // Get distinct sets from student table, ordered alphabetically
    $sql = "SELECT DISTINCT student_set FROM student 
            WHERE student_set IS NOT NULL AND student_set != '' 
            ORDER BY student_set ASC";
    
    $result = $conn->query($sql);
    
    $sets = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $sets[] = $row['student_set'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'sets' => $sets
    ]);
}

$conn->close();
?>