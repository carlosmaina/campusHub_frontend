# Uploaded Files Feature - Technical Diagram

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAMPUSHUB UPLOAD PAGE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Hamburger Menu (☰)                                      │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │ Click                            │
│                             ↓                                   │
│                    ┌─────────────────┐                         │
│                    │   SIDEBAR       │                         │
│                    ├─────────────────┤                         │
│                    │ Saved summary   │                         │
│                    │ Uploaded Files  │ ← Click here            │
│                    │ AI PDF          │                         │
│                    │ Close           │                         │
│                    └──────────┬──────┘                         │
│                               │                                 │
│                               ↓                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MODAL: Your Uploaded Files                          [✖]│   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ⟳ LOADING...                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                            ↓ (After Loading)

┌─────────────────────────────────────────────────────────────────┐
│  MODAL: Your Uploaded Files                                 [✖]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📄 lecture_notes.pdf                           [🗑 Del] │  │
│  │    CS101 • Data Structures                              │  │
│  │    👤 student  👁️ 45 views  📅 Jan 21, 2025           │  │
│  │    Tags: [important] [midterm]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📊 presentation.pptx                           [🗑 Del] │  │
│  │    CS101 • Slides                                       │  │
│  │    👤 student  👁️ 12 views  📅 Jan 20, 2025           │  │
│  │    Tags: [slides]                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📝 assignment.docx                             [🗑 Del] │  │
│  │    MATH201 • Calculus                                   │  │
│  │    👤 student  👁️ 5 views  📅 Jan 19, 2025            │  │
│  │    Tags: [homework]                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────┐
│  User Click "Uploaded Files" │
└──────────────┬───────────────┘
               │
               ↓
    ┌──────────────────────┐
    │ fetchUploadedFiles() │
    │                      │
    │ setShowUploadedFiles │
    │ (true)               │
    │ setLoadingFiles      │
    │ (true)               │
    └──────────┬───────────┘
               │
               ↓
    ┌─────────────────────────────────┐
    │ API Call                        │
    │ GET /myresources?userId=XXX     │
    │ Headers:                        │
    │   Authorization: Bearer TOKEN   │
    │   Credentials: include          │
    └──────────────┬──────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Backend Authentication           │
    │ (authenticate middleware)        │
    │ Verify JWT token                 │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ MongoDB Query                    │
    │ PdfData.find({ userId: ID })    │
    │ Sort by createdAt (desc)         │
    │ Exclude pdfBuffer field          │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Response to Frontend             │
    │ {                                │
    │   success: true,                 │
    │   resources: [...]               │
    │ }                                │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Frontend Update State            │
    │ setUploadedFiles(data)           │
    │ setLoadingFiles(false)           │
    │ setShowUploadedFiles(true)       │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Modal Renders with Files         │
    │ Display all resources            │
    │ Each file interactive            │
    └──────────────────────────────────┘
```

## Delete File Flow

```
┌──────────────────────────────────────┐
│ User Click "Delete" on File          │
└──────────────┬───────────────────────┘
               │
               ↓
    ┌─────────────────────────────────┐
    │ Confirmation Dialog              │
    │ "Are you sure?"                  │
    │ [OK] [Cancel]                   │
    └──────────────┬──────────────────┘
                   │
        (User clicks OK)
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ deleteFile(fileId)               │
    │ Prepare request:                 │
    │   - fileId (URL param)           │
    │   - userId (query param)         │
    │   - token (header)               │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ API Call                         │
    │ DELETE /resource/:id?userId=XXX │
    │ Headers:                         │
    │   Authorization: Bearer TOKEN    │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Backend Authentication           │
    │ Check ownership                  │
    │ Delete from MongoDB              │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Response: {success: true}        │
    │ or Error if not owner/failed     │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Frontend Update                  │
    │ setUploadedFiles(remove item)    │
    │ Show success/error message       │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Modal Updates                    │
    │ File removed from list           │
    │ or error displayed               │
    └──────────────────────────────────┘
```

## State Management

```
upload.jsx Component State

┌─────────────────────────────────────────┐
│ Sidebar State                           │
├─────────────────────────────────────────┤
│ openSide: boolean                       │
│ toggleSidebar(): void                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Uploaded Files State                    │
├─────────────────────────────────────────┤
│ uploadedFiles: Array<FileObject>        │
│ showUploadedFiles: boolean              │
│ loadingFiles: boolean                   │
│ filesError: string | null               │
│                                         │
│ Functions:                              │
│ - fetchUploadedFiles()                  │
│ - deleteFile(fileId)                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Upload/Preview State                    │
├─────────────────────────────────────────┤
│ (existing states unchanged)             │
│ - fileObj, fileName, previewURL etc     │
└─────────────────────────────────────────┘
```

## File Card Component Structure

```
┌──────────────────────────────────────────────────┐
│  FILE CARD                                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  [Icon]  Title                    [Del]  │   │
│  │          Course • Unit            Button │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  Metadata Row:                                   │
│  👤 uploader  👁️ views  📅 date               │
│                                                  │
│  Tags Row (if present):                         │
│  [tag1] [tag2] [tag3]                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Modal Layout

```
┌─────────────────────────────────────────────────┐
│  📁 Your Uploaded Files                      [✖]│
├─────────────────────────────────────────────────┤
│  (Scrollable content area)                      │
│                                                 │
│  [State: Loading | Error | Empty | Files]      │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ FILE CARD 1                              │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ FILE CARD 2                              │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ FILE CARD 3                              │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Integration Points

```
upload.jsx
    │
    ├─→ Backend API
    │   ├─→ GET /myresources (fetch)
    │   └─→ DELETE /resource/:id (delete)
    │
    ├─→ State Management
    │   ├─→ uploadedFiles (data store)
    │   ├─→ showUploadedFiles (UI state)
    │   ├─→ loadingFiles (loading state)
    │   └─→ filesError (error handling)
    │
    ├─→ SessionStorage
    │   ├─→ userId (user identification)
    │   └─→ token (authentication)
    │
    └─→ UI Components
        ├─→ Sidebar Menu
        ├─→ Modal Overlay
        ├─→ File Cards
        ├─→ Loading Spinner
        └─→ Error Messages
```

## Error States

```
Error Handling Flow

┌─────────────────────────┐
│ Try to Fetch/Delete     │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      │             │
      ↓             ↓
   Success      Error
      │             │
      │        ┌────┴─────────┐
      │        │              │
      │        ↓              ↓
      │    Network       API Error
      │    Error         └──→ Show Message
      │        │              in Modal
      │        ↓
      │    setFilesError()
      │    Show Error UI
      │        │
      │    ┌───┴─────────────┐
      │    │                 │
      │    ↓                 ↓
      │  Empty State   Has Files
      │  "No files"    Display
      │               Cards
      │
      └───→ Update Modal
