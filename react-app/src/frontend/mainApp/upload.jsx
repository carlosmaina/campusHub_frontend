import { useState, useRef } from "react";
import uploadCSS from "../mainCss/upload.module.css";

function Upload({ state }) {
  const none = "(None selected)";
  const btnTxt = "Upload File";

  const [fileName, resetFile] = useState(none);
  const [btn, resetBtn] = useState(btnTxt);
  const [charge, setCharge] = useState(false);
  const [fileObj, setFileObj] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  // ---- Modal + fullscreen states ----
  const [showPreview, setShowPreview] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const iframeRef = useRef(null);

  
  function vary() {
    resetBtn("Uploading...");
    setCharge(true);
    setTimeout(() => {
      setCharge(false);
      resetBtn(btnTxt);
    }, 60000);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    resetFile(file.name);
    setFileObj(file);
    setPreviewURL(URL.createObjectURL(file));
  }

  // ---- Fullscreen / Reduce via CSS ----
  function toggleFullScreen() {
    setIsFull((prev) => !prev);
  }

  // ---- Close modal safely ----
  function closePreview() {
    setShowPreview(false);
    setIsFull(false);
  }

  return (
    <div
      className={`${uploadCSS.upload} ${
        state === "download" ? uploadCSS.inActive : ""
      }`}
    >
      <h2 className={uploadCSS.title}>
        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Your Resource
      </h2>

      <p className={uploadCSS.desc}>
        Select a file to share with others. You can upload notes, assignments,
        or any helpful document that contributes to the learning space.
      </p>

      <div className={uploadCSS.box}>
        <input
          type="file"
          id="file"
          accept=".pdf, .doc, .docx, .zip"
          onChange={handleFile}
        />
        <label htmlFor="file" className={uploadCSS.uploadLabel}>
          +
        </label>
        <p className={uploadCSS.hint}>Click the + icon or drag a file here</p>
        <p>
          <span className={uploadCSS.file}>File name : </span>
          {fileName}
        </p>
      </div>

      <div className={uploadCSS.rules}>
        <h4>📘 Guidelines</h4>
        <ul>
          <li>Max file size: 25MB</li>
          <li>Supported formats: PDF, DOCX, PPTX, ZIP</li>
          <li>Do not upload copyrighted or personal content</li>
        </ul>
      </div>

      <div className={uploadCSS.cont}>
        <button
          className={`${uploadCSS.submitBtn} ${
            charge ? uploadCSS.charging : ""
          }`}
          disabled={fileName === none}
          onClick={vary}
        >
          <span className={uploadCSS.btnText}>{btn}</span>
        </button>

        <button
          className={uploadCSS.submitBtn}
          disabled={fileName === none}
          onClick={() => setShowPreview(true)}
        >
          File preview
        </button>
      </div>

      {/* ---- Preview Modal ---- */}
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
                <button onClick={toggleFullScreen}>
                  {isFull ? (
                    <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
                  ) : (
                    <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                  )}
                </button>
                <button onClick={closePreview}>✖</button>
              </div>
            </div>

            {fileObj.type === "application/pdf" && (
              <div className={uploadCSS.mainCont}>
                <iframe
                  ref={iframeRef}
                  src={previewURL}
                  title="pdf-preview"
                ></iframe>
              </div>
            )}

            {(fileObj.type.includes("word") ||
              fileObj.type.includes("zip") ||
              fileObj.name.endsWith(".docx") ||
              fileObj.name.endsWith(".zip")) && <p>Preview not available.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
