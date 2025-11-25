<?php
// File: C:\laragon\www\sccqr\api\test_archive_system.php
// Quick test to verify archive is working

header('Content-Type: text/html; charset=utf-8');
require_once '../sql_php/connection.php';

echo '<!DOCTYPE html>
<html>
<head>
    <title>Archive System Test</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .test { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0066cc; }
        .success { border-left-color: #28a745; }
        .error { border-left-color: #dc3545; }
        .warning { border-left-color: #ffc107; }
        h2 { color: #0066cc; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .status { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
        .active { background: #28a745; color: white; }
        .inactive { background: #dc3545; color: white; }
    </style>
</head>
<body>';

echo '<h1>🔍 Archive System Test Results</h1>';
echo '<p>Testing at: ' . date('Y-m-d H:i:s') . '</p>';

// Test 1: Check if archive tables exist
echo '<div class="test">';
echo '<h2>1️⃣ Check Archive Tables</h2>';
try {
    $checkTables = "SHOW TABLES LIKE 'student_archive'";
    $result = $conn->query($checkTables);
    
    if ($result && $result->num_rows > 0) {
        echo '<p class="success">✅ student_archive table EXISTS</p>';
    } else {
        echo '<p class="error">❌ student_archive table DOES NOT EXIST</p>';
        echo '<p>Tables need to be created. Archive a student to auto-create them.</p>';
    }
    
    $checkTables2 = "SHOW TABLES LIKE 'archive_history'";
    $result2 = $conn->query($checkTables2);
    
    if ($result2 && $result2->num_rows > 0) {
        echo '<p class="success">✅ archive_history table EXISTS</p>';
    } else {
        echo '<p class="warning">⚠️ archive_history table DOES NOT EXIST</p>';
    }
} catch (Exception $e) {
    echo '<p class="error">❌ Error: ' . $e->getMessage() . '</p>';
}
echo '</div>';

// Test 2: Check sample student status
echo '<div class="test">';
echo '<h2>2️⃣ Sample Student Archive Status</h2>';
try {
    $sql = "SELECT 
                s.student_id,
                s.first_name,
                s.last_name,
                COALESCE(sa.is_archived, 0) as is_archived,
                sa.archived_date,
                sa.archive_reason
            FROM student s
            LEFT JOIN student_archive sa ON s.student_id = sa.student_id
            ORDER BY s.student_id ASC
            LIMIT 10";
    
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        echo '<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">';
        echo '<tr style="background: #0066cc; color: white;">
                <th>Student ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Archive Date</th>
                <th>Reason</th>
              </tr>';
        
        while ($row = $result->fetch_assoc()) {
            $isArchived = (int)$row['is_archived'] === 1;
            $status = $isArchived ? 'Inactive' : 'Active';
            $statusClass = $isArchived ? 'inactive' : 'active';
            
            echo '<tr>';
            echo '<td>' . htmlspecialchars($row['student_id']) . '</td>';
            echo '<td>' . htmlspecialchars($row['first_name'] . ' ' . $row['last_name']) . '</td>';
            echo '<td><span class="status ' . $statusClass . '">' . $status . '</span></td>';
            echo '<td>' . ($row['archived_date'] ?? 'N/A') . '</td>';
            echo '<td>' . ($row['archive_reason'] ?? 'N/A') . '</td>';
            echo '</tr>';
        }
        
        echo '</table>';
    } else {
        echo '<p class="error">❌ No students found</p>';
    }
} catch (Exception $e) {
    echo '<p class="error">❌ Error: ' . $e->getMessage() . '</p>';
}
echo '</div>';

// Test 3: Count archived vs active
echo '<div class="test">';
echo '<h2>3️⃣ Student Status Summary</h2>';
try {
    $sql = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN COALESCE(sa.is_archived, 0) = 1 THEN 1 ELSE 0 END) as archived,
                SUM(CASE WHEN COALESCE(sa.is_archived, 0) = 0 THEN 1 ELSE 0 END) as active
            FROM student s
            LEFT JOIN student_archive sa ON s.student_id = sa.student_id";
    
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    
    echo '<p><strong>Total Students:</strong> ' . $row['total'] . '</p>';
    echo '<p><strong>Active:</strong> <span class="status active">' . $row['active'] . '</span></p>';
    echo '<p><strong>Archived:</strong> <span class="status inactive">' . $row['archived'] . '</span></p>';
} catch (Exception $e) {
    echo '<p class="error">❌ Error: ' . $e->getMessage() . '</p>';
}
echo '</div>';

// Test 4: Recent archive actions
echo '<div class="test">';
echo '<h2>4️⃣ Recent Archive History</h2>';
try {
    $checkHistory = "SHOW TABLES LIKE 'archive_history'";
    $historyExists = $conn->query($checkHistory);
    
    if ($historyExists && $historyExists->num_rows > 0) {
        $sql = "SELECT 
                    ah.student_id,
                    ah.action,
                    ah.action_date,
                    ah.performed_by,
                    ah.reason,
                    s.first_name,
                    s.last_name
                FROM archive_history ah
                LEFT JOIN student s ON ah.student_id = s.student_id
                ORDER BY ah.action_date DESC
                LIMIT 10";
        
        $result = $conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            echo '<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">';
            echo '<tr style="background: #0066cc; color: white;">
                    <th>Date</th>
                    <th>Student</th>
                    <th>Action</th>
                    <th>Performed By</th>
                    <th>Reason</th>
                  </tr>';
            
            while ($row = $result->fetch_assoc()) {
                $actionClass = $row['action'] === 'archive' ? 'warning' : 'success';
                echo '<tr>';
                echo '<td>' . $row['action_date'] . '</td>';
                echo '<td>' . htmlspecialchars($row['first_name'] . ' ' . $row['last_name']) . ' (' . $row['student_id'] . ')</td>';
                echo '<td><span class="status ' . $actionClass . '">' . strtoupper($row['action']) . '</span></td>';
                echo '<td>' . htmlspecialchars($row['performed_by']) . '</td>';
                echo '<td>' . htmlspecialchars($row['reason'] ?? 'N/A') . '</td>';
                echo '</tr>';
            }
            
            echo '</table>';
        } else {
            echo '<p class="warning">⚠️ No archive history found</p>';
        }
    } else {
        echo '<p class="warning">⚠️ archive_history table does not exist yet</p>';
    }
} catch (Exception $e) {
    echo '<p class="error">❌ Error: ' . $e->getMessage() . '</p>';
}
echo '</div>';

// Test 5: API Response Test
echo '<div class="test">';
echo '<h2>5️⃣ API Response Preview</h2>';
echo '<p>Testing get_students_with_attendance.php response format:</p>';
try {
    $sql = "SELECT 
                s.student_id,
                CONCAT(s.first_name, ' ', s.last_name) as name,
                COALESCE(sa.is_archived, 0) as is_archived
            FROM student s
            LEFT JOIN student_archive sa ON s.student_id = sa.student_id
            LIMIT 3";
    
    $result = $conn->query($sql);
    $sampleData = [];
    
    while ($row = $result->fetch_assoc()) {
        $sampleData[] = [
            'student_id' => $row['student_id'],
            'name' => $row['name'],
            'status' => (int)$row['is_archived'] === 1 ? 'Inactive' : 'Active',
            'is_archived' => (bool)$row['is_archived']
        ];
    }
    
    echo '<pre>' . json_encode($sampleData, JSON_PRETTY_PRINT) . '</pre>';
} catch (Exception $e) {
    echo '<p class="error">❌ Error: ' . $e->getMessage() . '</p>';
}
echo '</div>';

echo '<div class="test success">';
echo '<h2>✅ Test Complete</h2>';
echo '<p><strong>Next Steps:</strong></p>';
echo '<ol>';
echo '<li>If tables don\'t exist, try archiving a student - tables will auto-create</li>';
echo '<li>Check that student status shows "Inactive" when archived</li>';
echo '<li>Try restoring and verify status changes to "Active"</li>';
echo '<li>Refresh student list to see updated statuses</li>';
echo '</ol>';
echo '</div>';

echo '</body></html>';

$conn->close();
?>