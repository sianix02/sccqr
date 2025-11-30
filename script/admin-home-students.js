// ============================================================
// ADMIN-HOME-STUDENTS.JS - Student Management Module
// Part 2: Complete student management functionality
// ============================================================

// ============================================================
// STUDENT MANAGEMENT VARIABLES
// ============================================================

let studentsData = [];
let currentEditingStudent = null;
let studentToArchive = null;
let isLoadingStudents = false;
let currentFilters = {
    status: 'all',  // 'active', 'inactive', 'archived', 'all'
    course: 'all',
    year: 'all',
    search: ''
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeStudentManagement();
    }, 500);
});

function initializeStudentManagement() {
    console.log('🎓 Initializing Student Management...');
    loadStudentsFromDatabase();
    attachStudentEventListeners();
}

// ============================================================
// DATA LOADING
// ============================================================

async function loadStudentsFromDatabase() {
    if (isLoadingStudents) {
        console.log('⏳ Already loading students, skipping...');
        return;
    }
    
    isLoadingStudents = true;
    const tbody = document.getElementById('students-table-body');
    
    if (!tbody) {
        console.error('❌ Table body element not found!');
        isLoadingStudents = false;
        return;
    }
    
    console.log('🔄 Loading students from database...');
    
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
                <p>Loading students from database...</p>
            </td>
        </tr>
    `;
    
    try {
        const timestamp = new Date().getTime();
        const url = `../../api/get_students_with_attendance.php?_=${timestamp}`;
        
        console.log('📡 Fetching from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 Received data:', result);
        
        if (result.success) {
            studentsData = result.data.map(student => {
                return {
                    id: student.student_id || student.id,
                    student_id: student.student_id || student.id,
                    name: student.name,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    course: student.course,
                    set: student.set,
                    year: student.year,
                    status: student.status,
                    is_archived: student.is_archived || false,
                    archived_date: student.archived_date,
                    archive_reason: student.archive_reason,
                    absentCount: student.absentCount || 0,
                    stats: student.stats,
                    attendance: student.attendance
                };
            });
            
            console.log('✅ Processed students data:', studentsData.length, 'students');
            console.log('📊 Status breakdown:', {
                active: studentsData.filter(s => s.status === 'Active' && !s.is_archived).length,
                inactive: studentsData.filter(s => s.status === 'Inactive' && !s.is_archived).length,
                archived: studentsData.filter(s => s.is_archived).length
            });
            
            populateCourseFilter();
            renderStudentsTable();
            updateStudentStats();
            
            showToast(`✅ Loaded ${result.data.length} students successfully`, 'success');
        } else {
            throw new Error(result.message || 'Failed to load students');
        }
    } catch (error) {
        console.error('❌ Error loading students:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
                    <p style="font-size: 18px; margin-bottom: 10px;">❌ Error Loading Students</p>
                    <p style="margin-bottom: 15px;">${error.message}</p>
                    <button class="btn" onclick="loadStudentsFromDatabase()">Retry</button>
                </td>
            </tr>
        `;
        showToast('Failed to load students from database', 'error');
    } finally {
        isLoadingStudents = false;
        console.log('🏁 Load complete. isLoadingStudents:', isLoadingStudents);
    }
}

// ============================================================
// FILTERING & SORTING
// ============================================================

function populateCourseFilter() {
    const courseFilter = document.getElementById('filter-course');
    if (!courseFilter) return;
    
    const courses = [...new Set(studentsData.map(s => s.course))].filter(c => c && c !== 'N/A').sort();
    
    courseFilter.innerHTML = '<option value="all">All Courses</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        courseFilter.appendChild(option);
    });
}

