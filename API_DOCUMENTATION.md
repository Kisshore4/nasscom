# NASCOM Document Redaction System - API Documentation

## Overview

This document provides comprehensive API documentation for the NASCOM Document Redaction System backend. The API is built with FastAPI and provides both REST endpoints and WebSocket connections for real-time functionality.

**Base URL**: `http://localhost:8000` (development)  
**API Documentation**: `http://localhost:8000/docs` (Interactive Swagger UI)  
**WebSocket Endpoint**: `ws://localhost:8000/ws`

## Authentication

Currently, no authentication is required for local development. For production deployment, implement appropriate authentication middleware.

## Content Types

- **Request**: `multipart/form-data` for file uploads, `application/json` for data
- **Response**: `application/json`, `application/octet-stream` for file downloads

## Core API Endpoints

### 1. Document Redaction

#### POST /redact

**Purpose**: Main endpoint for document redaction processing

**Parameters**:
- `file` (required): File upload (multipart/form-data)
- `redaction_level` (optional): "full" | "partial" | "custom" (default: "full")
- `custom_types` (optional): Comma-separated entity types for custom redaction

**Supported File Types**:
- Images: JPG, JPEG, PNG, BMP, GIF, WebP, TIFF
- Documents: PDF

**Response**: Redacted file in original format

**Example Request**:
```bash
curl -X POST "http://localhost:8000/redact" \
  -F "file=@document.pdf" \
  -F "redaction_level=full"
```

**Example Response**: Binary file data with appropriate Content-Type header

**Error Responses**:
```json
{
  "error": "Unsupported file type: .docx"
}
```

### 2. Dashboard Data

#### GET /api/dashboard

**Purpose**: Retrieve complete dashboard data including statistics, recent activity, and redaction history

**Parameters**: None

**Response**:
```json
{
  "stats": {
    "total_files": 42,
    "files_today": 5,
    "total_redactions": 42,
    "average_processing_time": 2.34,
    "total_processing_time": 98.28,
    "last_updated": "2025-09-12T10:30:00",
    "last_date": "2025-09-12"
  },
  "recent_activity": [
    {
      "id": "uuid-string",
      "type": "redaction_completed",
      "filename": "document.pdf",
      "status": "completed",
      "timestamp": "2025-09-12T10:30:00",
      "details": {
        "processing_time": 2.34,
        "file_type": "pdf"
      }
    }
  ],
  "redaction_history": [
    {
      "id": "uuid-string",
      "filename": "document.pdf",
      "file_type": "pdf",
      "processing_time": 2.34,
      "status": "completed",
      "timestamp": "2025-09-12T10:30:00",
      "date": "2025-09-12"
    }
  ],
  "last_updated": "2025-09-12T10:30:00"
}
```

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/dashboard"
```

### 3. Redaction History

#### GET /api/redaction-history

**Purpose**: Retrieve complete redaction processing history

**Parameters**: None

**Response**:
```json
[
  {
    "id": "uuid-string",
    "filename": "document.pdf",
    "file_type": "pdf",
    "processing_time": 2.34,
    "status": "completed",
    "timestamp": "2025-09-12T10:30:00",
    "date": "2025-09-12"
  }
]
```

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/redaction-history"
```

### 4. Activity Feed

#### GET /api/activities

**Purpose**: Retrieve recent system activities

**Parameters**: None

**Response**:
```json
[
  {
    "id": "uuid-string",
    "type": "redaction_completed",
    "filename": "document.pdf",
    "status": "completed",
    "timestamp": "2025-09-12T10:30:00",
    "details": {
      "processing_time": 2.34,
      "file_type": "pdf"
    }
  }
]
```

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/activities"
```

### 5. Application Settings

#### GET /api/settings

**Purpose**: Retrieve current application settings

**Parameters**: None

**Response**:
```json
{
  "redaction_level": "full",
  "auto_download": true,
  "notifications": true,
  "theme": "light"
}
```

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/settings"
```

#### POST /api/settings

**Purpose**: Update application settings

**Request Body**:
```json
{
  "redaction_level": "partial",
  "auto_download": false,
  "notifications": true,
  "theme": "dark"
}
```

