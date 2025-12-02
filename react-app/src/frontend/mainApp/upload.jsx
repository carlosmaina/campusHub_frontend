import { useState, useEffect } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import Spin from "./uploadSpinn.jsx";
import uploadCSS from "../mainCss/upload.module.css";

Dropzone.autoDiscover = false;

function Upload({ state }) {
	// showing if file is selected
	const none = "(None selected)";
	// btn inner text
	const btnTxt = "Upload File";
	// state for file name
	const [fileName, resetFile] = useState(none);
	// state for upload btn
	const [btn, resetBtn] = useState(btnTxt);
	// state for the charge in upload btn
	const [charge, setCharge] = useState(false);
	// state for checking files type
	const [fileObj, setFileObj] = useState(null);
	// state for creating file url in the Iframe and video src
	const [previewURL, setPreviewURL] = useState(null);
	// state for creating preview display
	const [showPreview, setShowPreview] = useState(false);
	// state for disabling btns when file type is not pdf
	const [isPreviewable, setIsPreviewable] = useState(false);
	// state for creating full screen
	const [isFull, setIsFull] = useState(false);
	// state for creating summary
	const [summary, setSumm] = useState(null);
	// state for creating pdf summary preview
	const [conc, setConc] = useState(false);
	// state for creating error
	const [err, resetErr] = useState(null);
	// If response takes long
	setTimeout(() => {
		if (!summary) return resetErr("Response error,Low network connectivity");
	}, 300000);
	async function dataEnt() {
		try {
			await fetch("https://campushub-mq9h.onrender.com/summary")
				.then((data) => data.json())
				.then((res) => {
					let ent = generateSummary(res);
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

		// 1. Normalize line breaks and remove common AI-added HTML
		// Replace Windows line breaks (\r\n) and normalize to just \n
		text = text.replace(/\r\n/g, "\n");

		// Remove existing HTML break tags, converting them to a single newline for processing
		text = text.replace(/<br\s*\/?>/gi, "\n");

		// Remove any pre-existing, unwanted <h3> or <b> tags from the raw AI output
		text = text.replace(/<\/?h[1-6]>/gi, "");
		text = text.replace(/<\/?b>/gi, "");

		// Remove HTML entities like non-breaking spaces
		text = text.replace(/&nbsp;/gi, " ");

		// 2. Headings (Using a strict pattern to prevent accidental matches)
		// Note: We are using $ for the end of the line in step 3's lists,
		// so we must be careful with what we process here.
		text = text
			// Replace Markdown headers, allowing leading/trailing whitespace
			.replace(/^\s*###\s*(.+)\s*$/gm, `<h3>$1</h3>`)
			.replace(/^\s*##\s*(.+)\s*$/gm, `<h2 >$1</h2>`)
			.replace(/^\s*#\s*(.+)\s*$/gm, `<h1>$1</h1>`);

		// 3. Bold **text**
		text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

		// 4. Italics *text*, but ignore bolds
		// This rule looks for an asterisk not preceded or followed by another asterisk.
		text = text.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<i>$2</i>");

		// 5. Lists (Converting list markers to bullet points)
		// Ensure the list item is wrapped for clearer formatting if needed,
		// but for now, we'll stick to just replacing the marker:
		text = text.replace(/^\s*\d+\.\s+(.+)$/gm, "• $1"); // numbered → bullets
		text = text.replace(/^\s*\-\s+(.+)$/gm, "• $1"); // dash lists
		text = text.replace(/^\s*\*\s+(.+)$/gm, "• $1"); // asterisk lists (common Markdown)

		// 6. Horizontal rules
		text = text.replace(/---/g, "<hr>");

		// 7. Finally, convert remaining line breaks to <br>
		// This converts all newlines that WEREN'T part of a block element
		// (like <h3> or <li>, or the new list items starting with •) into <br> tags.
		text = text.replace(/\n/g, "<br>");

		return text;
	}

	// Called when user wants summary
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

	useEffect(() => {
		const dz = new Dropzone("#file-dropzone", {
			url: "https://campushub-mq9h.onrender.com/upload",
			autoProcessQueue: true,
			maxFilesize: 150,
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
			// Remove previous preview instantly
			if (dz.files.length > 1) {
				dz.removeFile(dz.files[0]);
			}
			if (!file.type || file.webkitRelativePath) {
				dz.removeFile(file);
				return;
			}
			if (file.type === "application/pdf") setIsPreviewable(true);
			else {
				setIsPreviewable(false);
			}
			resetFile(file.name);
			setFileObj(file);
			setPreviewURL(URL.createObjectURL(file));
		});

		dz.on("removedfile", () => {
			resetFile(none);
			resetErr(null);
			setFileObj(null);
			setPreviewURL(null);
			setShowPreview(false);
			setIsPreviewable(false); // reset
		});

		dz.on("success", (file, response) => {
			// console.log("Uploaded", response);
			resetErr(null);
		});

		dz.on("error", (file, errorMessage) => {
			console.log(errorMessage);
		});

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
				or any helpful document that contributes to the learning space.
			</p>

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
							onClick={() => {
								setConc(false);
							}}
							title="close"
						>
							✖
						</button>
					</div>

					{/*  NEW: Properly formatted summary */}
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

						{fileObj && fileObj?.type === "application/pdf" ? (
							<div className={uploadCSS.mainCont}>
								<iframe src={previewURL} title="pdf-preview"></iframe>
							</div>
						) : fileObj && fileObj.type === "video/mp4" ? (
							<div className={uploadCSS.mainCont}>
								<video
									src={previewURL}
									controls
									style={{ width: "100%", borderRadius: "8px" }}
								></video>
							</div>
						) : (
							<p>Preview not available.</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Upload;