function applyFilters() {
    let filteredData = [...studentsData];
    
    // Apply status/archive filter
    if (currentFilters.status === 'archived') {
        filteredData = filteredData.filter(s => s.is_archived === true);
    } else if (currentFilters.status === 'active') {
        filteredData = filteredData.filter(s => s.status === 'Active' && !s.is_archived);
    } else if (currentFilters.status === 'inactive') {
        filteredData = filteredData.filter(s => s.status === 'Inactive' && !s.is_archived);
    }
    // 'all' shows everything
    
    if (currentFilters.course !== 'all') {
        filteredData = filteredData.filter(s => s.course === currentFilters.course);
    }
    
    if (currentFilters.year !== 'all') {
        filteredData = filteredData.filter(s => s.year === currentFilters.year);
    }
    
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredData = filteredData.filter(student => {
            return student.id.toString().toLowerCase().includes(searchTerm) ||
                   student.name.toLowerCase().includes(searchTerm) ||
                   student.course.toLowerCase().includes(searchTerm) ||
                   student.year.toLowerCase().includes(searchTerm);
        });
    }
    
    const filterInfo = document.getElementById('filter-info');
    if (filterInfo) {
        const parts = [];
        if (currentFilters.status === 'archived') parts.push('Archived');
        else if (currentFilters.status === 'active') parts.push('Active');
        else if (currentFilters.status === 'inactive') parts.push('Inactive');
        
        if (currentFilters.course !== 'all') parts.push(currentFilters.course);
        if (currentFilters.year !== 'all') parts.push(currentFilters.year);
        if (currentFilters.search) parts.push(`Search: "${currentFilters.search}"`);
        
        filterInfo.textContent = parts.length > 0 
            ? `Showing ${filteredData.length} students (${parts.join(', ')})`
            : `Showing all ${filteredData.length} students`;
    }
    
    return filteredData;
}

function sortStudents(sortType, data = null) {
    let sortedData = data ? [...data] : [...studentsData];
    
    switch(sortType) {
        case 'id-asc':
            sortedData.sort((a, b) => a.id.toString().localeCompare(b.id.toString()));
            break;
        case 'id-desc':
            sortedData.sort((a, b) => b.id.toString().localeCompare(a.id.toString()));
            break;
        case 'name-asc':
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedData.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'course-asc':
            sortedData.sort((a, b) => a.course.localeCompare(b.course));
            break;
        case 'course-desc':
            sortedData.sort((a, b) => b.course.localeCompare(a.course));
            break;
        case 'year-asc':
            sortedData.sort((a, b) => {
                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                return yearA - yearB;
            });
            break;
        case 'year-desc':
            sortedData.sort((a, b) => {
                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                return yearB - yearA;
            });
            break;
        case 'attendance-high':
            sortedData.sort((a, b) => {
                const rateA = calculateAttendanceRate(a);
                const rateB = calculateAttendanceRate(b);
                return rateB - rateA;
            });
            break;
        case 'attendance-low':
            sortedData.sort((a, b) => {
                const rateA = calculateAttendanceRate(a);
                const rateB = calculateAttendanceRate(b);
                return rateA - rateB;
            });
            break;
    }
    
    if (!data) {
        studentsData = sortedData;
        renderStudentsTable();
        showToast('Students sorted', 'success');
    }
    
    return sortedData;
}

function calculateAttendanceRate(student) {
    const stats = student.stats || {};
    const total = stats.total || 0;
    const attended = (stats.present || 0) + (stats.late || 0);
    return total > 0 ? (attended / total) * 100 : 0;
}

// ============================================================
// TABLE RENDERING
// ============================================================

