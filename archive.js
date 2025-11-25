// ============================================================
// ARCHIVE MANAGEMENT MODULE
// ============================================================

let archivedStudentsData = [];
let studentToRestore = null;
let isLoadingArchive = false;
let currentArchiveFilters = {
    course: 'all',
    year: 'all',
    search: ''
};

// ============================================================
// INITIALIZATION
// ============================================================

function initializeArchive() {
    console.log('Initializing archive management...');
    
    setTimeout(() => {
        loadArchivedStudents();
        attachArchiveEventListeners();
    }, 300);
}

// ============================================================
// LOAD ARCHIVED STUDENTS
// ============================================================

async function loadArchivedStudents() {
    if (isLoadingArchive) return;
    
    isLoadingArchive = true;
    const tbody = document.getElementById('archive-table-body');
    
    if (!tbody) {
        isLoadingArchive = false;
        return;
    }
    
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
                <p>Loading archived students...</p>
            </td>
        </tr>
    `;
    
    try {
        const response = await fetch('../../api/get_archived_students.php');
        const result = await response.json();
        
        if (result.success) {
            archivedStudentsData = result.data;
            populateArchiveFilters();
            renderArchiveTable();
            updateArchiveStats();
            showToast(`Loaded ${result.data.length} archived students`, 'success');
        } else {
            throw new Error(result.message || 'Failed to load archived students');
        }
    } catch (error) {
        console.error('Error loading archived students:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
                    <p style="font-size: 18px; margin-bottom: 10px;">❌ Error Loading Archived Students</p>
                    <p style="margin-bottom: 15px;">${error.message}</p>
                    <button class="btn" onclick="loadArchivedStudents()">Retry</button>
                </td>
            </tr>
        `;
        showToast('Failed to load archived students', 'error');
    } finally {
        isLoadingArchive = false;
    }
}

// ============================================================
// POPULATE FILTERS
// ============================================================

function populateArchiveFilters() {
    const courseFilter = document.getElementById('archive-filter-course');
    if (!courseFilter) return;
    
    // Get unique courses from archived students
    const courses = [...new Set(archivedStudentsData.map(s => s.course))].filter(c => c && c !== 'N/A').sort();
    
    courseFilter.innerHTML = '<option value="all">All Courses</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        courseFilter.appendChild(option);
    });
}

// ============================================================
// APPLY FILTERS & SORTING
// ============================================================

function applyArchiveFilters() {
    let filteredData = [...archivedStudentsData];
    
    // Apply course filter
    if (currentArchiveFilters.course !== 'all') {
        filteredData = filteredData.filter(s => s.course === currentArchiveFilters.course);
    }
    
    // Apply year filter
    if (currentArchiveFilters.year !== 'all') {
        filteredData = filteredData.filter(s => s.year_level === currentArchiveFilters.year);
    }
    
    // Apply search filter
    if (currentArchiveFilters.search) {
        const searchTerm = currentArchiveFilters.search.toLowerCase();
        filteredData = filteredData.filter(student => {
            return student.student_id.toString().toLowerCase().includes(searchTerm) ||
                   student.first_name.toLowerCase().includes(searchTerm) ||
                   student.last_name.toLowerCase().includes(searchTerm) ||
                   student.course.toLowerCase().includes(searchTerm);
        });
    }
    
    // Update filter info
    const filterInfo = document.getElementById('archive-filter-info');
    if (filterInfo) {
        const parts = [];
        if (currentArchiveFilters.course !== 'all') parts.push(currentArchiveFilters.course);
        if (currentArchiveFilters.year !== 'all') parts.push(currentArchiveFilters.year);
        if (currentArchiveFilters.search) parts.push(`Search: "${currentArchiveFilters.search}"`);
        
        filterInfo.textContent = parts.length > 0 
            ? `Showing ${filteredData.length} students (${parts.join(', ')})`
            : `Showing all ${filteredData.length} archived students`;
    }
    
    return filteredData;
}

