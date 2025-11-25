// CLASS MANAGEMENT MODULE
let classStudents = [];
let filteredClassStudents = [];
let selectedStudentForDetails = null;

// Initialize Class Management
function initializeClassManagement() {
    loadClassStudents();
    setupClassEventListeners();
}

// Setup Event Listeners
function setupClassEventListeners() {
    // Search
    $('#class-student-search').on('input', function() {
        applyClassFilters();
    });
    
    // Sort
    $('#class-sort-students').on('change', function() {
        applyClassFilters();
    });
    
    // Filters
    $('#class-filter-status').on('change', function() {
        applyClassFilters();
        updateClearFiltersButton();
    });
    
    $('#class-filter-event').on('change', function() {
        applyClassFilters();
        updateClearFiltersButton();
    });
    
    $('#class-filter-date').on('change', function() {
        applyClassFilters();
        updateClearFiltersButton();
    });
    
    $('#class-filter-set').on('change', function() {
        applyClassFilters();
        updateClearFiltersButton();
    });
    
    // Clear Filters
    $('#class-clear-filters').on('click', function() {
        clearAllFilters();
    });
    
    // Export
    $('#class-export-btn').on('click', function() {
        exportFilteredStudentList();
    });
    
    // Refresh
    $('#class-refresh-students').on('click', function() {
        loadClassStudents();
    });
    
    // Modal Close
    $('#class-close-details-modal, #class-close-details-btn').on('click', function() {
        closeStudentDetailsModal();
    });
    
    // Export Individual Report
    $('#class-export-student-report').on('click', function() {
        exportIndividualStudentReport();
    });
}

// Load Students from API
function loadClassStudents() {
    $('#class-students-table-body').html(`
        <tr>
            <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px;"></div>
                <br>Loading students...
            </td>
        </tr>
    `);
    
    $.ajax({
        url: '../../api/instructor_get_class_students.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                classStudents = response.data || [];
                populateFilterDropdowns();
                applyClassFilters();
                // Students loaded successfully - no notification needed
            } else {
                showNotification('error', response.message || 'Failed to load students');
                $('#class-students-table-body').html(`
                    <tr>
                        <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
                            Error: ${response.message || 'Failed to load students'}
                        </td>
                    </tr>
                `);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading students:', error);
            showNotification('error', 'Failed to load students. Please try again.');
            $('#class-students-table-body').html(`
                <tr>
                    <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
                        Failed to load students. Please refresh the page.
                    </td>
                </tr>
            `);
        }
    });
}

// Populate Filter Dropdowns
function populateFilterDropdowns() {
    // Get unique events
    const events = new Set();
    const dates = new Set();
    const sets = new Set();
    
    classStudents.forEach(student => {
        sets.add(student.set);
        if (student.attendance && Array.isArray(student.attendance)) {
            student.attendance.forEach(att => {
                events.add(att.event);
                dates.add(att.date);
            });
        }
    });
    
    // Populate Event Filter
    const eventFilter = $('#class-filter-event');
    eventFilter.html('<option value="all">All Events</option>');
    Array.from(events).sort().forEach(event => {
        eventFilter.append(`<option value="${event}">${event}</option>`);
    });
    
    // Populate Date Filter
    const dateFilter = $('#class-filter-date');
    dateFilter.html('<option value="all">All Dates</option>');
    Array.from(dates).sort().reverse().forEach(date => {
        const formattedDate = formatDate(date);
        dateFilter.append(`<option value="${date}">${formattedDate}</option>`);
    });
    
    // Populate Set Filter
    const setFilter = $('#class-filter-set');
    setFilter.html('<option value="">All Sets</option>');
    Array.from(sets).sort().forEach(set => {
        setFilter.append(`<option value="${set}">${set}</option>`);
    });
}

// Apply Filters
function applyClassFilters() {
    const searchTerm = $('#class-student-search').val().toLowerCase();
    const statusFilter = $('#class-filter-status').val();
    const eventFilter = $('#class-filter-event').val();
    const dateFilter = $('#class-filter-date').val();
    const setFilter = $('#class-filter-set').val();
    const sortBy = $('#class-sort-students').val();
    
    // Filter students
    filteredClassStudents = classStudents.filter(student => {
        // Search filter
        const matchesSearch = !searchTerm || 
            student.id.toString().includes(searchTerm) ||
            student.name.toLowerCase().includes(searchTerm) ||
            student.set.toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || 
            student.status.toLowerCase() === statusFilter;
        
        // Set filter
        const matchesSet = !setFilter || student.set === setFilter;
        
        // Event filter
        const matchesEvent = eventFilter === 'all' || 
            (student.attendance && student.attendance.some(att => att.event === eventFilter));
        
        // Date filter
        const matchesDate = dateFilter === 'all' || 
            (student.attendance && student.attendance.some(att => att.date === dateFilter));
        
        return matchesSearch && matchesStatus && matchesSet && matchesEvent && matchesDate;
    });
    
    // Sort students
    filteredClassStudents.sort((a, b) => {
        switch(sortBy) {
            case 'id-asc': return a.id - b.id;
            case 'id-desc': return b.id - a.id;
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'attendance-high': return b.attendanceCount - a.attendanceCount;
            case 'attendance-low': return a.attendanceCount - b.attendanceCount;
            default: return 0;
        }
    });
    
    displayFilteredStudents();
    updateClassStatistics();
}

