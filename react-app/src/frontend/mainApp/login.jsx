import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../mainCss/login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	let navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	let [user] = useState(() => {
		return JSON.parse(localStorage.getItem("user")) || null;
	});

	const [feedback, setFeedback] = useState(null);

	const onSubmit = (data) => {
		fetch("http://localhost:8000/Login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data }),
		})
			.then((res) => res.json())
			.then((resData) => {
				if (resData) {
					setFeedback({
						type: "success",
						message: "Login successful 🎉",
						check: "redirecting...",
					});
					localStorage.setItem("user", JSON.stringify(resData));
					setTimeout(() => {
						navigate("/");
					}, 3000);
				}
				if (resData === false) {
					setFeedback({
						type: "error",
						message: "Invalid Password",
					});
				} else if (resData === null) {
					setFeedback({
						type: "error",
						message: "Account doesn't exist",
					});
				}

				// auto-hide message
				setTimeout(() => setFeedback(null), 3000);
			})
			.catch(() => {
				setFeedback({
					type: "error",
					message: "Something went wrong. Try again.",
				});
			});
	};

	return (
		<div className="mainCont">
			{feedback && (
				<div>
					<div className={`feedback-box ${feedback.type}`}>
						<p>
							{" "}
							<span className="feedback-icon">
								{feedback.type === "success" ? "✅" : "⚠️"}
							</span>
							{feedback.message}
						</p>
						<p>{feedback.check ? feedback.check : "redirection error"}</p>
					</div>
				</div>
			)}
			<div className="auth-container">
				<h2 className="auth-title">Login</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="auth-form">
					<div>
						<input
							className="auth-input"
							type="email"
							placeholder="Email"
							{...register("email", { required: true })}
						/>
						{errors.email && <p className="auth-error">Email required</p>}
					</div>

					<div>
						<input
							className="auth-input"
							type="password"
							placeholder="Password"
							{...register("password", { required: true })}
						/>
						{errors.password && <p className="auth-error">Password required</p>}
					</div>

					<button className="auth-btn">Login</button>
				</form>

				<p className="auth-switch">
					No account yet? <Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
}
