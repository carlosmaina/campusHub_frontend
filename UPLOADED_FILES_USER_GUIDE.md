# Uploaded Files Feature - User Guide

## How It Works

### Step 1: Open Uploaded Files
```
1. Click the hamburger menu (☰) in upload page
2. Sidebar appears
3. Click "Uploaded Files"
4. Modal opens showing all your files
```

### Step 2: View Your Files
Each file shows:
```
📄 lecture_notes.pdf
   CS101 • Data Structures
   👤 you  👁️ 45 views  📅 Jan 21, 2025
   [tags: important, midterm]
   [Delete Button]
```

### Step 3: Delete a File
```
1. Click "Delete" button on any file
2. Confirmation dialog: "Are you sure?"
3. Click OK to confirm
4. File deleted from database
5. File removed from modal list
```

## Features

| Feature | What It Does |
|---------|------------|
| **File Icon** | Shows file type (PDF, Document, etc.) |
| **Title** | Name of uploaded file |
| **Course/Unit** | Metadata for organization |
| **Uploader** | Who uploaded (student/lecturer) |
| **Views** | How many times file viewed |
| **Date** | When file was uploaded |
| **Tags** | File keywords/categories |
| **Delete** | Remove file permanently |

## Example Modal

```
┌─────────────────────────────────────┐
│ 📁 Your Uploaded Files        [✖]   │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │ 📄 lecture_notes.pdf         │   │
│  │    CS101 • Data Structures   │   │
│  │    👤 You                    │   │
│  │    👁️ 45 views • 📅 Jan 21  │   │
│  │    [important] [midterm]     │   │
│  │                    [🗑 Del]  │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ 📊 presentation.pptx         │   │
│  │    CS101 • Slides            │   │
│  │    👤 You                    │   │
│  │    👁️ 12 views • 📅 Jan 20  │   │
│  │    [notes]                   │   │
│  │                    [🗑 Del]  │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ 📝 assignment.docx           │   │
│  │    MATH201 • Calculus        │   │
│  │    👤 You                    │   │
│  │    👁️ 5 views • 📅 Jan 19   │   │
│  │                    [🗑 Del]  │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## States

### Loading
```
┌─────────────────────────────────────┐
│ 📁 Your Uploaded Files        [✖]   │
├─────────────────────────────────────┤
│                                     │
│           ⟳ Loading...              │
│                                     │
└─────────────────────────────────────┘
```

### Empty (No Files)
```
┌─────────────────────────────────────┐
│ 📁 Your Uploaded Files        [✖]   │
├─────────────────────────────────────┤
│                                     │
│     No files uploaded yet.          │
│     Start by uploading a file!      │
│                                     │
└─────────────────────────────────────┘
```

### Error
```
┌─────────────────────────────────────┐
│ 📁 Your Uploaded Files        [✖]   │
├─────────────────────────────────────┤
│                                     │
│  ⚠️ Failed to load uploaded files   │
│                                     │
└─────────────────────────────────────┘
```

## Backend Data Flow

```
User Click
    ↓
Frontend fetches /myresources?userId=XXX
    ↓
Backend queries MongoDB for user's files
    ↓
Returns file list with metadata
    ↓
Modal displays files
    ↓
User clicks delete
    ↓
Frontend calls DELETE /resource/:id
    ↓
Backend deletes from MongoDB
    ↓
Frontend removes from list
```

## File Metadata Stored

Each file stores:
```
{
  _id: "mongodb_id",
  title: "File name",
  course: "Course code",
  unit: "Topic/Unit",
  uploadedBy: "student or lecturer",
  username: "user's name",
  views: 0,
  tags: ["tag1", "tag2"],
  createdAt: "2025-01-21T10:30:00Z",
  mimeType: "application/pdf"
}
```

## File Icons Legend

| Icon | File Type |
|------|-----------|
| 📄 | PDF Documents |
| 📝 | Word/Text Documents |
| 📊 | PowerPoint Presentations |
| 🗜️ | ZIP Archives |
| 🎥 | Videos |
| 🖼️ | Images |
| 📁 | Other Files |

## Tips

💡 **Sort by Date**: Files listed newest first
💡 **View Count**: Shows popularity of your files
💡 **Tags**: Help organize and categorize files
💡 **Delete Safely**: Confirmation required before deletion
💡 **Quick Access**: Accessible from sidebar on upload page

## Troubleshooting

### Files Not Showing
- ✓ Ensure you're logged in
- ✓ Wait for loading to complete
- ✓ Check internet connection
- ✓ Try refreshing page

### Can't Delete File
- ✓ Check you're the file owner
- ✓ Confirm deletion when prompted
- ✓ Check internet connection

### Modal Stuck Loading
- ✓ Close modal and try again
- ✓ Check browser console for errors
- ✓ Refresh page if needed

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close modal | Press Esc or click ✖ |
| Delete file | Click delete button |
| View files | Click "Uploaded Files" |
