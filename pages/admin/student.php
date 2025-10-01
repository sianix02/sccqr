<!-- Students Page -->
<div class="page" id="students">
    <div class="page-header">
        <h1 class="page-title">Student Management</h1>
        <p class="page-subtitle">Manage student records and information</p>
    </div>
    
    <div class="content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: var(--dark-blue);">Student List</h3>
            <button class="btn">Add New Student</button>
        </div>
        
        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--light-blue-bg);">
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">ID</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Name</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Email</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Status</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">001</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">John Doe</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">john@example.com</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">Active</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">
                            <button class="btn" style="font-size: 12px; padding: 6px 12px;">Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">002</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">Jane Smith</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">jane@example.com</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">Active</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">
                            <button class="btn" style="font-size: 12px; padding: 6px 12px;">Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>