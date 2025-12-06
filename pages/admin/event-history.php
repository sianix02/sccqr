<!-- Event History Page -->
<div class="page" id="event-history">
    <div class="page-header">
        <h1 class="page-title">Event History</h1>
        <p class="page-subtitle">View and manage all previous events and their QR codes</p>
    </div>

    <!-- Filter Controls -->
    <div class="content-card">
        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center; margin-bottom: 20px;">
            <div style="flex: 1; min-width: 250px;">
                <input type="text" id="event-search" placeholder="🔍 Search events..." 
                    style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px;">
            </div>
            
            <select id="filter-event-status" style="padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; min-width: 150px;">
                <option value="all">All Events</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            
            <select id="filter-event-type" style="padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; min-width: 150px;">
                <option value="all">All Types</option>
                <option value="First">First Year</option>
                <option value="Second">Second Year</option>
                <option value="Third">Third Year</option>
                <option value="Fourth">Fourth Year</option>
                <option value="All Year Level">All Year Level</option>
            </select>
            
            <button class="btn" id="refresh-events" style="white-space: nowrap;">
                🔄 Refresh
            </button>
        </div>
        
        <div id="event-filter-info" style="font-size: 14px; color: #666; font-style: italic;"></div>
    </div>

    <!-- Events Stats -->
    <div class="stats-grid" style="margin-bottom: 30px;">
        <div class="stat-card">
            <div class="stat-number" id="total-events-count">0</div>
            <div class="stat-label">Total Events</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="active-events-count">0</div>
            <div class="stat-label">Active Events</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="completed-events-count">0</div>
            <div class="stat-label">Completed Events</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="total-participants-count">0</div>
            <div class="stat-label">Total Participants</div>
        </div>
    </div>

    <!-- Events Table -->
    <div class="content-card">
        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--light-blue-bg); border-bottom: 2px solid var(--primary-blue);">
                        <th style="padding: 15px; text-align: left; font-weight: 600; color: var(--dark-blue);">Event Name</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; color: var(--dark-blue);">Date & Time</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; color: var(--dark-blue);">Type</th>
                        <th style="padding: 15px; text-align: center; font-weight: 600; color: var(--dark-blue);">Participants</th>
                        <th style="padding: 15px; text-align: center; font-weight: 600; color: var(--dark-blue);">Status</th>
                        <th style="padding: 15px; text-align: center; font-weight: 600; color: var(--dark-blue);">Actions</th>
                    </tr>
                </thead>
                <tbody id="events-table-body">
                    <tr>
                        <td colspan="6" style="padding: 40px; text-align: center; color: #666;">
                            <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
                            <p>Loading events...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- QR Code Viewer Modal -->
<div id="qr-viewer-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 2000; overflow-y: auto;">
    <div style="background: white; margin: 50px auto; max-width: 600px; border-radius: 16px; padding: 30px; position: relative;">
        <button id="close-qr-viewer" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 28px; cursor: pointer; color: #666; line-height: 1;">×</button>
        
        <h3 style="color: var(--dark-blue); margin-bottom: 20px; text-align: center;">Event QR Code</h3>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
                <strong style="color: var(--dark-blue);">Event Name:</strong>
                <div id="qr-event-name" style="font-size: 18px; color: #333; margin-top: 5px;"></div>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: var(--dark-blue);">Date & Time:</strong>
                <div id="qr-event-date" style="color: #666; margin-top: 5px;"></div>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: var(--dark-blue);">Event Type:</strong>
                <div id="qr-event-type" style="color: #666; margin-top: 5px;"></div>
            </div>
            <div>
                <strong style="color: var(--dark-blue);">Event Code:</strong>
                <div id="qr-event-code" style="font-family: monospace; background: white; padding: 8px; border-radius: 4px; margin-top: 5px; word-break: break-all;"></div>
            </div>
        </div>
        
        <div id="qr-preview-container" style="text-align: center; margin: 30px 0;">
            <!-- QR Code will be generated here -->
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button class="btn" id="download-event-qr" style="background: #28a745;">
                📥 Download QR Image
            </button>
            <button class="btn btn-secondary" id="close-qr-viewer-btn">
                Close
            </button>
        </div>
    </div>
</div>

<!-- Event Details Modal -->
<div id="event-details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 2000; overflow-y: auto;">
    <div style="background: white; margin: 50px auto; max-width: 800px; border-radius: 16px; padding: 30px; position: relative;">
        <button id="close-event-details" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 28px; cursor: pointer; color: #666; line-height: 1;">×</button>
        
        <h3 style="color: var(--dark-blue); margin-bottom: 20px;">Event Details</h3>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
                <strong>Event Name:</strong>
                <div id="detail-event-name" style="font-size: 18px; margin-top: 5px;"></div>
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Description:</strong>
                <div id="detail-event-description" style="margin-top: 5px; color: #666;"></div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <div>
                    <strong>Date & Time:</strong>
                    <div id="detail-event-datetime" style="color: #666; margin-top: 5px;"></div>
                </div>
                <div>
                    <strong>Event Type:</strong>
                    <div id="detail-event-type-text" style="color: #666; margin-top: 5px;"></div>
                </div>
                <div>
                    <strong>Status:</strong>
                    <div id="detail-event-status" style="margin-top: 5px;"></div>
                </div>
            </div>
        </div>
        
        <h4 style="color: var(--dark-blue); margin: 25px 0 15px;">Attendance Summary</h4>
        <div class="stats-grid" style="margin-bottom: 25px;">
            <div class="stat-card">
                <div class="stat-number" id="detail-total-participants">0</div>
                <div class="stat-label">Total Participants</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-present-count">0</div>
                <div class="stat-label">Present</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-late-count">0</div>
                <div class="stat-label">Late</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-absent-count">0</div>
                <div class="stat-label">Absent</div>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button class="btn btn-secondary" id="close-event-details-btn">Close</button>
        </div>
    </div>
</div>