function renderStudentsTable() {
    console.log('🎨 Rendering students table...');
    
    let data = applyFilters();
    
    const sortSelect = document.getElementById('sort-students');
    if (sortSelect && sortSelect.value) {
        data = sortStudents(sortSelect.value, data);
    }
    
    const tbody = document.getElementById('students-table-body');
    
    if (!tbody) {
        console.error('❌ Table body not found!');
        return;
    }
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                    <p style="font-size: 18px; margin-bottom: 10px;">📋 No students found</p>
                    <p>Try adjusting your filters or search criteria</p>
                </td>
            </tr>
        `;
        return;
    }
    
    console.log('📊 Rendering', data.length, 'students');
    
    tbody.innerHTML = data.map(student => {
        const stats = student.stats || {};
        const totalEvents = stats.total || 0;
        const presentCount = stats.present || 0;
        const lateCount = stats.late || 0;
        const absentCount = stats.absent || 0;
        const attendedCount = presentCount + lateCount;
        const attendanceRate = totalEvents > 0 ? Math.round((attendedCount / totalEvents) * 100) : 0;
        
        const statusColor = student.status === 'Active' ? '#28a745' : '#dc3545';
        const statusIcon = student.status === 'Active' ? '✔' : '⚠️';
        
        // Determine what actions to show
        let actionButtons = '';
        
        if (student.is_archived) {
            // ARCHIVED: Only show View and Restore
            actionButtons = `
                <button class="btn" style="font-size: 11px; padding: 6px 10px;" onclick="viewStudentDetails('${student.id}')">👁️ View</button>
                <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #28a745;" onclick="toggleArchiveStudent('${student.id}')">♻️ Restore</button>
            `;
        } else {
            // NOT ARCHIVED: Show full actions (regardless of Active/Inactive status)
            actionButtons = `
                <button class="btn" style="font-size: 11px; padding: 6px 10px;" onclick="viewStudentDetails('${student.id}')">👁️ View</button>
                <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #ffc107;" onclick="editStudent('${student.id}')">✏️ Edit</button>
                <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #6c757d;" onclick="toggleArchiveStudent('${student.id}')">📦 Archive</button>
            `;
        }
        
        return `
            <tr data-student-id="${student.id}" data-status="${student.status}" data-archived="${student.is_archived}">
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.id}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: #e8f4fd; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #0066cc;">
                        ${student.course}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.set}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.year}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="flex: 1; background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${attendanceRate}%; height: 100%; background: ${attendanceRate > 70 ? '#28a745' : attendanceRate > 40 ? '#ffc107' : '#dc3545'}; transition: width 0.3s;"></div>
                        </div>
                        <span style="font-size: 12px; font-weight: 600; min-width: 45px;">${attendanceRate}%</span>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 4px;">
                        P: ${presentCount} | L: ${lateCount} | A: ${absentCount}
                    </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${statusIcon} ${student.status}
                    </span>
                    ${student.is_archived ? `<div style="font-size: 11px; color: #dc3545; margin-top: 4px; font-weight: 600;">📦 ARCHIVED</div>` : ''}
                    ${absentCount > 4 && !student.is_archived ? `<div style="font-size: 11px; color: #ffc107; margin-top: 4px;">⚠️ High absences</div>` : ''}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Table rendered');
}

