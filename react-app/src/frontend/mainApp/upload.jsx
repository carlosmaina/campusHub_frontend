import { useState, useEffect } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import uploadCSS from "../mainCss/upload.module.css";

Dropzone.autoDiscover = false;

function Upload({ state }) {
  const none = "(None selected)";
  const btnTxt = "Upload File";




























































































































































  








  const [fileName, resetFile] = useState(none);
  const [btn, resetBtn] = useState(btnTxt);
  const [charge, setCharge] = useState(false);
  const [fileObj, setFileObj] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  























































































































































































































































































































































































  

























  
  
  
  const [showPreview, setShowPreview] = useState(false);
  const [isFull, setIsFull] = useState(false);

  function vary() {
    resetBtn("Uploading...");
    setCharge(true);
    setTimeout(() => {
      setCharge(false);
      resetBtn(btnTxt);
    }, 60000);
  }

  function toggleFullScreen() {
    setIsFull((prev) => !prev);
  }

  function closePreview() {
    setShowPreview(false);
    setIsFull(false);
  }

  useEffect(() => {
    const dz = new Dropzone("#file-dropzone", {
      url: "https://campushub-mq9h.onrender.com/upload",
      autoProcessQueue: true,
      maxFilesize: 150, // MB
      acceptedFiles: ".pdf,.doc,.docx,.pptx,.zip,.mp4",
      addRemoveLinks: true,
      maxFiles: 1,
      dictDefaultMessage: "Drag & drop files here or click + to upload",
    });

    dz.on("maxfilesexceeded", (file) => {
      dz.removeAllFiles();
      dz.addFile(file);
    });

    dz.on("addedfile", (file) => {
      // Reject folders: browsers set file.type empty or use webkitRelativePath
      if (!file.type || file.webkitRelativePath) {
        dz.removeFile(file);
        return; // keep Dropzone active
      }

      resetFile(file.name);
      setFileObj(file);
      setPreviewURL(URL.createObjectURL(file));
    });

    dz.on("removedfile", () => {
      resetFile(none);
      setFileObj(null);
      setPreviewURL(null);
      setShowPreview(false);
    });

    dz.on("success", (file, response) => {
      console.log("Uploaded:", response);
      vary();
    });

    dz.on("error", (file, errorMessage) => {
      console.error("Upload error:", errorMessage);
    });

    return () => {
      dz.destroy();
    };
  }, []);

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

      {/* Dropzone area */}
      <form
        action="/upload"
        className={`dropzone ${uploadCSS.modernDropzone}`}
        id="file-dropzone"
      ></form>

      <p>
        <span className={uploadCSS.file}>File name : </span>
        {fileName}
      </p>

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
                {fileObj?.type === "video/mp4" ? (
                  ""
                ) : (
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

            {fileObj && fileObj.type === "application/pdf" ? (
              <div className={uploadCSS.mainCont}>
                <iframe src={previewURL} title="pdf-preview"></iframe>
              </div>
            ) : fileObj && fileObj.type === "video/mp4" ? (
              <div className={uploadCSS.mainCont}>
                <video
                  src={previewURL}
                  controls
                  style={{ width: "100%", borderRadius: "8px" }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              fileObj && <p>Preview not available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
