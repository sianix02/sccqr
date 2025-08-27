<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../images/logo.png">
    <title>Dashboard with Enhanced Analytics</title>
    <script src="../../script/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../../css/admin_home.css">
</head>
<body>
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" id="mobile-menu-btn">
        <span style="font-size: 18px;">☰</span>
    </button>
    
    <!-- Mobile Overlay -->
    <div class="mobile-overlay" id="mobile-overlay"></div>
    
    <!-- Sidebar -->
    <nav class="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <div class="logo">
                    <div class="logo-inner"><img src="../../images/logo.png" alt=""></div>
                </div>
                <div class="sidebar-title">Dashboard</div>
            </div>
        </div>
        
        <ul class="sidebar-nav">
            <li class="nav-item">
                <button class="nav-button active" data-page="home">
                    <span class="nav-icon">🏠</span>
                    Home
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-button" data-page="start-event">
                    <span class="nav-icon">🎉</span>
                    Start Event
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-button" data-page="students">
                    <span class="nav-icon">👥</span>
                    Students
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-button" data-page="create-account">
                    <span class="nav-icon">➕</span>
                    Create Account
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-button" data-page="logout">
                    <span class="nav-icon">🚪</span>
                    Log Out
                </button>
            </li>
        </ul>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Home Page -->
        <div class="page active" id="home">
            <div class="page-header">
                <h1 class="page-title">Welcome to Admin Dashboard</h1>
                <p class="page-subtitle">Overview of your system analytics and performance</p>
            </div>

            <!-- Enhanced Chart Section -->
            <div class="content-card" style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="color: var(--dark-blue); margin-bottom: 5px;">Analytics Overview</h3>
                        <p style="color: #666; font-size: 14px;">Student engagement and event participation trends</p>
                    </div>
                    <div class="chart-controls">
                        <select id="timeRange">
                            <option value="6months">Last 6 Months</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="1year">Last Year</option>
                        </select>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="enhancedChart"></canvas>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">247</div>
                    <div class="stat-label">Total Students</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">12</div>
                    <div class="stat-label">Active Events</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">89</div>
                    <div class="stat-label">User Accounts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">98%</div>
                    <div class="stat-label">System Uptime</div>
                </div>
            </div>
            
            <div class="content-card">
                <h3 style="margin-bottom: 15px; color: var(--dark-blue);">Recent Activity</h3>
                <p>Welcome to the enhanced dashboard! The analytics chart above shows real-time performance metrics including student attendance, event participation, and course completion rates.</p>
            </div>
        </div>

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
                            <option value="BASKETBALL">Basketball</option>
                            <option value="VOLLEYBALL">Volleyball</option>
                            <option value="CHESS">Chess</option>
                            <option value="DEBATE">Debate</option>
                            <option value="STUDENT-COUNCIL">Student Council</option>
                            <option value="WORKSHOP">Workshop</option>
                            <option value="SEMINAR">Seminar</option>
                            <option value="COMPETITION">Competition</option>
                            <option value="CLUB">Club Meeting</option>
                            <option value="CLUB">Program</option>

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

        <!-- Create Account Page -->
        <div class="page" id="create-account">
            <div class="page-header">
                <h1 class="page-title">Create New Account</h1>
                <p class="page-subtitle">Add a new user to the system</p>
            </div>
            
            <div class="content-card">
                <form>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter username">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" placeholder="Enter email address">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="Enter password">
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" placeholder="Confirm password">
                    </div>
                    
                    <div class="form-group">
                        <label for="role">User Role</label>
                        <select id="role">
                            <option value="">Select role</option>
                            <option value="admin">Administrator</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn">Create Account</button>
                </form>
            </div>
        </div>

        <!-- Logout Page -->
        <div class="page" id="logout">
            <div class="page-header">
                <h1 class="page-title">Logout</h1>
                <p class="page-subtitle">Sign out of your account</p>
            </div>
            
            <div class="content-card" style="text-align: center;">
                <h3 style="color: var(--dark-blue); margin-bottom: 20px;">Are you sure you want to logout?</h3>
                <p style="margin-bottom: 30px; color: #666;">You will be redirected to the login page.</p>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn btn-danger">Yes, Logout</button>
                    <button class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </main>

    <script src="../../script/admin-home.js"></script>
</body>
</html>