function updateStudentStats() {
    console.log('📈 Calculating statistics...');
    
    const totalStudents = studentsData.filter(s => !s.is_archived).length;
    const activeStudents = studentsData.filter(s => s.status === 'Active' && !s.is_archived).length;
    const inactiveStudents = studentsData.filter(s => s.status === 'Inactive' && !s.is_archived).length;
    const archivedStudents = studentsData.filter(s => s.is_archived === true).length;
    
    console.log('📊 Stats:', {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,
        archived: archivedStudents
    });
    
    let totalAttendanceRate = 0;
    const nonArchivedStudents = studentsData.filter(s => !s.is_archived);
    
    nonArchivedStudents.forEach(student => {
        const stats = student.stats || {};
        const totalEvents = stats.total || 0;
        const attendedCount = (stats.present || 0) + (stats.late || 0);
        const rate = totalEvents > 0 ? (attendedCount / totalEvents) * 100 : 0;
        totalAttendanceRate += rate;
    });
    const avgAttendance = nonArchivedStudents.length > 0 ? Math.round(totalAttendanceRate / nonArchivedStudents.length) : 0;
    
    const statElements = {
        'total-students-count': totalStudents,
        'active-students-count': activeStudents,
        'inactive-students-count': inactiveStudents,
        'archived-students-count': archivedStudents,
        'avg-attendance': avgAttendance + '%'
    };
    
    Object.keys(statElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = statElements[id];
            console.log(`✅ Updated ${id}:`, statElements[id]);
        } else {
            console.warn(`⚠️ Element not found: ${id}`);
        }
    });
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function attachStudentEventListeners() {
    const searchInput = document.getElementById('student-search');
    const statusFilter = document.getElementById('filter-status');
    const courseFilter = document.getElementById('filter-course');
    const yearFilter = document.getElementById('filter-year');
    const sortSelect = document.getElementById('sort-students');
    const refreshBtn = document.getElementById('refresh-students');
    const exportBtn = document.getElementById('export-all-pdf');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            renderStudentsTable();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            renderStudentsTable();
        });
    }
    
    if (courseFilter) {
        courseFilter.addEventListener('change', (e) => {
            currentFilters.course = e.target.value;
            renderStudentsTable();
        });
    }
    
    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            currentFilters.year = e.target.value;
            renderStudentsTable();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => sortStudents(e.target.value));
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadStudentsFromDatabase();
            showToast('Refreshing student list...', 'success');
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllStudentsPDF);
    }
    
    const closeModalBtn = document.getElementById('close-modal');
    const cancelModalBtn = document.getElementById('cancel-modal');
    const closeDetailsModalBtn = document.getElementById('close-details-modal');
    const closeDetailsBtnBtn = document.getElementById('close-details-btn');
    const confirmArchiveBtn = document.getElementById('confirm-archive');
    const cancelArchiveBtn = document.getElementById('cancel-archive');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeStudentModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeStudentModal);
    if (closeDetailsModalBtn) closeDetailsModalBtn.addEventListener('click', closeDetailsModal);
    if (closeDetailsBtnBtn) closeDetailsBtnBtn.addEventListener('click', closeDetailsModal);
    if (confirmArchiveBtn) confirmArchiveBtn.addEventListener('click', confirmArchive);
    if (cancelArchiveBtn) cancelArchiveBtn.addEventListener('click', closeArchiveModal);
    
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveStudent();
        });
    }
    
    const exportStudentReportBtn = document.getElementById('export-student-report');
    if (exportStudentReportBtn) {
        exportStudentReportBtn.addEventListener('click', exportStudentReport);
    }
}

// ============================================================
// STUDENT EDIT/ADD
// ============================================================

window.editStudent = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) openStudentModal(student);
}

function openStudentModal(student = null) {
    currentEditingStudent = student;
    const modal = document.getElementById('student-modal');
    const title = document.getElementById('modal-title');
    
    if (!modal) return;
    
    if (student) {
        if (title) title.textContent = 'Edit Student Information';
        
        const idHidden = document.getElementById('student-id-hidden');
        const idInput = document.getElementById('student-id-input');
        const firstNameInput = document.getElementById('student-first-name');
        const middleInitialInput = document.getElementById('student-middle-initial');
        const lastNameInput = document.getElementById('student-last-name');
        const courseInput = document.getElementById('student-course');
        const setInput = document.getElementById('student-set');
        const yearInput = document.getElementById('student-year');
        
        if (idHidden) idHidden.value = student.id;
        if (idInput) {
            idInput.value = student.id;
            idInput.disabled = true;
        }
        if (firstNameInput) firstNameInput.value = student.first_name || '';
        if (middleInitialInput) middleInitialInput.value = student.middle_initial || '';
        if (lastNameInput) lastNameInput.value = student.last_name || '';
        if (courseInput) courseInput.value = student.course;
        if (setInput) setInput.value = student.set;
        if (yearInput) yearInput.value = student.year;
    } else {
        if (title) title.textContent = 'Add New Student';
        
        const studentForm = document.getElementById('student-form');
        const idInput = document.getElementById('student-id-input');
        
        if (studentForm) studentForm.reset();
        if (idInput) idInput.disabled = false;
    }
    
    modal.style.display = 'block';
}

function closeStudentModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.style.display = 'none';
    
    const studentForm = document.getElementById('student-form');
    if (studentForm) studentForm.reset();
    
    currentEditingStudent = null;
}

