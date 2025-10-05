<!-- Create Account Page -->
<div class="page" id="create-account">
    <div class="page-header">
        <h1 class="page-title">Create New Account</h1>
        <p class="page-subtitle">Add a new user to the system</p>
    </div>
    
    <div class="content-card">
        <form action='../../sql_php/create.php' method='post' id='create-account-form'>
            <div class="form-group">
                <label for="username">ID</label>
                <input type="text" id="username" placeholder="Enter Client ID" name='id' required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter password" name='psw' required>
            </div>
            
            <div class="form-group">
                <label for="role">User Role</label>
                <select id="role" name='role' required onchange="togglePositionField()">
                    <option value="">Select role</option>
                    <option value="admin">Administrator</option>
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                </select>
            </div>
            
            <!-- Position field for instructor (hidden by default) -->
            <div class="form-group" id="position-group" style="display: none;">
                <label for="position">Position</label>
                <select id="position" name='position'>
                    <option value="">Select position</option>
                    <option value="Dean">Dean</option>
                    <option value="Adviser">Adviser</option>
                </select>
            </div>
            
            <button type="submit" class="btn" name="btn">Create Account</button>
        </form>
    </div>
</div>

<script>
function togglePositionField() {
    const roleSelect = document.getElementById('role');
    const positionGroup = document.getElementById('position-group');
    const positionSelect = document.getElementById('position');
    
    if (roleSelect.value === 'instructor') {
        positionGroup.style.display = 'block';
        positionSelect.required = true;
    } else {
        positionGroup.style.display = 'none';
        positionSelect.required = false;
        positionSelect.value = '';
    }
}
</script>