<!-- Event Attendance Page (Hidden by default) -->
<div class="page" id="event-attendance">
    <div class="page-header">
        <h1 class="page-title" id="attendance-event-title">Event Attendance</h1>
        <p class="page-subtitle" id="attendance-event-subtitle">Track student attendance for this event</p>
    </div>
    
    <div class="content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <div>
                <h3 style="color: var(--dark-blue); margin-bottom: 5px;">Event Information</h3>
                <div id="event-info" style="font-size: 14px; color: #666;"></div>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-secondary" id="back-to-events">← Back to Events</button>
                <button class="btn" id="export-attendance">Export Attendance</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div class="stat-card">
                <div class="stat-number" id="total-registered">0</div>
                <div class="stat-label">Registered</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="total-present">0</div>
                <div class="stat-label">Present</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="attendance-rate">0%</div>
                <div class="stat-label">Attendance Rate</div>
            </div>
        </div>

        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--light-blue-bg);">
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Time</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Student ID</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Name</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">QR Code</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Status</th>
                    </tr>
                </thead>
                <tbody id="attendance-list">
                    <tr>
                        <td colspan="5" style="padding: 20px; text-align: center; color: #666;">
                            Waiting for students to scan QR code...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>