async function saveStudent() {
    const idInput = document.getElementById('student-id-input');
    const firstNameInput = document.getElementById('student-first-name');
    const middleInitialInput = document.getElementById('student-middle-initial');
    const lastNameInput = document.getElementById('student-last-name');
    const courseInput = document.getElementById('student-course');
    const setInput = document.getElementById('student-set');
    const yearInput = document.getElementById('student-year');
    
    if (!idInput || !firstNameInput || !lastNameInput || !courseInput || !yearInput) {
        showToast('Form elements not found', 'error');
        return;
    }
    
    const id = idInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const middleInitial = middleInitialInput ? middleInitialInput.value.trim().toUpperCase() : '';
    const lastName = lastNameInput.value.trim();
    const course = courseInput.value.trim();
    const studentSet = setInput ? setInput.value.trim() : '';
    const year = yearInput.value;
    
    if (!id || !firstName || !lastName || !course || !year) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const studentData = {
        student_id: id,
        first_name: firstName,
        middle_initial: middleInitial,
        last_name: lastName,
        year_level: year,
        sex: 'Not Specified',
        student_set: studentSet,
        course: course,
        is_update: currentEditingStudent !== null
    };
    
    try {
        const submitBtn = document.querySelector('#student-form button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = currentEditingStudent ? 'Updating...' : 'Adding...';
        }
        
        const response = await fetch('../../api/save_student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message, 'success');
            closeStudentModal();
            await loadStudentsFromDatabase();
        } else {
            throw new Error(result.error || 'Failed to save student');
        }
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Student';
        }
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        const submitBtn = document.querySelector('#student-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Student';
        }
    }
}

// ============================================================
// STUDENT DETAILS VIEW
// ============================================================

