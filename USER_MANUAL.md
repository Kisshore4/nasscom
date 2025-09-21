# NASCOM Document Redaction System - User Manual

## Getting Started

Welcome to the NASCOM Document Redaction System! This user-friendly application automatically detects and removes sensitive information from your documents while preserving their original format.

### What is Document Redaction?

Document redaction is the process of identifying and obscuring sensitive information in documents such as:
- Personal names
- Addresses and locations  
- Phone numbers and email addresses
- Social security numbers
- Financial information
- Dates and timestamps
- Organization names

### System Requirements

**To use this application, you need:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial setup)
- Documents in supported formats (PDF, JPG, PNG)

## Accessing the Application

1. **Open your web browser**
2. **Navigate to**: `http://localhost:8080` (or your organization's URL)
3. **Login** (if authentication is enabled)

You'll see the main dashboard with navigation options on the left sidebar.

## Dashboard Overview

The dashboard provides a real-time view of your redaction activities:

### Statistics Panel
- **Total Files Processed**: Running count of all redacted documents
- **Files Today**: Documents processed in the current day
- **Average Processing Time**: Time taken to process documents
- **Total Redactions**: Number of sensitive items removed

### Recent Activity Feed
- Live updates of system activities
- Processing status for uploaded files
- Completion notifications
- Error alerts (if any)

### Quick Actions
- Upload new documents
- View processing history
- Access application settings

## Uploading and Redacting Documents

### Step 1: Navigate to Upload

1. Click **"Upload Document"** in the sidebar
2. You'll see the file upload interface

### Step 2: Select Files

**Drag and Drop Method:**
1. Drag your files directly onto the upload area
2. You'll see a visual indicator when files are ready to drop

**Browse Method:**
1. Click **"Browse Files"** or **"Choose Files"**
2. Select one or more files from your computer
3. Click **"Open"**

### Step 3: Choose Redaction Level

**Full Redaction (Recommended)**
- Removes all types of sensitive information
- Best for maximum privacy protection
- Includes: names, dates, locations, organizations, numbers

**Partial Redaction**
- Removes only critical personal information
- Faster processing
- Includes: names, locations, personal identifiers

**Custom Redaction**
- Select specific types of information to redact
- Advanced users only
- Choose from available entity types

### Step 4: Start Processing

1. Click **"Start Redaction"** button
2. Watch the progress indicator
3. Processing time varies by file size (typically 1-10 seconds)

### Step 5: Download Results

1. Once complete, the **"Download"** button appears
2. Click to download your redacted file
3. File will be in the same format as the original

## Supported File Types

### Documents
- **PDF Files** (.pdf)
  - Text-based PDFs (recommended)
  - Scanned PDFs (using OCR)
  - Multi-page documents
  - Preserves layout and formatting

### Images
- **JPEG/JPG** (.jpg, .jpeg)
- **PNG** (.png) 
- **BMP** (.bmp)
- **GIF** (.gif)
- **WebP** (.webp)
- **TIFF** (.tiff)

**Note**: Images with text are processed using OCR (Optical Character Recognition) technology.

## Understanding Redaction Results

### What Gets Redacted

**Personal Information:**
- Full names (John Smith, Mary Johnson)
- Titles with names (Dr. Brown, Mr. Wilson)

**Locations:**
- Addresses (123 Main Street, New York)
- Cities and states (Los Angeles, California)
- Countries (United States, Canada)

**Organizations:**
- Company names (Microsoft, Google)
- Government agencies (FBI, IRS)
- Educational institutions (Harvard University)

**Numbers and Dates:**
- Phone numbers (555-123-4567)
- Social security numbers (123-45-6789)
- Dates (January 15, 2025)
- Credit card numbers
- Account numbers

### What Stays Visible

- General text content
- Document structure and formatting
- Non-sensitive numbers (page numbers, amounts without context)
- Common words and phrases

### Redaction Appearance

Sensitive information is replaced with **solid black rectangles** that completely obscure the original text while maintaining document layout.

## Viewing Your Redaction History

### Accessing History

1. Click **"Redaction History"** in the sidebar
2. View all previously processed documents

### History Information

For each processed file, you can see:
- **File Name**: Original filename
- **Processing Date**: When redaction was completed  
- **File Type**: PDF, JPG, PNG, etc.
- **Processing Time**: How long redaction took
- **Status**: Completed, Failed, In Progress
- **Download**: Re-download redacted files

### Filtering and Search

- **Date Range**: Filter by processing date
- **File Type**: Show only PDFs, images, etc.
- **Status**: View completed or failed processing
- **Search**: Find files by name

## Application Settings

### Accessing Settings

1. Click **"Settings"** in the sidebar
2. Modify application preferences

### Available Settings

**Default Redaction Level**
- Set your preferred redaction level for all uploads
- Options: Full, Partial, Custom

**Auto-Download**
- Automatically download redacted files when complete
- Enable/disable based on preference

**Notifications**
- Enable desktop notifications for completed processing
- Show/hide processing status alerts

**Theme**
- Light mode (default)
- Dark mode for low-light environments

**File Handling**
- Maximum file size limits
- Supported file types
- Processing timeout settings

## Real-Time Features

### Live Updates

The application provides real-time updates without refreshing the page:

**Dashboard Statistics**
- Automatically updates when new files are processed
- Live counters for daily activity
- Real-time processing status

**Activity Feed**
- Instant notifications for new uploads
- Processing completion alerts
- Error notifications (if any)

**Processing Status**
- Live progress indicators during redaction
- Real-time status updates
- Immediate download availability

### Multi-User Support

If multiple users are using the system:
- All users see shared statistics
- Individual file processing status
- Shared activity feed for system-wide monitoring

## Troubleshooting

### Common Issues

**1. File Won't Upload**

*Possible Causes:*
- File type not supported
- File size too large
- Network connection issues

*Solutions:*
- Check file format (PDF, JPG, PNG supported)
- Reduce file size (compress images, split large PDFs)
- Check internet connection
- Try a different browser

**2. Processing Takes Too Long**

*Normal Processing Times:*
- Small images (< 1MB): 1-3 seconds
- Medium images (1-5MB): 3-8 seconds  
- Small PDFs (1-5 pages): 5-15 seconds
- Large PDFs (10+ pages): 15-60 seconds

*If processing exceeds these times:*
- Wait for completion (large files take longer)
- Check system resources
- Try reducing file size
- Contact system administrator

**3. Poor Redaction Quality**

*For Images:*
- Ensure text is clear and readable
- Use high-resolution images
- Avoid handwritten text (works best with printed text)
- Ensure good contrast between text and background

*For PDFs:*
- Text-based PDFs work better than scanned PDFs
- For scanned PDFs, ensure high image quality
- Multi-column layouts may need manual review

**4. Download Issues**

*Solutions:*
- Check browser download settings
- Disable popup blockers
- Try right-click "Save As"
- Clear browser cache and cookies

### Error Messages

**"Unsupported file type"**
- File format not supported
- Convert to PDF, JPG, or PNG

**"File too large"**
- File exceeds size limit
- Compress file or split into smaller parts

**"Processing failed"**
- Internal processing error
- Try uploading file again
- Contact support if problem persists

**"Network error"**
- Connection to server lost
- Check internet connection
- Refresh page and try again

## Best Practices

### File Preparation

**For Best Results:**
1. **Use high-quality files**: Clear, readable text
2. **Optimize file size**: Compress large files before upload
3. **Check file format**: Ensure compatibility (PDF, JPG, PNG)
4. **Clean scans**: Remove artifacts, ensure good contrast

### Redaction Strategy

**Choose Appropriate Level:**
- **Full redaction**: For maximum privacy (recommended)
- **Partial redaction**: For faster processing with basic privacy
- **Custom redaction**: For specific requirements

**Review Results:**
- Always review redacted documents
- Check for missed sensitive information
- Verify important information isn't over-redacted

### File Management

**Organization Tips:**
- Use descriptive filenames before upload
- Keep original files in secure location
- Organize redacted files by date or project
- Regularly clean up downloaded files

**Security Practices:**
- Delete original files after redaction (if appropriate)
- Store redacted files securely
- Use appropriate file sharing methods
- Follow organizational data policies

## Keyboard Shortcuts

### Navigation
- **Ctrl + D**: Go to Dashboard
- **Ctrl + U**: Go to Upload Document
- **Ctrl + H**: Go to Redaction History
- **Ctrl + S**: Go to Settings

### File Operations
- **Ctrl + O**: Open file browser
- **Enter**: Start redaction process
- **Ctrl + D**: Download completed file
- **Esc**: Cancel current operation

### Interface
- **F11**: Toggle fullscreen mode
- **Ctrl + +**: Zoom in
- **Ctrl + -**: Zoom out
- **Ctrl + 0**: Reset zoom

## Mobile Usage

### Mobile Browser Support

The application works on mobile devices with some limitations:

**Supported Features:**
- File upload from device gallery
- View redaction history
- Download redacted files
- View dashboard statistics

**Limitations:**
- Smaller screen interface
- Slower processing on mobile data
- Limited multi-file selection

**Mobile Tips:**
- Use Wi-Fi for better performance
- Process smaller files on mobile
- Use landscape orientation for better visibility

## Privacy and Security

### Data Protection

**Your Privacy is Protected:**
- All processing happens locally on the server
- No data is sent to external services
- Original files are not permanently stored
- Redacted files are stored temporarily

**Security Features:**
- Secure file upload and download
- Encrypted connections (HTTPS in production)
- Automatic temporary file cleanup
- No permanent storage of sensitive data

### Compliance

**The system helps with:**
- GDPR compliance (EU data protection)
- HIPAA compliance (healthcare data)
- FERPA compliance (educational records)
- Corporate data protection policies

## Getting Help

### Built-in Help

- **Tooltips**: Hover over interface elements for help
- **Status Messages**: Clear feedback on all operations
- **Error Messages**: Specific guidance for problems

### Support Resources

- **User Manual**: This document
- **API Documentation**: For technical users
- **System Administrator**: Contact your IT department
- **NASCOM Support**: For technical issues

### Reporting Issues

When reporting problems, include:
- What you were trying to do
- Error message (if any)
- File type and size
- Browser and operating system
- Screenshots (if helpful)

## Frequently Asked Questions

### General Questions

**Q: Is my data secure?**
A: Yes, all processing happens locally on your organization's server. No data is sent to external services.

**Q: What file types are supported?**
A: PDF documents and common image formats (JPG, PNG, BMP, GIF, WebP, TIFF).

**Q: How long does processing take?**
A: Typically 1-10 seconds for most files, depending on size and complexity.

**Q: Can I process multiple files at once?**
A: Yes, you can select and upload multiple files simultaneously.

### Technical Questions

**Q: Why do some words remain visible?**
A: The AI focuses on sensitive information like names, addresses, and numbers. General content remains visible.

**Q: Can I customize what gets redacted?**
A: Yes, use the "Custom Redaction" option to select specific types of information to remove.

**Q: What if the redaction missed something?**
A: Review the output and manually edit if needed. Report consistent issues to your system administrator.

**Q: Can I undo redaction?**
A: No, redaction is permanent. Keep original files separate if you need to make changes.

### Troubleshooting Questions

**Q: File upload fails - what should I do?**
A: Check file size and format. Try compressing large files or converting to supported formats.

**Q: Processing seems stuck - what's wrong?**
A: Large files take longer. Wait a few minutes. If it still doesn't complete, try refreshing and uploading again.

**Q: Download doesn't work - how to fix?**
A: Check browser settings, disable popup blockers, or try right-clicking the download button and selecting "Save As".

---

**Need Additional Help?**

Contact your system administrator or NASCOM support team for technical assistance.

**Document Version**: 1.0.0  
**Last Updated**: September 12, 2025  
**Compatible with**: NASCOM Document Redaction System v1.0.0