**Response**:
```json
{
  "message": "Settings updated successfully"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:8000/api/settings" \
  -H "Content-Type: application/json" \
  -d '{"redaction_level": "partial", "auto_download": false}'
```

### 6. File Download

#### GET /download/{file_id}

**Purpose**: Download processed file by ID

**Parameters**:
- `file_id` (path): Unique file identifier

**Response**: Binary file data

**Example Request**:
```bash
curl -X GET "http://localhost:8000/download/uuid-string" -o downloaded_file.pdf
```

### 7. Legacy Endpoints

#### GET /history

**Purpose**: Legacy endpoint for redaction history (deprecated, use /api/redaction-history)

**Response**: Same as /api/redaction-history

## WebSocket API

### Connection Endpoint

**URL**: `ws://localhost:8000/ws`

**Purpose**: Real-time updates for dashboard statistics, activity feed, and redaction status

### Message Types

#### 1. Redaction Completed
```json
{
  "type": "redaction_completed",
  "data": {
    "stats": {
      "total_files": 43,
      "files_today": 6,
      "total_redactions": 43,
      "average_processing_time": 2.45
    },
    "history_entry": {
      "id": "uuid-string",
      "filename": "document.pdf",
      "file_type": "pdf",
      "processing_time": 2.34,
      "status": "completed",
      "timestamp": "2025-09-12T10:30:00"
    },
    "activity": {
      "id": "uuid-string",
      "type": "redaction_completed",
      "filename": "document.pdf",
      "status": "completed",
      "timestamp": "2025-09-12T10:30:00"
    }
  }
}
```

#### 2. Activity Update
```json
{
  "type": "activity_update",
  "data": {
    "id": "uuid-string",
    "type": "file_uploaded",
    "filename": "document.pdf",
    "status": "processing",
    "timestamp": "2025-09-12T10:30:00"
  }
}
```

### JavaScript WebSocket Client Example

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = function(event) {
    console.log('WebSocket connected');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'redaction_completed':
            updateDashboardStats(data.data.stats);
            addToHistory(data.data.history_entry);
            addToActivity(data.data.activity);
            break;
            
        case 'activity_update':
            addToActivity(data.data);
            break;
            
        default:
            console.log('Unknown message type:', data.type);
    }
};