window.viewStudentDetails = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    
    const detailElements = {
        'detail-student-id': student.id,
        'detail-student-name': student.name,
        'detail-student-course': student.course,
        'detail-student-set': student.set,
        'detail-student-year': student.year
    };
    
    Object.keys(detailElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = detailElements[id];
    });
    
    const stats = student.stats || {};
    const totalEvents = stats.total || 0;
    const presentCount = stats.present || 0;
    const lateCount = stats.late || 0;
    const absentCount = stats.absent || 0;
    const attendanceRate = stats.attendance_rate || 0;
    
    const statElements = {
        'detail-total-events': totalEvents,
        'detail-present': presentCount,
        'detail-late': lateCount,
        'detail-absent': absentCount,
        'detail-attendance-rate': attendanceRate + '%'
    };
    
    Object.keys(statElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = statElements[id];
    });
    
    const historyBody = document.getElementById('attendance-history-body');
    if (historyBody) {
        if (student.attendance.length === 0) {
            historyBody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 20px; text-align: center; color: #666;">
                        No attendance records found for this student
                    </td>
                </tr>
            `;
        } else {
            historyBody.innerHTML = student.attendance.map(record => {
                const statusColors = {
                    'Present': '#28a745',
                    'Late': '#ffc107',
                    'Absent': '#dc3545'
                };
                const color = statusColors[record.status] || '#6c757d';
                
                let timeIn = 'N/A';
                let timeOut = 'N/A';
                
                if (record.status !== 'Absent') {
                    timeIn = record.time_in || 'N/A';
                    timeOut = record.time_out || 'Pending';
                }
                
                return `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.date_formatted || record.date}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.event}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${timeIn}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${timeOut}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                        <span style="background: ${color}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; display: inline-block; min-width: 70px;">
                            ${record.status}
                        </span>
                    </td>
                </tr>
                `;
            }).join('');
        }
    }
    
    const detailsModal = document.getElementById('student-details-modal');
    if (detailsModal) detailsModal.style.display = 'block';
    
    window.currentViewingStudent = student;
}

function closeDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) modal.style.display = 'none';
    window.currentViewingStudent = null;
}

// ============================================================
// ARCHIVE/RESTORE FUNCTIONALITY
// ============================================================

window.toggleArchiveStudent = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    studentToArchive = student;
const modal = document.getElementById('archive-modal');

if (!modal) {
    console.error('Archive modal not found');
    return;
}

const nameEl = document.getElementById('archive-student-name');
const confirmBtn = document.getElementById('confirm-archive');
const title = modal.querySelector('h3');
const message = modal.querySelector('p');

if (student.is_archived) {
    // RESTORE
    if (title) title.textContent = '♻️ Restore Student';
    if (message) message.textContent = 'This will restore the student and mark them as Active again.';
    if (confirmBtn) {
        confirmBtn.textContent = 'Restore';
        confirmBtn.style.background = '#28a745';
    }
} else {
    // ARCHIVE
    if (title) title.textContent = '📦 Archive Student';
    if (message) message.textContent = 'This will archive the student. They will no longer appear in active lists but data will be preserved.';
    if (confirmBtn) {
        confirmBtn.textContent = 'Archive';
        confirmBtn.style.background = '#ffc107';
    }
}

if (nameEl) nameEl.textContent = student.name;
modal.style.display = 'block';
}
function closeArchiveModal() {
const modal = document.getElementById('archive-modal');
if (modal) modal.style.display = 'none';
studentToArchive = null;
}
async function confirmArchive() {
if (!studentToArchive) {
showToast('No student selected', 'error');
return;
}
const confirmBtn = document.getElementById('confirm-archive');
const originalText = confirmBtn ? confirmBtn.textContent : 'Archive';

const studentId = studentToArchive.id;
const studentName = studentToArchive.name;
const isArchiving = !studentToArchive.is_archived;

try {
    if (confirmBtn) {
        confirmBtn.disabled = true;
        const actionText = isArchiving ? 'Archiving' : 'Restoring';
        confirmBtn.textContent = `${actionText}...`;
    }
    
    const apiUrl = isArchiving ? '../../api/archive_student.php' : '../../api/restore_student.php';
    
    const requestData = {
        student_id: studentId,
        reason: isArchiving ? 'Manual archive' : undefined,
        archived_by: 'Admin',
        restored_by: isArchiving ? undefined : 'Admin',
        notes: isArchiving ? 'Archived from student management' : 'Restored from archive'
    };
    
    console.log('📤 Request:', apiUrl, requestData);
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    console.log('✅ Response:', result);
    
    if (result.success) {
        const action = isArchiving ? 'archived' : 'restored';
        
        closeArchiveModal();
        studentToArchive = null;
        
        showToast(`Student ${action}! Reloading...`, 'success');
        
        studentsData = [];
        await loadStudentsFromDatabase();
        
        showToast(`✅ Student ${action} successfully!`, 'success');
    } else {
        throw new Error(result.message || `Failed to ${isArchiving ? 'archive' : 'restore'}`);
    }
    
} catch (error) {
    console.error('❌ Error:', error);
    showToast(`Error: ${error.message}`, 'error');
} finally {
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}
}

// ============================================================
// EXPORT FUNCTIONALITY
// ============================================================
function exportAllStudentsPDF() {
const statusFilter = document.getElementById('filter-status');
const courseFilter = document.getElementById('filter-course');
const yearFilter = document.getElementById('filter-year');
const sortSelect = document.getElementById('sort-students');
const params = new URLSearchParams({
    status: statusFilter ? statusFilter.value : 'active',
    course: courseFilter ? courseFilter.value : 'all',
    year: yearFilter ? yearFilter.value : 'all',
    sort: sortSelect ? sortSelect.value : 'id-asc'
});

const url = `../../api/export_all_students_pdf.php?${params.toString()}`;

console.log('📄 Exporting PDF:', url);
showToast('Generating PDF report...', 'success');

window.location.href = url;
}
function exportStudentReport() {
if (!window.currentViewingStudent) {
showToast('No student selected', 'error');
return;
}
const studentId = window.currentViewingStudent.id;
const url = `../../api/export_individual_student_pdf.php?student_id=${studentId}`;

console.log('📄 Exporting individual PDF:', url);
showToast('Generating student report...', 'success');

window.location.href = url;}