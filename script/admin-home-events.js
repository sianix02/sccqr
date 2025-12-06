// ============================================================
// ADMIN-HOME-EVENTS.JS - Event History Management Module
// ============================================================

let eventsData = [];    
let currentViewingEvent = null;
let isLoadingEvents = false;
let currentEventFilters = {
    status: 'all',
    type: 'all',
    search: ''
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeEventHistory();
    }, 500);
});

function initializeEventHistory() {
    console.log('📅 Initializing Event History...');
    loadEventsFromDatabase();
    attachEventHistoryListeners();
}

// ============================================================
// DATA LOADING
// ============================================================

async function loadEventsFromDatabase() {
    if (isLoadingEvents) {
        console.log('⏳ Already loading events, skipping...');
        return;
    }
    
    isLoadingEvents = true;
    const tbody = document.getElementById('events-table-body');
    
    if (!tbody) {
        console.error('❌ Events table body not found!');
        isLoadingEvents = false;
        return;
    }
    
    console.log('🔄 Loading events from database...');
    
    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="padding: 40px; text-align: center; color: #666;">
                <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
                <p>Loading events from database...</p>
            </td>
        </tr>
    `;
    
    try {
        const timestamp = new Date().getTime();
        const url = `../../api/get_events_history.php?_=${timestamp}`;
        
        console.log('📡 Fetching from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 Received data:', result);
        
        if (result.success) {
            eventsData = result.data;
            
            console.log('✅ Processed events data:', eventsData.length, 'events');
            
            populateEventTypeFilter();
            renderEventsTable();
            updateEventStats();
            
            showToast(`✅ Loaded ${result.data.length} events successfully`, 'success');
        } else {
            throw new Error(result.message || 'Failed to load events');
        }
    } catch (error) {
        console.error('❌ Error loading events:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 40px; text-align: center; color: #dc3545;">
                    <p style="font-size: 18px; margin-bottom: 10px;">❌ Error Loading Events</p>
                    <p style="margin-bottom: 15px;">${error.message}</p>
                    <button class="btn" onclick="loadEventsFromDatabase()">Retry</button>
                </td>
            </tr>
        `;
        showToast('Failed to load events from database', 'error');
    } finally {
        isLoadingEvents = false;
    }
}

// ============================================================
// FILTERING & RENDERING
// ============================================================

function populateEventTypeFilter() {
    const typeFilter = document.getElementById('filter-event-type');
    if (!typeFilter) return;
    
    const types = [...new Set(eventsData.map(e => e.event_type))].filter(t => t).sort();
    
    const currentValue = typeFilter.value;
    typeFilter.innerHTML = '<option value="all">All Types</option>';
    
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
    
    typeFilter.value = currentValue;
}

function applyEventFilters() {
    let filteredData = [...eventsData];
    
    if (currentEventFilters.status !== 'all') {
        filteredData = filteredData.filter(e => e.status === currentEventFilters.status);
    }
    
    if (currentEventFilters.type !== 'all') {
        filteredData = filteredData.filter(e => e.event_type === currentEventFilters.type);
    }
    
    if (currentEventFilters.search) {
        const searchTerm = currentEventFilters.search.toLowerCase();
        filteredData = filteredData.filter(event => {
            return event.event_name.toLowerCase().includes(searchTerm) ||
                   event.event_type.toLowerCase().includes(searchTerm) ||
                   event.description.toLowerCase().includes(searchTerm);
        });
    }
    
    const filterInfo = document.getElementById('event-filter-info');
    if (filterInfo) {
        const parts = [];
        if (currentEventFilters.status !== 'all') parts.push(currentEventFilters.status);
        if (currentEventFilters.type !== 'all') parts.push(currentEventFilters.type);
        if (currentEventFilters.search) parts.push(`Search: "${currentEventFilters.search}"`);
        
        filterInfo.textContent = parts.length > 0 
            ? `Showing ${filteredData.length} events (${parts.join(', ')})`
            : `Showing all ${filteredData.length} events`;
    }
    
    return filteredData;
}

