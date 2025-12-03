import { useState, useEffect } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import Spin from "./uploadSpinn.jsx";
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
	const [isPreviewable, setIsPreviewable] = useState(false);
	const [isFull, setIsFull] = useState(false);
	const [summary, setSumm] = useState(null);
	const [conc, setConc] = useState(false);
	const [err, resetErr] = useState(null);
	const [progress, setProgress] = useState(0);
	const [dragOver, setDragOver] = useState(false);

	setTimeout(() => {
		if (!summary) return resetErr("Response error, Low network connectivity");
	}, 300000);

	async function dataEnt() {
		try {
			await fetch("https://campushub-mq9h.onrender.com/summary")
				.then((data) => data.json())
				.then((res) => {
					generateSummary(res);
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
		setSumm("Generating...");
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

	useEffect(() => {
		const dz = new Dropzone("#file-dropzone", {
			url: "https://campushub-mq9h.onrender.com/upload",
			autoProcessQueue: true,
			maxFilesize: 150,
			acceptedFiles: ".pdf,.doc,.docx,.pptx,.zip,.mp4,.jpg,.jpeg,.png,.gif",
			addRemoveLinks: true,
			dictRemoveFile: "Remove", // modern remove icon
			maxFiles: 1,
			dictDefaultMessage: "Drag & drop files here or click + to upload",
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

		dz.on("success", (file, response) => resetErr(null));

		dz.on("error", (file, errorMessage) => console.log(errorMessage));

		return () => dz.destroy();
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
				<div className={uploadCSS.summary}>
					<div className={uploadCSS.previewBtns2}>
						<button
							className={uploadCSS.close}
							onClick={() => setConc(false)}
							title="close"
						>
							✖
						</button>
					</div>
					{!summary ? (
						<Spin errorC={err} />
					) : (
						<div
							className={uploadCSS.txts}
							dangerouslySetInnerHTML={{ __html: summary }}
						></div>
					)}
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
		</div>
	);
}

export default Upload;
