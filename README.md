# Incident Management Portal

A modern web portal for automated incident assignment based on shift schedules.

## Features

### 📊 Dashboard
- Real-time statistics showing total incidents, pending assignments, active analysts, and transferred incidents
- Comprehensive incident table with filtering capabilities
- Status tracking (Hold, Confirmation, Transferred)

### 📝 Incident Management
- Upload new incidents with incident ID and ideal time
- Automatic assignment to analysts based on current shift schedule
- Manual reassignment capabilities
- Status updates and tracking

### 🕒 Shift Management
- Configure shift schedules with start/end times
- Assign analysts to specific shifts
- Real-time shift information display
- Support for overnight shifts
- Current shift and next shift information

### ⚡ Automatic Assignment
- Smart assignment based on current active shift
- Round-robin distribution among on-duty analysts
- Fallback assignment system for coverage gaps

## How to Use

### 1. Opening the Portal
- Simply open `index.html` in your web browser
- The portal will load with sample data to get you started

### 2. Uploading New Incidents
- Click the "New Incident" button in the header
- Enter the Incident ID (format: INC########)
- Enter the ideal time window
- Enter your analyst name
- Click "Upload Incident"
- The system will automatically assign it to the appropriate analyst based on current shift

### 3. Managing Shifts
- Click the "Shift Schedule" button in the header
- Add new shifts with start time, end time, and analyst name
- View all current shifts
- Delete shifts as needed

### 4. Dashboard Features
- View real-time statistics at the top
- Filter incidents by status using the dropdown
- Use the "Refresh" button to update data
- Reassign incidents using the "Reassign" button
- Delete incidents using the trash icon

### 5. Current Shift Information
- See who's currently on duty
- View upcoming shift changes
- Monitor shift coverage

## Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Data persists between browser sessions
- **Real-time Updates**: Automatic shift detection and assignment
- **Modern UI**: Clean, professional interface with smooth animations
- **Keyboard Shortcuts**: 
  - Ctrl+N: New incident
  - Ctrl+S: Shift schedule
  - Esc: Close modals

## Data Storage

The portal uses browser localStorage to save:
- Incident records
- Shift schedules
- Assignment history

Data persists between browser sessions automatically.

## Browser Compatibility

Works with all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Sample Data

The portal comes pre-loaded with sample incidents and shifts based on your requirements. You can modify or delete these as needed.

---

**Note**: This is a client-side application that runs entirely in the browser. No server setup required! 