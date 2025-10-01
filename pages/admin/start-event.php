<!-- Start Event Page -->
<div class="page" id="start-event">
    <div class="page-header">
        <h1 class="page-title">Start New Event</h1>
        <p class="page-subtitle">Create and configure a new event with QR code generation</p>
    </div>
    
    <div class="content-card">
        <form id="event-form">
            <div class="form-group">
                <label for="event-name">Event Name</label>
                <input type="text" id="event-name" placeholder="Enter event name" required>
                <small style="color: #666; font-size: 12px;">Example: Basketball Tournament, Chess Club Meeting</small>
            </div>
            
            <div class="form-group">
                <label for="event-date">Event Date</label>
                <input type="datetime-local" id="event-date" required>
            </div>
            
            <div class="form-group">
                <label for="event-type">Event Category</label>
                <select id="event-type" required>
                    <option value="">Select event category</option>
                    <option value="First">For First Year</option>
                    <option value="Second">For Second Year</option>
                    <option value="Third">For Third Year</option>
                    <option value="Fourth">For Fourth Year</option>
                    <option value="PROGRAM">Program</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="event-description">Description</label>
                <textarea id="event-description" rows="4" placeholder="Describe the event" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="max-participants">Maximum Participants</label>
                <input type="number" id="max-participants" placeholder="Enter maximum number of participants">
            </div>
            
            <button type="submit" class="btn">Generate Event QR Code</button>
        </form>
    </div>

    <!-- QR Code Generation Section -->
    <div class="content-card" id="qr-section" style="display: none;">
        <div style="text-align: center;">
            <h3 style="color: var(--dark-blue); margin-bottom: 15px;">Event QR Code Generated Successfully!</h3>
            <div id="qr-code-container" style="margin: 20px auto; display: inline-block; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);"></div>
            
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--primary-blue);">
                <p style="margin: 0; font-weight: 600; color: var(--dark-blue);">QR Code Details:</p>
                <p style="margin: 5px 0; font-family: monospace; background: white; padding: 8px; border-radius: 4px; word-break: break-all;" id="qr-code-text"></p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Students can scan this QR code to join the event</p>
            </div>

            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                <button class="btn" id="download-qr">Download QR Code</button>
                <button class="btn btn-secondary" id="copy-qr-code">Copy QR Code</button>
                <button class="btn" id="view-event-page" style="background-color: #28a745;">View Event Page</button>
                <button class="btn btn-secondary" id="create-new-event">Create New Event</button>
            </div>
        </div>
    </div>
</div>