ws.onclose = function(event) {
    console.log('WebSocket disconnected');
    // Implement reconnection logic
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};
```

## Redaction Configuration

### Entity Types

#### Full Redaction Entities
- **PERSON**: Names of people
- **GPE**: Geopolitical entities (countries, cities, states)
- **ORG**: Organizations (companies, agencies, institutions)
- **DATE**: Dates in any format
- **CARDINAL**: Numbers, quantities
- **LOC**: Locations, geographical entities
- **NORP**: Nationalities, religious groups
- **FAC**: Facilities (buildings, airports, highways)
- **EVENT**: Named events (hurricanes, battles, wars)
- **PRODUCT**: Objects, vehicles, foods
- **LANGUAGE**: Named languages

#### Partial Redaction Entities
- **PERSON**: Names of people
- **CARDINAL**: Numbers, quantities
- **LOC**: Locations
- **NORP**: Nationalities, groups

#### Custom Redaction
Specify any combination of the above entity types as comma-separated values.

**Example**: `"PERSON,ORG,DATE"`

### Processing Workflow

1. **File Upload**: Multipart file received
2. **Format Detection**: Determine file type (PDF, image)
3. **Text Extraction**: 
   - PDF: Use PDFplumber for text extraction
   - Images: Use Tesseract OCR
4. **Entity Recognition**: spaCy NLP model identifies entities
5. **Redaction**: Black out detected entities
6. **Format Preservation**: Return in original format
7. **Data Logging**: Update statistics and history
8. **Real-time Broadcast**: WebSocket notification

## Error Handling

### HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid parameters, unsupported file type)
- **404**: Not Found (file not found, endpoint not found)
- **422**: Unprocessable Entity (validation error)
- **500**: Internal Server Error (processing failure)

### Error Response Format

```json
{
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {
    "additional": "information"
  }
}
```

### Common Error Types

#### 1. File Type Not Supported
```json
{
  "error": "Unsupported file type: .docx"
}
```

#### 2. File Too Large
```json
{
  "error": "File size exceeds maximum limit of 50MB"
}
```

#### 3. Processing Failed
```json
{
  "error": "Failed to extract text from image: Tesseract processing error"
}
```

#### 4. Invalid Redaction Level
```json
{
  "error": "Invalid redaction level. Must be 'full', 'partial', or 'custom'"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider implementing:

- **Per-IP limits**: 100 requests per minute
- **File size limits**: 50MB per file
- **Concurrent processing**: 5 files simultaneously

## CORS Configuration

### Allowed Origins
- `http://localhost:8080` (development frontend)
- `https://redaction.yourdomain.com` (production frontend)

### Allowed Methods
- GET, POST, PUT, DELETE, OPTIONS

### Allowed Headers
- Content-Type, Authorization, X-Requested-With

## Testing the API

### Using curl

**1. Test File Upload:**
```bash
curl -X POST "http://localhost:8000/redact" \
  -F "file=@test.pdf" \
  -F "redaction_level=full" \
  -o redacted_output.pdf
```

**2. Test Dashboard:**
```bash
curl -X GET "http://localhost:8000/api/dashboard" | jq '.'
```

**3. Test WebSocket (using websocat):**
```bash
# Install websocat: cargo install websocat
websocat ws://localhost:8000/ws
```

### Using Python

```python
import requests
import websocket
import json

# Test file upload
with open('test.pdf', 'rb') as f:
    files = {'file': f}
    data = {'redaction_level': 'full'}
    response = requests.post('http://localhost:8000/redact', files=files, data=data)
    
    with open('redacted.pdf', 'wb') as out:
        out.write(response.content)

# Test WebSocket
def on_message(ws, message):
    data = json.loads(message)
    print(f"Received: {data}")

ws = websocket.WebSocketApp("ws://localhost:8000/ws", on_message=on_message)
ws.run_forever()
```

### Using the Interactive Documentation

1. Start the backend server
2. Open http://localhost:8000/docs
3. Use the interactive Swagger UI to test endpoints
4. View request/response schemas and examples

## Performance Metrics

### Response Times (Typical)

- **GET /api/dashboard**: < 50ms
- **GET /api/redaction-history**: < 100ms
- **POST /redact** (small image): 1-3 seconds
- **POST /redact** (PDF): 3-10 seconds
- **WebSocket message broadcast**: < 10ms

### Throughput

- **Concurrent connections**: 100+ WebSocket connections
- **File processing**: 1-5 files simultaneously (depending on server resources)
- **API requests**: 1000+ requests per minute

## Data Persistence

### File Storage
- **Redacted files**: Stored in `backend/redacted_files/`
- **Retention**: Files are kept until manual cleanup
- **Naming**: UUID-based filenames with original extensions

### JSON Data Storage
- **Location**: `backend/data/`
- **Format**: Pretty-printed JSON with UTF-8 encoding
- **Backup**: Implement regular backups for production

### Data Models

**Complete data model schemas are available in the main README.md file.**

## Security Considerations

### Input Validation
- File type validation
- File size limits
- Content scanning for malicious files

### Data Privacy
- No external API calls
- Local processing only
- Temporary file cleanup
- Secure file handling

### Production Security
- Implement authentication
- Use HTTPS
- Input sanitization
- Error message sanitization
- Rate limiting

## API Versioning

Current API version: **v1**

Future versions will be prefixed: `/api/v2/`

## Support and Development

### Interactive Testing
- **Swagger UI**: http://localhost:8000/docs
- **WebSocket Test**: http://localhost:8000/realtime_test.html

### Development Tools
- **FastAPI**: Automatic API documentation
- **Uvicorn**: ASGI server with auto-reload
- **Python logging**: Detailed server logs

### Contributing
1. Follow FastAPI conventions
2. Add proper type hints
3. Include docstrings for new endpoints
4. Update this documentation for API changes

---

**Last Updated**: September 12, 2025  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0
