import { useEffect, useRef, useState } from "react";
import styles from "../mainCss/assistant.module.css";
import choice from "./DATA/data.js";

function CampusHubAssistantChat({ stack, reset }) {
	const [user, setUser] = useState("");
	const cont = useRef(null);

	// unified message list
	const [messages, setMessages] = useState(() => {
		const saved = sessionStorage.getItem("messages");
		return saved
			? JSON.parse(saved)
			: [
					{
						sender: "bot",
						text: "Hey! I can help you navigate through the platform?",
					},
			  ];
	});
	useEffect(() => {
		sessionStorage.setItem("messages", JSON.stringify(messages));
	}, [messages]);

	// handle user message
	function display() {
		if (user.trim().length < 1) return;

		setMessages([...messages, { sender: "user", text: user }]);
		setUser("");
	}

	// bot response
	useEffect(() => {
		let last = messages[messages.length - 1];
		if (!last || last.sender !== "user") return;

		let text = last.text.toLowerCase();

		let found = choice.find((obj) =>
			obj.keywords.some((key) => text.includes(key.toLowerCase()))
		);

		let reply = found ? found.reply : "I didn't understand that.";

		setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
	}, [messages]);

	// ⬇️ auto-scroll to bottom whenever messages update
	useEffect(() => {
		if (cont.current) {
			cont.current.scrollTop = cont.current.scrollHeight;
		}
	}, [messages]);

	function inputSec(e) {
		if (e.key === "Enter") display();
	}

	return (
		<div className={styles.main}>
			<div className={styles.chatContainer}>
				<div className={styles.header}>
					<h2>CampusHub Assistant</h2>
					<p onClick={() => reset(!stack)} title="close Assistant">
						✖
					</p>
				</div>

				<div ref={cont} className={styles.messagesArea}>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`${styles.message} ${
								msg.sender === "bot" ? styles.ai : styles.user
							}`}
						>
							{msg.text}
						</div>
					))}
				</div>

				<div className={styles.inputArea}>
					<input
						type="text"
						value={user}
						onChange={(e) => setUser(e.target.value)}
						onKeyDown={inputSec}
						placeholder="Ask your Assistant..."
						className={styles.input}
					/>
					<button className={styles.sendBtn} onClick={display}>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}

export default CampusHubAssistantChat;
