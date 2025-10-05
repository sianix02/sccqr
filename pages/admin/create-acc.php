<!-- Create Account Page -->
<div class="page" id="create-account">
    <div class="page-header">
        <h1 class="page-title">Create New Account</h1>
        <p class="page-subtitle">Add a new user to the system</p>
    </div>
    
    <div class="content-card">
        <form action='../../sql_php/create.php' method='post'>
            <div class="form-group">
                <label for="username">ID</label>
                <input type="text" id="username" placeholder="Enter Client ID" name='id'>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter password" name='psw'>
            </div>
            
            <div class="form-group">
                <label for="role">User Role</label>
                <select id="role" name='role'>
                    <option value="">Select role</option>
                    <option value="admin">Administrator</option>
                    <option value="teacher">Instructorr</option>
                    <option value="student">Student</option>
                </select>
            </div>
            
            <button type="submit" class="btn" name="btn">Create Account</button>
        </form>
    </div>
</div>