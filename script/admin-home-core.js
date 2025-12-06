// ============================================================
// ADMIN-HOME-CORE.JS - Core Utilities & Non-Analytics Features
// Part 1: Global utilities, navigation, events, and logout
// ============================================================

// ============================================================
// GLOBAL UTILITIES
// ============================================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// PDF Header Helper Function
function addPDFHeader(doc) {
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 8.5, 1.8, 'F');

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.02);
    doc.circle(1.0, 0.9, 0.35, 'S');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('LOGO', 1.0, 0.92, { align: 'center' });

    doc.circle(7.5, 0.9, 0.35, 'S');
    doc.text('LOGO', 7.5, 0.92, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Republic of the Philippines', 4.25, 0.4, { align: 'center' });
    doc.text('Province of Cebu', 4.25, 0.55, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SIBONGA COMMUNITY COLLEGE', 4.25, 0.8, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Poblacion, Sibonga, Cebu', 4.25, 0.98, { align: 'center' });
    doc.text('Tel. No.: (032) 485-9405', 4.25, 1.13, { align: 'center' });
    doc.text('Email: sibongacommunitycollege@gmail.com', 4.25, 1.28, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('QR CODE ATTENDANCE MONITORING SYSTEM', 4.25, 1.55, { align: 'center' });
}

// Export to PDF
function exportToPDF(data, filename, title = 'Report') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 13]
    });

    addPDFHeader(doc);

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, 4.25, 2.3, { align: 'center' });

    if (data.length > 0) {
        const headers = [data[0]];
        const body = data.slice(1);

        doc.autoTable({
            startY: 2.6,
            head: headers,
            body: body,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 0.08
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250]
            },
            margin: { left: 0.5, right: 0.5 }
        });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 4.25, 12.7, { align: 'center' });
        doc.text(`Sibonga Community College - Attendance System`, 4.25, 12.85, { align: 'center' });
    }

    doc.save(filename.replace('.csv', '.pdf'));
    showToast('Data exported successfully!', 'success');
}

// Make exportToPDF available globally
window.exportToPDF = exportToPDF;

// ============================================================
// MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Admin Dashboard Core...');
    
    initializeNavigation();
    initializeEventManagement();
    initializeLogout();
    
    console.log('✅ Admin Dashboard Core initialized successfully');
});

// ============================================================
// NAVIGATION MODULE
// ============================================================

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function closeMobileSidebar() {
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    function openMobileSidebar() {
        if (sidebar) {
            sidebar.classList.add('mobile-open');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => page.classList.remove('active'));
            
            const targetPage = this.getAttribute('data-page');
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
            }

            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
}

// ============================================================
// EVENT MANAGEMENT MODULE
// ============================================================

let currentEventData = null;

function initializeEventManagement() {
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    
    const downloadQrBtn = document.getElementById('download-qr');
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', downloadQRCode);
    }
    
    const createNewEventBtn = document.getElementById('create-new-event');
    if (createNewEventBtn) {
        createNewEventBtn.addEventListener('click', createNewEvent);
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventType = document.getElementById('event-type').value;
    const eventDescription = document.getElementById('event-description').value;
    
    const qrCodeData = `SIBONGA-${eventName.trim().toUpperCase()}-${new Date(eventDate).toLocaleTimeString()}`;
    
    currentEventData = {
        name: eventName,
        date: eventDate,
        type: eventType,
        description: eventDescription,
        qrCodeData: qrCodeData,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch('../../api/save_event.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_name: eventName,
                event_date: eventDate,
                event_type: eventType,
                event_description: eventDescription,
                qr_code_data: qrCodeData
            })
        });

        const result = await response.json();

        if (result.success) {
            currentEventData.id = result.event_id;
            generateQRCode(currentEventData);
            
            const qrSection = document.getElementById('qr-section');
            const eventForm = document.getElementById('event-form');
            
            if (qrSection) qrSection.style.display = 'block';
            if (eventForm) eventForm.style.display = 'none';
            
            showToast('Event created and saved successfully!', 'success');
        } else {
            throw new Error(result.error || 'Failed to save event');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

function generateQRCode(eventData) {
    const qrContainer = document.getElementById('qr-code-container');
    const qrTextElement = document.getElementById('qr-code-text');
    
    if (!qrContainer) return;
    
    qrContainer.innerHTML = '';
    
    const qrCodeData = eventData.qrCodeData;
    
    if (typeof QRCode === 'undefined') {
        qrContainer.innerHTML = '<p style="color: red;">QR Code library missing</p>';
        showToast('QR Code library not found', 'error');
        return;
    }

    QRCode.toCanvas(qrCodeData, {
        width: 250,
        height: 250,
        margin: 3,
        color: { dark: '#0066cc', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        scale: 4
    }, function (error, canvas) {
        if (error) {
            qrContainer.innerHTML = '<p style="color: red;">Error generating QR code</p>';
            showToast('Failed to generate QR code', 'error');
            return;
        }
        
        canvas.style.cssText = 'border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15); border: 3px solid #f0f8ff;';
        qrContainer.appendChild(canvas);
        
        if (qrTextElement) {
            qrTextElement.textContent = qrCodeData;
        }
        
        const eventInfoDiv = document.createElement('div');
        eventInfoDiv.style.cssText = 'margin-top: 15px; padding: 12px; background-color: #e8f4fd; border-radius: 8px; font-size: 14px; color: #004080;';
        eventInfoDiv.innerHTML = `
            <strong>Event Details:</strong><br>
            <strong>Type:</strong> ${eventData.type}<br>
            <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}
        `;
        
        if (qrTextElement && qrTextElement.parentNode) {
            qrTextElement.parentNode.insertBefore(eventInfoDiv, qrTextElement.nextSibling);
        }
        
        showToast('QR Code generated successfully!', 'success');
    });
}

function downloadQRCode() {
    const canvas = document.querySelector('#qr-code-container canvas');
    if (canvas && currentEventData) {
        const sanitizedName = currentEventData.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase();
        const link = document.createElement('a');
        link.download = `${sanitizedName}-qr-code.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        showToast('QR Code downloaded successfully!', 'success');
    } else {
        showToast('No QR code to download', 'error');
    }
}

function createNewEvent() {
    const eventForm = document.getElementById('event-form');
    const qrSection = document.getElementById('qr-section');
    const qrContainer = document.getElementById('qr-code-container');
    const qrText = document.getElementById('qr-code-text');
    
    if (eventForm) {
        eventForm.reset();
        eventForm.style.display = 'block';
    }
    
    if (qrSection) qrSection.style.display = 'none';
    if (qrContainer) qrContainer.innerHTML = '';
    if (qrText) qrText.textContent = '';
    
    currentEventData = null;
    showToast('Ready to create a new event', 'success');
}

// ============================================================
// LOGOUT MODULE
// ============================================================

function initializeLogout() {
    const logoutBtn = document.querySelector('#logout .btn-danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('Logout button clicked');
            
            this.textContent = 'Logging out...';
            this.disabled = true;
            
            const logoutPath = "../../sql_php/log_out.php";
            
            console.log('Redirecting to:', logoutPath);
            console.log('Current URL:', window.location.href);
            
            window.location.href = logoutPath;
        });
    }

    const cancelBtn = document.querySelector('#logout .btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            console.log('Cancel button clicked - returning to home');
            
            const navButtons = document.querySelectorAll('.nav-button');
            const pages = document.querySelectorAll('.page');
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            if (navButtons[0]) navButtons[0].classList.add('active');
            
            pages.forEach(page => page.classList.remove('active'));
            const homePage = document.getElementById('home');
            if (homePage) homePage.classList.add('active');
        });
    }
}