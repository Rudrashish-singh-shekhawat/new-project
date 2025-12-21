# Backend File Upload Implementation

## Changes Made

### 1. **Updated Course Model** (`server/models/Course.js`)
- Added `videoFile` field to store uploaded video file paths
- Added `pdfFile` field to store uploaded PDF file paths
- Both fields are optional strings that store file paths

### 2. **Created Upload Middleware** (`server/middleware/upload.js`)
- Installed `multer` for handling multipart file uploads
- Configured separate storage for videos and PDFs
- Set file size limits:
  - Videos: 500MB max
  - PDFs: 50MB max
- Implemented file validation:
  - Video types: MP4, WebM, Ogg, MOV
  - PDF: Only PDF files allowed
- Created `uploadMiddleware` that handles mixed file uploads

### 3. **Updated Course Controller** (`server/controllers/courseController.js`)
- **createCourse**: Now processes file uploads from FormData requests
  - Detects files in request and maps them to lesson objects
  - Stores file paths in database (e.g., `/uploads/videos/video-123456.mp4`)
- **updateCourse**: Enhanced to support file updates
  - Can update course with or without file changes
  - Replaces files when new ones are uploaded

### 4. **Updated Routes** (`server/routes/courses.js`)
- Added `uploadMiddleware.any()` to POST and PUT course routes
- This allows handling of multipart form data with multiple file fields

### 5. **Updated Server Index** (`server/index.js`)
- Added static file serving for uploads directory: `/uploads`
- Increased JSON/URL-encoded body size limits to 50MB
- Files are served at paths like: `http://localhost:5000/uploads/videos/video-yyy.mp4`

### 6. **Updated .gitignore** (`server/.gitignore`)
- Added `uploads/` directory to ignore uploaded files in version control

## File Structure

After implementation, the following directory structure is created:
```
server/
├── uploads/
│   ├── videos/     (uploaded video files)
│   ├── pdfs/       (uploaded PDF files)
├── middleware/
│   ├── upload.js   (new - multer configuration)
│   └── auth.js
└── ... (other files)
```

## How It Works

### Frontend Flow:
1. User selects video/PDF files in CreateCourse form
2. Form data is sent as `FormData` with files
3. File fields are named like: `modules[0][lessons][0][videoFile]`

### Backend Flow:
1. `uploadMiddleware` intercepts the request
2. Files are saved to disk with unique names
3. File paths are stored in MongoDB
4. Course is created/updated with file path references
5. Files are served statically via `/uploads` route

### Database Storage Example:
```javascript
{
  modules: [
    {
      title: "Introduction",
      lessons: [
        {
          title: "What is React?",
          videoUrl: "https://youtube.com/...", // Optional YouTube link
          videoFile: "/uploads/videos/video-1640000000000-123456.mp4", // Uploaded file
          pdfFile: "/uploads/pdfs/pdf-1640000000000-123456.pdf", // Uploaded notes
          description: "Introduction to React basics"
        }
      ]
    }
  ]
}
```

## Usage Notes

- Users can provide EITHER a YouTube URL OR upload a video file (or both)
- PDF files are optional for each lesson
- Files are automatically deleted when lessons are removed (can be enhanced)
- File uploads use multipart/form-data encoding
- Frontend automatically detects if files exist and uses FormData for submission

## Future Enhancements

1. Add file deletion when courses/lessons are removed
2. Add file size validation on frontend
3. Implement file chunking for large uploads
4. Add progress tracking for uploads
5. Store file metadata (size, upload date, etc.)
6. Implement file compression for videos
