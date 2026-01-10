// Instructor Management JavaScript - Enhanced for Multiple Sets (Dynamic from Database)
let instructors = [];
let filteredInstructors = [];
let availableSets = []; // Will be loaded from database

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeInstructorPage();
});

function initializeInstructorPage() {
    loadAvailableSets(); // Load sets first
    loadInstructors();
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('instructor-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterInstructors);
    }

    // Filters
    const setFilter = document.getElementById('filter-set');
    const positionFilter = document.getElementById('filter-position');
    
    if (setFilter) setFilter.addEventListener('change', filterInstructors);
    if (positionFilter) positionFilter.addEventListener('change', filterInstructors);

    // Position change handler - NEW
    const positionSelect = document.getElementById('instructor-position');
    if (positionSelect) {
        positionSelect.addEventListener('change', handlePositionChange);
    }

    // Modal Controls
    const cancelBtn = document.getElementById('cancel-instructor-btn');
    const form = document.getElementById('instructor-form');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeInstructorModal);
    }
    
    if (form) {
        form.addEventListener('submit', handleInstructorFormSubmit);
    }

    // Delete Modal Controls
    const cancelDeleteBtn = document.getElementById('cancel-delete-instructor-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-instructor-btn');
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteInstructor);
    }

    // Close modal on outside click
    const instructorModal = document.getElementById('instructor-modal');
    const deleteModal = document.getElementById('delete-instructor-modal');
    
    if (instructorModal) {
        instructorModal.addEventListener('click', function(e) {
            if (e.target === instructorModal) {
                closeInstructorModal();
            }
        });
    }
    
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }
}

// NEW: Handle position change to auto-set year level
function handlePositionChange(e) {
    const position = e.target.value;
    const yearLevelSelect = document.getElementById('instructor-year-level');
    
    if (!yearLevelSelect) return;
    
    if (position === 'Department Head') {
        // Set to "All Year Level" and disable the field
        yearLevelSelect.value = 'All Year Level';
        yearLevelSelect.disabled = true;
        yearLevelSelect.style.backgroundColor = '#f0f0f0';
        yearLevelSelect.style.cursor = 'not-allowed';
    } else {
        // Enable the field for other positions
        yearLevelSelect.disabled = false;
        yearLevelSelect.style.backgroundColor = '';
        yearLevelSelect.style.cursor = '';
        
        // If it was previously set to "All Year Level", clear it
        if (yearLevelSelect.value === 'All Year Level') {
            yearLevelSelect.value = '';
        }
    }
}

// Make functions global
window.editInstructor = editInstructor;
window.deleteInstructor = deleteInstructor;
window.toggleSetSelection = toggleSetSelection;

// Load available sets from database (from student table)
function loadAvailableSets() {
    fetch('../../api/a_instructor_handler.php?action=get_available_sets')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.sets) {
                availableSets = data.sets;
                populateSetFilters();
            } else {
                // Fallback to default sets if API fails
                availableSets = ['Set A', 'Set B', 'Set C', 'Set D'];
                populateSetFilters();
            }
        })
        .catch(error => {
            console.error('Error loading sets:', error);
            // Fallback to default sets
            availableSets = ['Set A', 'Set B', 'Set C', 'Set D'];
            populateSetFilters();
        });
}

// Populate set filter dropdown
function populateSetFilters() {
    const setFilter = document.getElementById('filter-set');
    if (!setFilter) return;
    
    // Store current value
    const currentValue = setFilter.value;
    
    // Clear existing options
    setFilter.innerHTML = '';
    
    // Add "All Sets" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Sets';
    setFilter.appendChild(allOption);
    
    // Add available sets from database
    availableSets.forEach(set => {
        const option = document.createElement('option');
        option.value = set;
        option.textContent = set;
        setFilter.appendChild(option);
    });
    
    // Add "Unassigned" option
    const unassignedOption = document.createElement('option');
    unassignedOption.value = 'Unassigned';
    unassignedOption.textContent = 'Unassigned';
    setFilter.appendChild(unassignedOption);
    
    // Restore previous value if it still exists
    if (currentValue) {
        setFilter.value = currentValue;
    }
}

// Populate set checkboxes in modal
function populateSetCheckboxes() {
    const container = document.getElementById('set-checkboxes-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    availableSets.forEach(set => {
        const label = document.createElement('label');
        label.className = 'set-checkbox-label';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'assigned_sets';
        checkbox.value = set;
        checkbox.onchange = function() { toggleSetSelection(this); };
        
        const span = document.createElement('span');
        span.className = 'set-checkbox-text';
        span.textContent = set;
        
        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });
}

// Load instructors from database
function loadInstructors() {
    fetch('../../api/a_instructor_handler.php?action=get_all')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                instructors = data.instructors;
                filteredInstructors = instructors;
                displayInstructors(instructors);
                updateStatistics(instructors);
            } else {
                showError('Failed to load instructors');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error loading instructors');
        });
}