function renderEventsTable() {
    console.log('🎨 Rendering events table...');
    
    const data = applyEventFilters();
    const tbody = document.getElementById('events-table-body');
    
    if (!tbody) {
        console.error('❌ Table body not found!');
        return;
    }
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 40px; text-align: center; color: #666;">
                    <p style="font-size: 18px; margin-bottom: 10px;">📋 No events found</p>
                    <p>Try adjusting your filters or create a new event</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map(event => {
        const statusColors = {
            'Active': '#28a745',
            'Completed': '#0066cc',
            'Cancelled': '#dc3545'
        };
        const statusColor = statusColors[event.status] || '#6c757d';
        
        const eventDate = new Date(event.event_date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        const formattedTime = eventDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <tr data-event-id="${event.event_id}">
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: 600; color: var(--dark-blue); margin-bottom: 4px;">${event.event_name}</div>
                    <div style="font-size: 12px; color: #666; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${event.description}</div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: 500;">${formattedDate}</div>
                    <div style="font-size: 12px; color: #666;">${formattedTime}</div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: #e8f4fd; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #0066cc;">
                        ${event.event_type}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: var(--primary-blue);">${event.total_participants || 0}</div>
                    <div style="font-size: 11px; color: #666;">participants</div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${event.status}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn" style="font-size: 11px; padding: 6px 10px;" onclick="viewEventQR('${event.event_id}')">📱 View QR</button>
                        <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #ffc107;" onclick="viewEventDetails('${event.event_id}')">👁️ Details</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Table rendered with', data.length, 'events');
}

function updateEventStats() {
    console.log('📈 Calculating event statistics...');
    
    const totalEvents = eventsData.length;
    const activeEvents = eventsData.filter(e => e.status === 'Active').length;
    const completedEvents = eventsData.filter(e => e.status === 'Completed').length;
    const totalParticipants = eventsData.reduce((sum, e) => sum + (parseInt(e.total_participants) || 0), 0);
    
    const statElements = {
        'total-events-count': totalEvents,
        'active-events-count': activeEvents,
        'completed-events-count': completedEvents,
        'total-participants-count': totalParticipants
    };
    
    Object.keys(statElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = statElements[id];
        }
    });
}

// ============================================================
// QR CODE VIEWER
// ============================================================

window.viewEventQR = function(eventId) {
    const event = eventsData.find(e => e.event_id == eventId);
    if (!event) {
        showToast('Event not found', 'error');
        return;
    }
    
    currentViewingEvent = event;
    
    document.getElementById('qr-event-name').textContent = event.event_name;
    document.getElementById('qr-event-date').textContent = new Date(event.event_date).toLocaleString();
    document.getElementById('qr-event-type').textContent = event.event_type;
    document.getElementById('qr-event-code').textContent = event.qr_code_data || 'N/A';
    
    generateQRPreview(event);
    
    const modal = document.getElementById('qr-viewer-modal');
    if (modal) modal.style.display = 'block';
}

function generateQRPreview(event) {
    const container = document.getElementById('qr-preview-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const qrData = event.qr_code_data || `EVENT-${event.event_id}`;
    
    if (typeof QRCode === 'undefined') {
        container.innerHTML = '<p style="color: red;">QR Code library not loaded</p>';
        return;
    }
    
    QRCode.toCanvas(qrData, {
        width: 300,
        height: 300,
        margin: 2,
        color: { dark: '#0066cc', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
    }, function (error, canvas) {
        if (error) {
            container.innerHTML = '<p style="color: red;">Error generating QR code</p>';
            return;
        }
        
        canvas.style.cssText = 'border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);';
        container.appendChild(canvas);
    });
}

window.downloadEventQR = function() {
    if (!currentViewingEvent) {
        showToast('No event selected', 'error');
        return;
    }
    
    const event = currentViewingEvent;
    const qrData = event.qr_code_data || `EVENT-${event.event_id}`;
    
    QRCode.toCanvas(qrData, {
        width: 800,
        height: 800,
        margin: 4,
        color: { dark: '#0066cc', light: '#FFFFFF' },
        errorCorrectionLevel: 'H'
    }, function (error, qrCanvas) {
        if (error) {
            showToast('Failed to generate QR code', 'error');
            return;
        }
        
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        
        const padding = 80;
        const qrSize = 800;
        const infoHeight = 300;
        const totalWidth = qrSize + (padding * 2);
        const totalHeight = qrSize + infoHeight + (padding * 2);
        
        finalCanvas.width = totalWidth;
        finalCanvas.height = totalHeight;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, totalWidth, totalHeight);
        
        ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);
        
        const textStartY = padding + qrSize + 60;
        ctx.fillStyle = '#004080';
        ctx.textAlign = 'center';
        
        ctx.font = 'bold 48px Arial';
        ctx.fillText(event.event_name, totalWidth / 2, textStartY);
        
        ctx.font = '32px Arial';
        ctx.fillStyle = '#666666';
        
        const eventDate = new Date(event.event_date);
        const dateStr = eventDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = eventDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        ctx.fillText(dateStr, totalWidth / 2, textStartY + 50);
        ctx.fillText(timeStr, totalWidth / 2, textStartY + 90);
        
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#0066cc';
        ctx.fillText(`Event Code: ${event.qr_code_data || event.event_id}`, totalWidth / 2, textStartY + 140);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = '#999999';
        ctx.fillText('Scan this QR code to join the event', totalWidth / 2, textStartY + 180);
        
        const sanitizedName = event.event_name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const link = document.createElement('a');
        link.download = `${sanitizedName}-qr-code.png`;
        link.href = finalCanvas.toDataURL('image/png', 1.0);
        link.click();
        
        showToast('QR Code downloaded successfully!', 'success');
    });
}

function closeQRViewer() {
    const modal = document.getElementById('qr-viewer-modal');
    if (modal) modal.style.display = 'none';
    currentViewingEvent = null;
}

// ============================================================
// EVENT DETAILS VIEWER
// ============================================================

window.viewEventDetails = async function(eventId) {
    const event = eventsData.find(e => e.event_id == eventId);
    if (!event) {
        showToast('Event not found', 'error');
        return;
    }
    
    document.getElementById('detail-event-name').textContent = event.event_name;
    document.getElementById('detail-event-description').textContent = event.description;
    document.getElementById('detail-event-datetime').textContent = new Date(event.event_date).toLocaleString();
    document.getElementById('detail-event-type-text').textContent = event.event_type;
    
    const statusEl = document.getElementById('detail-event-status');
    const statusColors = {
        'Active': '#28a745',
        'Completed': '#0066cc',
        'Cancelled': '#dc3545'
    };
    const statusColor = statusColors[event.status] || '#6c757d';
    statusEl.innerHTML = `<span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${event.status}</span>`;
    
    try {
        const response = await fetch(`../../api/get_events_attendance.php?event_id=${eventId}`);
        const result = await response.json();
        
        if (result.success) {
            const stats = result.stats;
            document.getElementById('detail-total-participants').textContent = stats.total || 0;
            document.getElementById('detail-present-count').textContent = stats.present || 0;
            document.getElementById('detail-late-count').textContent = stats.late || 0;
            document.getElementById('detail-absent-count').textContent = stats.absent || 0;
        }
    } catch (error) {
        console.error('Error loading attendance stats:', error);
    }
    
    const modal = document.getElementById('event-details-modal');
    if (modal) modal.style.display = 'block';
}

function closeEventDetails() {
    const modal = document.getElementById('event-details-modal');
    if (modal) modal.style.display = 'none';
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function attachEventHistoryListeners() {
    const searchInput = document.getElementById('event-search');
    const statusFilter = document.getElementById('filter-event-status');
    const typeFilter = document.getElementById('filter-event-type');
    const refreshBtn = document.getElementById('refresh-events');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentEventFilters.search = e.target.value;
            renderEventsTable();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentEventFilters.status = e.target.value;
            renderEventsTable();
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            currentEventFilters.type = e.target.value;
            renderEventsTable();
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadEventsFromDatabase();
            showToast('Refreshing events...', 'success');
        });
    }
    
    const closeQRBtn = document.getElementById('close-qr-viewer');
    const closeQRBtn2 = document.getElementById('close-qr-viewer-btn');
    const downloadQRBtn = document.getElementById('download-event-qr');
    
    if (closeQRBtn) closeQRBtn.addEventListener('click', closeQRViewer);
    if (closeQRBtn2) closeQRBtn2.addEventListener('click', closeQRViewer);
    if (downloadQRBtn) downloadQRBtn.addEventListener('click', downloadEventQR);
    
    const closeDetailsBtn = document.getElementById('close-event-details');
    const closeDetailsBtn2 = document.getElementById('close-event-details-btn');
    
    if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', closeEventDetails);
    if (closeDetailsBtn2) closeDetailsBtn2.addEventListener('click', closeEventDetails);
}