// Display Filtered Students
function displayFilteredStudents() {
    const tbody = $('#class-students-table-body');
    
    if (filteredClassStudents.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                    No students found matching your filters.
                </td>
            </tr>
        `);
        return;
    }
    
    let html = '';
    filteredClassStudents.forEach((student, index) => {
        const bgColor = index % 2 === 0 ? '#f8fcff' : 'white';
        const statusBgColor = student.status === 'Active' ? '#d4edda' : '#dc3545';
        const statusColor = student.status === 'Active' ? '#155724' : '#ffffff';
        const statusBorder = student.status === 'Active' ? '#c3e6cb' : '#dc3545';
        
        html += `
            <tr style="background: ${bgColor};">
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.id}</td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.name}</td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.set}</td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.year}</td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.course}</td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.attendanceCount || 0} events</td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">
                    <span style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${statusBgColor}; color: ${statusColor}; border: 1px solid ${statusBorder};">
                        ${student.status}
                    </span>
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #f0f8ff; text-align: center;">
                    <button class="btn-view-details" data-student-id="${student.id}" style="padding: 8px 16px; border: 2px solid #0066cc; background: transparent; color: #0066cc; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 600;">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.html(html);
    
    // Attach event listeners to view details buttons
    $('.btn-view-details').on('click', function() {
        const studentId = $(this).data('student-id');
        showStudentDetails(studentId);
    });
}

// Update Statistics
function updateClassStatistics() {
    const total = filteredClassStudents.length;
    const active = filteredClassStudents.filter(s => s.status === 'Active').length;
    const avgAttendance = total > 0 
        ? (filteredClassStudents.reduce((sum, s) => sum + (s.attendanceCount || 0), 0) / total).toFixed(1)
        : 0;
    
    $('#class-total-students-count').text(total);
    $('#class-active-students-count').text(active);
    $('#class-avg-attendance').text(avgAttendance + ' events');
    
    $('#class-info-badge').text(`Showing ${total} of ${classStudents.length} students`);
}

// Show Student Details Modal
function showStudentDetails(studentId) {
    const student = classStudents.find(s => s.id == studentId);
    if (!student) return;
    
    selectedStudentForDetails = student;
    
    // Populate student info
    $('#class-detail-student-id').text(student.id);
    $('#class-detail-student-name').text(student.name);
    $('#class-detail-student-set').text(student.set);
    $('#class-detail-student-year').text(student.year);
    
    // Calculate statistics
    const totalEvents = student.attendance ? student.attendance.length : 0;
    const attended = student.attendanceCount || 0;
    const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : 0;
    
    $('#class-detail-total-events').text(totalEvents);
    $('#class-detail-attended').text(attended);
    $('#class-detail-attendance-rate').text(attendanceRate + '%');
    
    // Populate attendance history
    const historyBody = $('#class-attendance-history-body');
    if (!student.attendance || student.attendance.length === 0) {
        historyBody.html(`
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center; color: #666;">
                    No attendance records found
                </td>
            </tr>
        `);
    } else {
        let html = '';
        student.attendance.forEach((att, index) => {
            const bgColor = index % 2 === 0 ? 'white' : '#f8fcff';
            const statusBgColor = student.status === 'Active' ? '#d4edda' : '#dc3545';
            const statusColor = student.status === 'Active' ? '#155724' : '#ffffff';
            const statusBorder = student.status === 'Active' ? '#c3e6cb' : '#dc3545';
            const formattedDate = formatDate(att.date);
            
            html += `
                <tr style="background: ${bgColor};">
                    <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${formattedDate}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${att.event}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${att.time || 'N/A'}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${att.timeOut || 'N/A'}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">
                        <span style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${statusBgColor}; color: ${statusColor}; border: 1px solid ${statusBorder};">
                            ${att.status.toUpperCase()}
                        </span>
                    </td>
                </tr>
            `;
        });
        historyBody.html(html);
    }
    
    // Show modal
    $('#class-student-details-modal').fadeIn(300);
}

// Close Student Details Modal
function closeStudentDetailsModal() {
    $('#class-student-details-modal').fadeOut(300);
    selectedStudentForDetails = null;
}

// Export Filtered Student List
function exportFilteredStudentList() {
    showNotification('info', 'Exporting filtered student list...');
    window.location.href = '../../api/instructor_export_all_students.php';
}

// Export Individual Student Report
function exportIndividualStudentReport() {
    if (!selectedStudentForDetails) return;
    
    showNotification('info', `Exporting report for ${selectedStudentForDetails.name}...`);
    window.location.href = `../../api/instructor_export_individual_student.php?student_id=${selectedStudentForDetails.id}`;
}

// Clear All Filters
function clearAllFilters() {
    $('#class-filter-status').val('all');
    $('#class-filter-event').val('all');
    $('#class-filter-date').val('all');
    $('#class-filter-set').val('');
    applyClassFilters();
    updateClearFiltersButton();
}

// Update Clear Filters Button Visibility
function updateClearFiltersButton() {
    const hasActiveFilters = 
        $('#class-filter-status').val() !== 'all' ||
        $('#class-filter-event').val() !== 'all' ||
        $('#class-filter-date').val() !== 'all' ||
        $('#class-filter-set').val() !== '';
    
    if (hasActiveFilters) {
        $('#class-clear-filters').fadeIn(200);
    } else {
        $('#class-clear-filters').fadeOut(200);
    }
}

// Format Date Helper
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Initialize when document is ready
$(document).ready(function() {
    initializeClassManagement();
});