// Display instructors in table
function displayInstructors(instructorList) {
    const tbody = document.getElementById('instructor-table-body');
    
    if (!tbody) return;

    if (instructorList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div class="empty-state-icon">👨‍🏫</div>
                    <div class="empty-state-text">No instructors found</div>
                    <div class="empty-state-subtext">Try adjusting your filters or add a new instructor</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = instructorList.map(instructor => {
        // Capitalize each word in name
        const capitalizeWords = (str) => {
            return str.toLowerCase().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        };
        
        const firstName = capitalizeWords(instructor.first_name);
        const middleInitial = instructor.middle_initial ? instructor.middle_initial.toUpperCase() + '.' : '';
        const lastName = capitalizeWords(instructor.last_name);
        const fullName = `${firstName} ${middleInitial} ${lastName}`.trim();
        
        // Display assigned sets as badges
        // Department Heads show "All Sets" regardless of actual assignments
        const assignedSets = instructor.sets_array || [];
        let setsDisplay;
        
        if (instructor.position === 'Department Head') {
            setsDisplay = '<span class="set-badge all-sets" title="All Sets">All Sets</span>';
        } else if (assignedSets.length > 0) {
            setsDisplay = assignedSets.map(set => {
                const setClass = set.toLowerCase().replace(' ', '-');
                return `<span class="set-badge ${setClass}" title="${set}">${set}</span>`;
            }).join(' ') + ` <span class="set-count">(${assignedSets.length})</span>`;
        } else {
            setsDisplay = '<span class="set-badge unassigned">Not Assigned</span>';
        }
        
        const yearLevelClass = instructor.year_level_assigned ? instructor.year_level_assigned.toLowerCase().replace(' ', '-') : '';
        const yearLevelDisplay = instructor.year_level_assigned || 'Not Set';
        
        const positionClass = instructor.position ? instructor.position.toLowerCase().replace(' ', '-') : '';
        const positionDisplay = instructor.position ? instructor.position.toUpperCase() : 'NOT SET';
        
        return `
            <tr class="instructor-table-row">
                <td><strong>#${instructor.adviser_id}</strong></td>
                <td><strong>${fullName}</strong></td>
                <td><span class="department-badge">${instructor.department || 'Not Set'}</span></td>
                <td><span class="year-badge ${yearLevelClass}">${yearLevelDisplay}</span></td>
                <td>
                    <div class="sets-container">
                        ${setsDisplay}
                    </div>
                </td>
                <td><span class="position-badge ${positionClass}">${positionDisplay}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${instructor.adviser_id}" title="Edit Instructor">
                            ✏️ Edit
                        </button>
                        <button class="btn-delete" data-id="${instructor.adviser_id}" data-name="${fullName}" title="Delete Instructor">
                            🗑️ Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to buttons
    attachButtonListeners();
}

// Attach button listeners using event delegation
function attachButtonListeners() {
    const tbody = document.getElementById('instructor-table-body');
    if (!tbody) return;
    
    tbody.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            editInstructor(id);
        });
    });
    
    tbody.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            const name = this.getAttribute('data-name');
            deleteInstructor(id, name);
        });
    });
}

// Filter instructors
function filterInstructors() {
    const searchTerm = document.getElementById('instructor-search')?.value.toLowerCase() || '';
    const setFilter = document.getElementById('filter-set')?.value || '';
    const positionFilter = document.getElementById('filter-position')?.value || '';

    filteredInstructors = instructors.filter(instructor => {
        const fullName = `${instructor.first_name} ${instructor.middle_initial || ''} ${instructor.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm) || 
                            instructor.adviser_id.toString().includes(searchTerm);
        
        // Check if instructor has the filtered set
        let matchesSet;
        if (setFilter === 'Unassigned') {
            // Exclude Department Heads from "Unassigned" filter since they have "All Sets"
            matchesSet = instructor.position !== 'Department Head' && 
                        (!instructor.sets_array || instructor.sets_array.length === 0);
        } else if (setFilter) {
            // For specific set filters, check if instructor has that set
            matchesSet = instructor.sets_array && instructor.sets_array.includes(setFilter);
        } else {
            // No set filter applied
            matchesSet = true;
        }
        
        const matchesPosition = !positionFilter || instructor.position === positionFilter;

        return matchesSearch && matchesSet && matchesPosition;
    });

    displayInstructors(filteredInstructors);
    updateFilterInfo(searchTerm, setFilter, positionFilter);
}

// Update filter info text
function updateFilterInfo(search, set, position) {
    const infoElement = document.getElementById('instructor-filter-info');
    if (!infoElement) return;

    const filters = [];
    if (search) filters.push(`Search: "${search}"`);
    if (set) filters.push(`Set: ${set}`);
    if (position) filters.push(`Position: ${position}`);

    if (filters.length > 0) {
        infoElement.textContent = `Showing ${filteredInstructors.length} of ${instructors.length} instructors (${filters.join(', ')})`;
        infoElement.style.display = 'block';
    } else {
        infoElement.textContent = `Showing all ${instructors.length} instructors`;
        infoElement.style.display = 'block';
    }
}

// Update statistics
function updateStatistics(instructorList) {
    const total = instructorList.length;
    const departmentHeads = instructorList.filter(i => i.position === 'Department Head').length;
    const deans = instructorList.filter(i => i.position === 'Dean').length;
    const instructorCount = instructorList.filter(i => i.position === 'Instructor').length;

    document.getElementById('total-instructors').textContent = total;
    document.getElementById('department-head-count').textContent = departmentHeads;
    document.getElementById('dean-count').textContent = deans;
    document.getElementById('instructor-count').textContent = instructorCount;
}

// Open Add Instructor Modal
function openAddInstructorModal() {
    const modal = document.getElementById('instructor-modal');
    const title = document.getElementById('instructor-modal-title');
    const form = document.getElementById('instructor-form');
    
    if (modal && title && form) {
        title.textContent = 'Add New Instructor';
        form.reset();
        document.getElementById('instructor-modal-id').value = '';
        
        // Populate set checkboxes
        populateSetCheckboxes();
        
        // Clear all set selections
        clearSetSelections();
        
        // Reset year level field state
        const yearLevelSelect = document.getElementById('instructor-year-level');
        if (yearLevelSelect) {
            yearLevelSelect.disabled = false;
            yearLevelSelect.style.backgroundColor = '';
            yearLevelSelect.style.cursor = '';
        }
        
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

// Edit Instructor
function editInstructor(id) {
    const instructor = instructors.find(i => parseInt(i.adviser_id) === parseInt(id));
    
    if (!instructor) {
        showError('Instructor not found');
        return;
    }

    const modal = document.getElementById('instructor-modal');
    const title = document.getElementById('instructor-modal-title');
    
    if (modal && title) {
        title.textContent = 'Edit Instructor';
        
        document.getElementById('instructor-modal-id').value = instructor.adviser_id;
        document.getElementById('instructor-first-name').value = instructor.first_name;
        document.getElementById('instructor-middle-initial').value = instructor.middle_initial || '';
        document.getElementById('instructor-last-name').value = instructor.last_name;
        document.getElementById('instructor-department').value = instructor.department;
        document.getElementById('instructor-year-level').value = instructor.year_level_assigned || '';
        document.getElementById('instructor-position').value = instructor.position;
        
        // Populate set checkboxes first
        populateSetCheckboxes();
        
        // Handle year level field based on position
        const yearLevelSelect = document.getElementById('instructor-year-level');
        if (instructor.position === 'Department Head') {
            yearLevelSelect.disabled = true;
            yearLevelSelect.style.backgroundColor = '#f0f0f0';
            yearLevelSelect.style.cursor = 'not-allowed';
        } else {
            yearLevelSelect.disabled = false;
            yearLevelSelect.style.backgroundColor = '';
            yearLevelSelect.style.cursor = '';
        }
        
        // Set the assigned sets
        clearSetSelections();
        if (instructor.sets_array) {
            instructor.sets_array.forEach(set => {
                const checkbox = document.querySelector(`input[name="assigned_sets"][value="${set}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    toggleSetSelection(checkbox);
                }
            });
        }
        
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

// Clear all set selections
function clearSetSelections() {
    const checkboxes = document.querySelectorAll('input[name="assigned_sets"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
        const label = cb.closest('label');
        if (label) {
            label.classList.remove('selected');
        }
    });
}

// Toggle set selection (for UI feedback)
function toggleSetSelection(checkbox) {
    const label = checkbox.closest('label');
    if (label) {
        if (checkbox.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    }
}

// Close Instructor Modal
function closeInstructorModal() {
    const modal = document.getElementById('instructor-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Handle Form Submit
function handleInstructorFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('instructor-modal-id').value;
    const position = document.getElementById('instructor-position').value;
    
    // Get selected sets
    const selectedSets = Array.from(document.querySelectorAll('input[name="assigned_sets"]:checked'))
        .map(cb => cb.value);
    
    // Auto-set year level for Department Head
    let yearLevel = document.getElementById('instructor-year-level').value;
    if (position === 'Department Head') {
        yearLevel = 'All Year Level';
    }
    
    const formData = {
        first_name: document.getElementById('instructor-first-name').value,
        middle_initial: document.getElementById('instructor-middle-initial').value,
        last_name: document.getElementById('instructor-last-name').value,
        department: document.getElementById('instructor-department').value,
        year_level_assigned: yearLevel,
        position: position,
        assigned_sets: selectedSets
    };

    const action = id ? 'update' : 'create';
    if (id) formData.adviser_id = id;

    fetch(`../../api/a_instructor_handler.php?action=${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess(data.message);
            closeInstructorModal();
            loadInstructors();
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error saving instructor');
    });
}

// Delete Instructor
let instructorToDelete = null;

function deleteInstructor(id, name) {
    instructorToDelete = id;
    
    const modal = document.getElementById('delete-instructor-modal');
    const nameElement = document.getElementById('delete-instructor-name');
    
    if (modal && nameElement) {
        nameElement.textContent = name;
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-instructor-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    instructorToDelete = null;
}

function confirmDeleteInstructor() {
    if (!instructorToDelete) return;

    fetch(`../../api/a_instructor_handler.php?action=delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adviser_id: instructorToDelete })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess(data.message);
            closeDeleteModal();
            loadInstructors();
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error deleting instructor');
    });
}

// Show success message
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success show';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show error message
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error show';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}