import { useState, useEffect } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import Spin from "./uploadSpinn.jsx";
import uploadCSS from "../mainCss/upload.module.css";
Dropzone.autoDiscover = false;

function Upload({ state }) {
  // for the sidebar
  const [openSide, setOpenSide] = useState(false);

  function toggleSidebar() {
    setOpenSide((prev) => !prev);
  }

  // State for viewing uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUploadedFiles, setShowUploadedFiles] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState(null);

  // State for saved summaries
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [showSavedSummaries, setShowSavedSummaries] = useState(false);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [summariesError, setSummariesError] = useState(null);
  const [data, setUser] = useState(() => {
    const stored = sessionStorage.getItem("users");
    return stored ? JSON.parse(stored) : null;
  });
  // Metadata fields for resource organization
  const [course, setCourse] = useState("");
  const [unit, setUnit] = useState("");
  const [resourceTags, setResourceTags] = useState("");
  const [metadataError, setMetadataError] = useState(null);
  const none = "(None selected)";
  const btnTxt = "Upload File";
  // displays saved for saved summaries
  const [saveDisplay, disReset] = useState(false);
  // getting the file name
  const [fileName, resetFile] = useState(none);
  // upload btn innerText
  const [btn, resetBtn] = useState(btnTxt);
  // upload btn inner display looks like a charge
  const [charge, setCharge] = useState(false);
  // getting the file object
  const [fileObj, setFileObj] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewable, setIsPreviewable] = useState(false);
  const [isFull, setIsFull] = useState(false);
  // saving summary
  const [summary, setSumm] = useState(null);
  // enable summary preview
  const [conc, setConc] = useState(false);
  // pass error message for display
  const [err, resetErr] = useState(null);
  // for progress bar
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  setTimeout(() => {
    if (saveDisplay === true) {
      disReset(false);
    }
  }, 4000);
  async function dataEnt() {
    try {
      const userId = sessionStorage.getItem("userId") || data?.user;
      const token = sessionStorage.getItem("token") || data?.token;

      await fetch(
        `https://campushub-hwty.onrender.com/summary?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      )
        .then((data) => data.json())
        .then((res) => {
          if (res.ai) return generateSummary(res.ai);
          resetErr(res.error || "Network Error");
        });
    } catch (err) {
      resetErr("Network Error");
    }
  }
  function vary() {
    resetBtn("Uploading...");
    setCharge(true);
    setTimeout(() => {
      setCharge(false);
      resetBtn(btnTxt);
    }, 10000);
  }

  function formatAIResponse(text) {
    if (!text) return "";
    text = text.replace(/\r\n/g, "\n").replace(/<br\s*\/?>/gi, "\n");
    text = text.replace(/<\/?h[1-6]>/gi, "").replace(/<\/?b>/gi, "");
    text = text.replace(/&nbsp;/gi, " ");
    text = text
      .replace(/^\s*###\s*(.+)\s*$/gm, `<h3>$1</h3>`)
      .replace(/^\s*##\s*(.+)\s*$/gm, `<h2>$1</h2>`)
      .replace(/^\s*#\s*(.+)\s*$/gm, `<h1>$1</h1>`)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<i>$2</i>")
      .replace(/^\s*\d+\.\s+(.+)$/gm, "• $1")
      .replace(/^\s*-\s+(.+)$/gm, "• $1")
      .replace(/^\s*\*\s+(.+)$/gm, "• $1")
      .replace(/---/g, "<hr>")
      .replace(/\n/g, "<br>");
    return text;
  }

  function generateSummary(responseText) {
    const formatted = formatAIResponse(responseText);
    setSumm(formatted);
  }

  function toggleFullScreen() {
    setIsFull((prev) => !prev);
  }

  function closePreview() {
    setShowPreview(false);
    setIsFull(false);
  }
  function save() {}
  const getFileIcon = (type) => {
    if (!type) return "📁";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    if (type.includes("ppt")) return "📊";
    if (type.includes("zip")) return "🗜️";
    if (type.includes("image")) return "🖼️";
    if (type.includes("video")) return "🎥";
    return "📁";
  };

  // Fetch uploaded files from backend
  const fetchUploadedFiles = async () => {
    try {
      setLoadingFiles(true);
      setFilesError(null);
      const userId = sessionStorage.getItem("userId") || data?.user;
      const token = sessionStorage.getItem("token") || data?.token;

      const response = await fetch(
        `https://campushub-hwty.onrender.com/myresources?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      const resData = await response.json();

      if (resData.success && resData.resources) {
        setUploadedFiles(resData.resources);
      } else if (Array.isArray(resData)) {
        setUploadedFiles(resData);
      } else {
        setUploadedFiles([]);
        setFilesError(resData.error || "No files found");
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setFilesError("Failed to load uploaded files");
      setUploadedFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Handle delete file
  const deleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const userId = sessionStorage.getItem("userId") || data?.user;
      const token = sessionStorage.getItem("token") || data?.token;

      const response = await fetch(
        `https://campushub-hwty.onrender.com/resource/${fileId}?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      const result = await response.json();

      if (
        result.success ||
        result.message === "Resource deleted successfully"
      ) {
        setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileId));
      } else {
        setFilesError(result.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setFilesError("Failed to delete file");
    }
  };

  // Save AI summary to database
  const saveSummary = async () => {
    if (!summary) return;

    try {
      const userId = sessionStorage.getItem("userId") || data?.user;
      const username = data?.user || "Anonymous";
      const token = sessionStorage.getItem("token") || data?.token;

      const response = await fetch(
        "https://campushub-hwty.onrender.com/save-summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            username,
            pdfTitle: fileName,
            summary,
            course,
            unit,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        disReset(true); // Show saved indicator
        setTimeout(() => disReset(false), 2000); // Hide after 2 seconds
      } else {
        resetErr(result.error || "Failed to save summary");
      }
    } catch (error) {
      console.error("Error saving summary:", error);
      resetErr("Failed to save summary");
    }
  };

  // Fetch saved summaries from database
  const fetchSavedSummaries = async () => {
    try {
      setLoadingSummaries(true);
      setSummariesError(null);
      const userId = sessionStorage.getItem("userId") || data?.user;
      const token = sessionStorage.getItem("token") || data?.token;

      const response = await fetch(
        `https://campushub-hwty.onrender.com/saved-summaries?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      const resData = await response.json();

      if (resData.success && resData.summaries) {
        setSavedSummaries(resData.summaries);
      } else {
        setSavedSummaries([]);
        setSummariesError(resData.error || "No summaries found");
      }
    } catch (error) {
      console.error("Error fetching summaries:", error);
      setSummariesError("Failed to load saved summaries");
      setSavedSummaries([]);
    } finally {
      setLoadingSummaries(false);
    }
  };

  // Delete saved summary
  const deleteSummary = async (summaryId) => {
    if (!window.confirm("Are you sure you want to delete this summary?"))
      return;

    try {
      const userId = sessionStorage.getItem("userId") || data?.user;
      const token = sessionStorage.getItem("token") || data?.token;

      const response = await fetch(
        `https://campushub-hwty.onrender.com/summary/${summaryId}?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.success) {
        setSavedSummaries(savedSummaries.filter((s) => s._id !== summaryId));
      } else {
        setSummariesError(result.error || "Failed to delete summary");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      setSummariesError("Failed to delete summary");
    }
  };

  useEffect(() => {
    const dz = new Dropzone("#file-dropzone", {
      url: "https://campushub-hwty.onrender.com/upload",
      autoProcessQueue: true,
      maxFilesize: 150,
      acceptedFiles: ".pdf,.doc,.docx,.pptx,.zip,.mp4,.jpg,.jpeg,.png,.gif",
      addRemoveLinks: true,
      dictRemoveFile: "Remove", // modern remove icon
      maxFiles: 1,
      dictDefaultMessage: "Drag & drop files here or click + to upload",
    });
    // Add extra JSON data before sending
    dz.on("sending", (file, xhr, formData) => {
      // Get userId from sessionStorage for accurate server tracking
      const userId = sessionStorage.getItem("userId") || data?.user;
      const username = data?.user || "Anonymous";
      const uploadedBy = sessionStorage.getItem("userRole") || "student";
      const token = sessionStorage.getItem("token") || data?.token;

      formData.append("userId", userId);
      formData.append("username", username);
      formData.append("uploadedBy", uploadedBy);
      formData.append("course", course);
      formData.append("unit", unit);
      formData.append("token", token);
    });

    // Drag visual effect
    dz.on("dragover", () => setDragOver(true));
    dz.on("dragleave", () => setDragOver(false));
    dz.on("drop", () => setDragOver(false));

    dz.on("maxfilesexceeded", (file) => {
      dz.removeAllFiles();
      dz.addFile(file);
    });

    dz.on("addedfile", (file) => {
      if (dz.files.length > 1) dz.removeFile(dz.files[0]);
      if (!file.type || file.webkitRelativePath) {
        dz.removeFile(file);
        return;
      }

      if (file.type === "application/pdf") setIsPreviewable(true);
      else setIsPreviewable(false);

      resetFile(file.name);
      setFileObj(file);
      setPreviewURL(URL.createObjectURL(file));
      setProgress(0);
    });

    dz.on("removedfile", () => {
      resetFile(none);
      resetErr(null);
      setFileObj(null);
      setPreviewURL(null);
      setShowPreview(false);
      setIsPreviewable(false);
      setProgress(0);
    });

    dz.on("uploadprogress", (file, prog) => setProgress(prog));

    dz.on("success", (file, response) => {
      console.log(response);
      resetErr(null);
    });

    dz.on("error", (file, errorMessage) => console.log(errorMessage));

    return () => dz.destroy();
  }, []);

  return (
    <>
      <div
        className={`${uploadCSS.upload} ${
          state === "download" ? uploadCSS.inActive : ""
        }`}
      >
        {/* Hamburger */}
        <div
          className={uploadCSS.hamburger}
          onClick={toggleSidebar}
          title="side bar"
        >
          <i className="fa-solid fa-bars"></i>{" "}
        </div>

        {/* Sidebar */}
        <div
          className={`${uploadCSS.sidebar} ${
            openSide ? uploadCSS.sideOpen : ""
          }`}
        >
          <h2>Menu</h2>

          <ul>
            <li
              onClick={() => {
                fetchSavedSummaries();
                setShowSavedSummaries(true);
                setOpenSide(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Saved summary
            </li>
            <li
              onClick={() => {
                fetchUploadedFiles();
                setShowUploadedFiles(true);
                setOpenSide(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Uploaded Files
            </li>
            <li>AI PDF</li>
            <li onClick={() => setOpenSide(false)}>Close</li>
          </ul>
        </div>
        <h2 className={uploadCSS.title}>
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload Your Resource
        </h2>

        <p className={uploadCSS.desc}>
          Select a file to share with others. You can upload notes, assignments,
          or any helpful document.
        </p>

        <form
          action="/upload"
          className={`dropzone ${uploadCSS.modernDropzone} ${
            dragOver ? uploadCSS.dragOver : ""
          }`}
          id="file-dropzone"
        ></form>

        {fileObj && (
          <div className={uploadCSS.fileInfo}>
            <span className={uploadCSS.fileIcon}>
              {getFileIcon(fileObj.type)}
            </span>
            <span className={uploadCSS.fileName}>{fileName}</span>
          </div>
        )}

        {/* Resource Metadata Fields - APPEARS AFTER FILE SELECTION */}
        {fileObj && (
          <div
            className={uploadCSS.metadataForm}
            style={{
              padding: "20px",
              backgroundColor: "#f0f4ff",
              borderRadius: "10px",
              marginBottom: "25px",
              border: "2px solid #3b82f6",
            }}
          >
            <h3
              style={{
                marginTop: "0",
                color: "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <i className="fa-solid fa-book"></i> PDF Details (Required)
            </h3>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}
            >
              Fill in the details below to organize your resource properly.
            </p>

            {metadataError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                ⚠️ {metadataError}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  📚 Course/Subject <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CS101, Mathematics 101"
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setMetadataError(null);
                  }}
                  className="auth-input"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: course ? "2px solid #10b981" : "2px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  🎯 Topic/Unit <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Data Structures, Algebra"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                    setMetadataError(null);
                  }}
                  className="auth-input"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: unit ? "2px solid #10b981" : "2px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                🏷️ Tags (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., notes, exam prep, tutorial (comma-separated)"
                value={resourceTags}
                onChange={(e) => setResourceTags(e.target.value)}
                className="auth-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
        )}

        {charge && (
          <progress
            value={progress}
            max="100"
            className={uploadCSS.progressBar}
          ></progress>
        )}

        <div className={uploadCSS.rules}>
          <h4>📘 Guidelines</h4>
          <ul>
            <li>Max file size: 25MB</li>
            <li>Supported formats: PDF, DOCX, PPTX, ZIP, JPG, PNG, GIF, MP4</li>
            <li>Do not upload copyrighted or personal content</li>
            <li>Add course/topic info for better organization</li>
          </ul>
        </div>

        <div className={uploadCSS.cont}>
          <button
            className={`${uploadCSS.submitBtn} ${
              charge ? uploadCSS.charging : ""
            }`}
            disabled={fileName === none || !course.trim() || !unit.trim()}
            onClick={() => {
              if (!course.trim()) {
                setMetadataError("Please enter a course/subject");
                return;
              }
              if (!unit.trim()) {
                setMetadataError("Please enter a topic/unit");
                return;
              }
              setMetadataError(null);
              vary();
            }}
            title={
              !course.trim() || !unit.trim()
                ? "Please fill in course and topic first"
                : "Upload file"
            }
          >
            <span className={uploadCSS.btnText}>{btn}</span>
          </button>

          <button
            className={uploadCSS.submitBtn}
            disabled={fileName === none}
            onClick={() => {
              setConc(false);
              setShowPreview(true);
            }}
          >
            File preview
          </button>

          <button
            className={uploadCSS.submitBtn}
            disabled={fileName === none || !isPreviewable}
            onClick={() => {
              setSumm(null);
              setConc(true);
              resetErr(null);
              dataEnt();
            }}
          >
            Generate PDF summary
          </button>
        </div>

        {conc && (
          <div className={uploadCSS.summaryWrapper}>
            <div className={uploadCSS.summary}>
              <div
                className={`${uploadCSS.var} ${
                  !saveDisplay ? "" : uploadCSS.varActive
                }`}
              >
                Saved
              </div>
              <div className={uploadCSS.previewBtns2}>
                <button className={uploadCSS.closeBtn} title="save summary">
                  <i className="fas fa-save" onClick={() => saveSummary()}></i>
                </button>
                <button
                  className={uploadCSS.closeBtn}
                  onClick={() => {
                    pdf();
                  }}
                >
                  {" "}
                  <i className="fas fa-download"></i>
                </button>
                <button
                  className={uploadCSS.closeBtn}
                  onClick={() => setConc(false)}
                  title="close"
                >
                  ✖
                </button>
              </div>

              {!summary ? (
                <div className={uploadCSS.txts}>
                  {" "}
                  <Spin errorC={err} />
                </div>
              ) : (
                <div
                  className={uploadCSS.txts}
                  dangerouslySetInnerHTML={{ __html: summary }}
                ></div>
              )}
            </div>
          </div>
        )}

        {showPreview && (
          <div
            className={`${uploadCSS.previewOverlay} ${
              isFull ? uploadCSS.fullscreenModal : ""
            }`}
          >
            <div className={uploadCSS.previewBox}>
              <div className={uploadCSS.previewHeader}>
                <h3>Preview: {fileName}</h3>
                <div className={uploadCSS.previewBtns}>
                  {fileObj?.type !== "video/mp4" &&
                    fileObj?.type !== "image/jpeg" &&
                    fileObj?.type !== "image/png" &&
                    fileObj?.type !== "image/gif" && (
                      <button onClick={toggleFullScreen}>
                        {isFull ? (
                          <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
                        ) : (
                          <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                        )}
                      </button>
                    )}
                  <button onClick={closePreview}>✖</button>
                </div>
              </div>

              <div className={uploadCSS.mainCont}>
                {fileObj?.type === "application/pdf" && (
                  <iframe src={previewURL} title="pdf-preview"></iframe>
                )}
                {fileObj?.type === "video/mp4" && (
                  <video
                    src={previewURL}
                    controls
                    style={{ width: "100%", borderRadius: "8px" }}
                  ></video>
                )}
                {(fileObj?.type === "image/jpeg" ||
                  fileObj?.type === "image/png" ||
                  fileObj?.type === "image/gif") && (
                  <img
                    src={previewURL}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />
                )}
                {![
                  "application/pdf",
                  "video/mp4",
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                ].includes(fileObj?.type) && <p>Preview not available.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files Modal */}
        {showUploadedFiles && (
          <div
            className={uploadCSS.previewOverlay}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className={uploadCSS.previewBox}
              style={{
                maxWidth: "800px",
                maxHeight: "90vh",
                overflow: "auto",
                backgroundColor: "#fff",
              }}
            >
              <div className={uploadCSS.previewHeader}>
                <h3>📁 Your Uploaded Files</h3>
                <button
                  className={uploadCSS.closeBtn}
                  onClick={() => setShowUploadedFiles(false)}
                >
                  ✖
                </button>
              </div>

              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  minHeight: "200px",
                }}
              >
                {loadingFiles ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <Spin />
                  </div>
                ) : filesError ? (
                  <div
                    style={{
                      color: "#d32f2f",
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "#ffebee",
                      borderRadius: "8px",
                    }}
                  >
                    <p>⚠️ {filesError}</p>
                  </div>
                ) : uploadedFiles.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    <p>No files uploaded yet.</p>
                    <p>Start by uploading a file above!</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "12px" }}>
                    {uploadedFiles.map((file) => (
                      <div
                        key={file._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "15px",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontSize: "24px" }}>
                              {getFileIcon(file.mimeType)}
                            </span>
                            <div style={{ flex: 1 }}>
                              <h4
                                style={{
                                  margin: "0 0 4px 0",
                                  fontWeight: "600",
                                  color: "#333",
                                }}
                              >
                                {file.title}
                              </h4>
                              <p
                                style={{
                                  margin: "0",
                                  fontSize: "12px",
                                  color: "#999",
                                }}
                              >
                                {file.course} • {file.unit}
                              </p>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              fontSize: "12px",
                              color: "#666",
                              flexWrap: "wrap",
                            }}
                          >
                            <span>
                              👤 {file.uploadedBy || file.username || "Unknown"}
                            </span>
                            <span>👁️ {file.views || 0} views</span>
                            <span>
                              📅 {new Date(file.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {file.tags && file.tags.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                marginTop: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {file.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: "11px",
                                    backgroundColor: "#e3f2fd",
                                    color: "#1976d2",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginLeft: "12px",
                          }}
                        >
                          <button
                            onClick={() => deleteFile(file._id)}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#d32f2f",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "500",
                              transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#b71c1c";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "#d32f2f";
                            }}
                            title="Delete this file"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Saved Summaries Modal */}
        {showSavedSummaries && (
          <div
            className={uploadCSS.previewOverlay}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className={uploadCSS.previewBox}
              style={{
                maxWidth: "900px",
                maxHeight: "90vh",
                overflow: "auto",
                backgroundColor: "#fff",
              }}
            >
              <div className={uploadCSS.previewHeader}>
                <h3>💾 Saved Summaries</h3>
                <button
                  className={uploadCSS.closeBtn}
                  onClick={() => setShowSavedSummaries(false)}
                >
                  ✖
                </button>
              </div>

              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  minHeight: "200px",
                }}
              >
                {loadingSummaries ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <Spin />
                  </div>
                ) : summariesError ? (
                  <div
                    style={{
                      color: "#d32f2f",
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "#ffebee",
                      borderRadius: "8px",
                    }}
                  >
                    <p>⚠️ {summariesError}</p>
                  </div>
                ) : savedSummaries.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    <p>No saved summaries yet.</p>
                    <p>Generate and save a PDF summary above!</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "15px" }}>
                    {savedSummaries.map((summary) => (
                      <div
                        key={summary._id}
                        style={{
                          padding: "15px",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            gap: "15px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                margin: "0 0 8px 0",
                                fontWeight: "600",
                                color: "#333",
                              }}
                            >
                              📄 {summary.pdfTitle || "Untitled"}
                            </h4>

                            <div
                              style={{
                                display: "flex",
                                gap: "15px",
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              {summary.course && (
                                <span>🏫 {summary.course}</span>
                              )}
                              {summary.unit && <span>📚 {summary.unit}</span>}
                              {summary.username && (
                                <span>👤 {summary.username}</span>
                              )}
                              <span>
                                📅{" "}
                                {new Date(
                                  summary.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "12px",
                                borderRadius: "6px",
                                maxHeight: "200px",
                                overflow: "auto",
                                fontSize: "13px",
                                color: "#555",
                                lineHeight: "1.5",
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  summary.summary.substring(0, 300) + "...",
                              }}
                            ></div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() => {
                                setSumm(summary.summary);
                                setConc(true);
                                setShowSavedSummaries(false);
                              }}
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "500",
                                transition: "background-color 0.3s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#1565c0";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#1976d2";
                              }}
                              title="View this summary"
                            >
                              👁️ View
                            </button>

                            <button
                              onClick={() => deleteSummary(summary._id)}
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#d32f2f",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "500",
                                transition: "background-color 0.3s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#b71c1c";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#d32f2f";
                              }}
                              title="Delete this summary"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Upload;