function sortArchiveData(sortType, data) {
    let sortedData = [...data];
    
    switch(sortType) {
        case 'date-newest':
            sortedData.sort((a, b) => new Date(b.archived_date) - new Date(a.archived_date));
            break;
        case 'date-oldest':
            sortedData.sort((a, b) => new Date(a.archived_date) - new Date(b.archived_date));
            break;
        case 'name-asc':
            sortedData.sort((a, b) => {
                const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-desc':
            sortedData.sort((a, b) => {
                const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                return nameB.localeCompare(nameA);
            });
            break;
        case 'id-asc':
            sortedData.sort((a, b) => a.student_id - b.student_id);
            break;
        case 'id-desc':
            sortedData.sort((a, b) => b.student_id - a.student_id);
            break;
    }
    
    return sortedData;
}

// ============================================================
// RENDER ARCHIVE TABLE
// ============================================================

function renderArchiveTable() {
    let data = applyArchiveFilters();
    
    const sortSelect = document.getElementById('archive-sort');
    if (sortSelect) {
        data = sortArchiveData(sortSelect.value, data);
    }
    
    const tbody = document.getElementById('archive-table-body');
    
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                    <p style="font-size: 18px; margin-bottom: 10px;">📋 No archived students found</p>
                    <p>Try adjusting your filters or check back later</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map(student => {
        const fullName = `${student.first_name} ${student.last_name}`;
        const archivedDate = new Date(student.archived_date);
        const formattedDate = archivedDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
        
        const reasonColors = {
            'Excessive absences': '#dc3545',
            'Manual archive': '#ffc107',
            'Administrative': '#0066cc',
            'Other': '#6c757d'
        };
        
        const reasonColor = reasonColors[student.archive_reason] || '#6c757d';
        
        return `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.student_id}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${fullName}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: #e8f4fd; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #0066cc;">
                        ${student.course}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.year_level}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="font-size: 12px; color: #666;">${formattedDate}</span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: ${reasonColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                        ${student.archive_reason}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 12px; color: #666;">
                    ${student.archived_by || 'System'}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #0066cc;" onclick="viewArchiveHistory('${student.student_id}')">📊 History</button>
                        <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #28a745;" onclick="initiateRestore('${student.student_id}')">♻️ Restore</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================================
// UPDATE STATISTICS
// ============================================================

function updateArchiveStats() {
    const total = archivedStudentsData.length;
    const thisMonth = archivedStudentsData.filter(s => {
        const archivedDate = new Date(s.archived_date);
        const now = new Date();
        return archivedDate.getMonth() === now.getMonth() && 
               archivedDate.getFullYear() === now.getFullYear();
    }).length;
    
    const highAbsences = archivedStudentsData.filter(s => 
        s.archive_reason.toLowerCase().includes('excessive') || 
        s.archive_reason.toLowerCase().includes('absence')
    ).length;
    
    const manualArchive = archivedStudentsData.filter(s => 
        s.archive_reason.toLowerCase().includes('manual')
    ).length;
    
    const totalEl = document.getElementById('total-archived-count');
    const monthEl = document.getElementById('archived-this-month-count');
    const absencesEl = document.getElementById('high-absences-count');
    const manualEl = document.getElementById('manual-archive-count');
    
    if (totalEl) totalEl.textContent = total;
    if (monthEl) monthEl.textContent = thisMonth;
    if (absencesEl) absencesEl.textContent = highAbsences;
    if (manualEl) manualEl.textContent = manualArchive;
}

// ============================================================
// ARCHIVE HISTORY
// ============================================================

window.viewArchiveHistory = async function(studentId) {
    const student = archivedStudentsData.find(s => s.student_id.toString() === studentId.toString());
    if (!student) return;
    
    document.getElementById('history-student-name').textContent = `${student.first_name} ${student.last_name}`;
    document.getElementById('history-student-id').textContent = student.student_id;
    
    const timelineDiv = document.getElementById('archive-history-timeline');
    timelineDiv.innerHTML = '<p style="text-align: center; color: #666;">Loading history...</p>';
    
    try {
        const response = await fetch(`../../api/get_archive_history.php?student_id=${studentId}`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            timelineDiv.innerHTML = result.data.map((event, index) => {
                const eventDate = new Date(event.action_date);
                const formattedDate = eventDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const actionColor = event.action === 'archive' ? '#dc3545' : '#28a745';
                const actionIcon = event.action === 'archive' ? '📦' : '♻️';
                
                return `
                    <div style="margin-bottom: 20px; padding-bottom: 20px; ${index < result.data.length - 1 ? 'border-bottom: 1px solid #e0e0e0;' : ''}">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 20px; height: 20px; background: ${actionColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${actionColor};"></div>
                            <div style="flex: 1;">
                                <p style="margin: 0; font-weight: 600; color: var(--dark-blue);">
                                    ${actionIcon} ${event.action.charAt(0).toUpperCase() + event.action.slice(1)} - ${formattedDate}
                                </p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                    <strong>By:</strong> ${event.performed_by || 'System'}
                                </p>
                                ${event.reason ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                    <strong>Reason:</strong> ${event.reason}
                                </p>` : ''}
                                ${event.notes ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                    <strong>Notes:</strong> ${event.notes}
                                </p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            timelineDiv.innerHTML = '<p style="text-align: center; color: #666;">No history found for this student.</p>';
        }
    } catch (error) {
        console.error('Error loading archive history:', error);
        timelineDiv.innerHTML = '<p style="text-align: center; color: #dc3545;">Error loading history</p>';
    }
    
    document.getElementById('archive-history-modal').style.display = 'block';
};

// ============================================================
// RESTORE FUNCTIONALITY
// ============================================================

window.initiateRestore = function(studentId) {
    const student = archivedStudentsData.find(s => s.student_id.toString() === studentId.toString());
    if (!student) return;
    
    studentToRestore = student;
    const fullName = `${student.first_name} ${student.last_name}`;
    
    document.getElementById('restore-student-name').textContent = fullName;
    document.getElementById('restore-modal').style.display = 'block';
};

async function confirmRestore() {
    if (!studentToRestore) return;
    
    try {
        const confirmBtn = document.getElementById('confirm-restore');
        const originalText = confirmBtn.textContent;
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Restoring...';
        
        const response = await fetch('../../api/restore_student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: studentToRestore.student_id,
                restored_by: 'Admin'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeRestoreModal();
            await loadArchivedStudents();
            showToast('Student restored successfully', 'success');
        } else {
            throw new Error(result.message || 'Failed to restore student');
        }
        
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
        
    } catch (error) {
        console.error('Error restoring student:', error);
        showToast(`Error: ${error.message}`, 'error');
        
        const confirmBtn = document.getElementById('confirm-restore');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Restore';
        }
    }
}

function closeRestoreModal() {
    const modal = document.getElementById('restore-modal');
    if (modal) modal.style.display = 'none';
    studentToRestore = null;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function attachArchiveEventListeners() {
    const searchInput = document.getElementById('archive-search');
    const courseFilter = document.getElementById('archive-filter-course');
    const yearFilter = document.getElementById('archive-filter-year');
    const sortSelect = document.getElementById('archive-sort');
    const refreshBtn = document.getElementById('refresh-archive');
    const exportBtn = document.getElementById('export-archive-pdf');
    
    searchInput?.addEventListener('input', (e) => {
        currentArchiveFilters.search = e.target.value;
        renderArchiveTable();
    });
    
    courseFilter?.addEventListener('change', (e) => {
        currentArchiveFilters.course = e.target.value;
        renderArchiveTable();
    });
    
    yearFilter?.addEventListener('change', (e) => {
        currentArchiveFilters.year = e.target.value;
        renderArchiveTable();
    });
    
    sortSelect?.addEventListener('change', (e) => {
        renderArchiveTable();
    });
    
    refreshBtn?.addEventListener('click', () => {
        loadArchivedStudents();
        showToast('Refreshing archived students...', 'success');
    });
    
    exportBtn?.addEventListener('click', exportArchivePDF);
    
    document.getElementById('close-history-modal')?.addEventListener('click', () => {
        document.getElementById('archive-history-modal').style.display = 'none';
    });
    
    document.getElementById('close-history-btn')?.addEventListener('click', () => {
        document.getElementById('archive-history-modal').style.display = 'none';
    });
    
    document.getElementById('confirm-restore')?.addEventListener('click', confirmRestore);
    document.getElementById('cancel-restore')?.addEventListener('click', closeRestoreModal);
}

// ============================================================
// EXPORT TO PDF
// ============================================================

function exportArchivePDF() {
    const courseFilter = document.getElementById('archive-filter-course');
    const yearFilter = document.getElementById('archive-filter-year');
    const sortSelect = document.getElementById('archive-sort');
    
    const params = new URLSearchParams({
        course: courseFilter ? courseFilter.value : 'all',
        year: yearFilter ? yearFilter.value : 'all',
        sort: sortSelect ? sortSelect.value : 'date-newest'
    });
    
    const url = `../../api/export_archived_students_pdf.php?${params.toString()}`;
    
    showToast('Generating PDF report...', 'success');
    window.location.href = url;
    
    setTimeout(() => {
        showToast('PDF download started!', 'success');
    }, 1000);
}