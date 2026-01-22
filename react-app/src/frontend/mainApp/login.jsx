import React, { useState, useEffect } from "react";
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
		return JSON.parse(sessionStorage.getItem("users")) || null;
	});
	const [feedback, setFeedback] = useState(null);

	// Initialize Google Sign-In
	useEffect(() => {
		// Load Google Sign-In script
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		script.onload = () => {
			window.google?.accounts?.id?.initialize({
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
				callback: handleGoogleLogin,
			});
		};

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleGoogleLogin = (response) => {
		if (response.credential) {
			// Send credential to backend for verification
			fetch("https://campushub-hwty.onrender.com/auth/google-login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: response.credential }),
			})
				.then((res) => res.json())
				.then((resData) => {
					if (resData.message === "User logged in") {
						setFeedback({
							type: "success",
							message: "Google login successful 🎉",
							check: "redirecting...",
						});
						sessionStorage.setItem("users", JSON.stringify(resData));
						sessionStorage.setItem("userId", resData.userId);
						sessionStorage.setItem("userRole", resData.role);
						sessionStorage.setItem("token", resData.token);
						setTimeout(() => navigate("/"), 3000);
					} else {
						setFeedback({
							type: "error",
							message: resData.error || "Google login failed",
						});
					}
					setTimeout(() => setFeedback(null), 3000);
				})
				.catch((err) => {
					setFeedback({
						type: "error",
						message: "Google login failed. Try again.",
					});
				});
		}
	};

	const handleAppleLogin = () => {
		// Apple Sign-In implementation
		if (window.AppleID) {
			window.AppleID.auth.init({
				clientId: process.env.REACT_APP_APPLE_CLIENT_ID || "YOUR_APPLE_CLIENT_ID",
				teamId: process.env.REACT_APP_APPLE_TEAM_ID || "YOUR_APPLE_TEAM_ID",
				redirectURI: `${window.location.origin}/auth/apple-callback`,
				scope: ["email", "name"],
				usePopup: true,
			});

			window.AppleID.auth.signIn().then((response) => {
				fetch("https://campushub-hwty.onrender.com/auth/apple-login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ authorization: response.authorization }),
				})
					.then((res) => res.json())
					.then((resData) => {
						if (resData.message === "User logged in") {
							setFeedback({
								type: "success",
								message: "Apple login successful 🎉",
								check: "redirecting...",
							});
							sessionStorage.setItem("users", JSON.stringify(resData));
							sessionStorage.setItem("userId", resData.userId);
							sessionStorage.setItem("userRole", resData.role);
							sessionStorage.setItem("token", resData.token);
							setTimeout(() => navigate("/"), 3000);
						} else {
							setFeedback({
								type: "error",
								message: resData.error || "Apple login failed",
							});
						}
						setTimeout(() => setFeedback(null), 3000);
					})
					.catch(() => {
						setFeedback({
							type: "error",
							message: "Apple login failed. Try again.",
						});
					});
			});
		}
	};

	const onSubmit = (data) => {
		fetch("https://campushub-hwty.onrender.com/Login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data }),
		})
			.then((res) => res.json())
			.then((resData) => {
				if (resData.success && resData.requiresOTP) {
					// OTP sent successfully - show OTP input
					setFeedback({
						type: "success",
						message: "OTP sent to your email! 📧",
						check: "Please check your inbox...",
					});
				} else if (resData.message === "User logged in") {
					setFeedback({
						type: "success",
						message: "Login successful 🎉",
						check: "redirecting...",
					});
					sessionStorage.setItem("users", JSON.stringify(resData));
					sessionStorage.setItem("userId", resData.userId);
					sessionStorage.setItem("userRole", resData.role);
					sessionStorage.setItem("token", resData.token);
					setTimeout(() => {
						navigate("/");
					}, 3000);
				}
				if (resData === "Invalid password") {
					setFeedback({
						type: "error",
						message: "Invalid Password",
					});
				} else if (resData === "User doesn't exist") {
					setFeedback({
						type: "error",
						message: "Account doesn't exist",
					});
				}

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

				{/* Divider */}
				<div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
					<hr style={{ flex: 1, borderColor: "#ddd" }} />
					<span style={{ padding: "0 10px", color: "#999" }}>or</span>
					<hr style={{ flex: 1, borderColor: "#ddd" }} />
				</div>

				{/* OAuth Login Buttons */}
				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					{/* Google Login */}
					<button
						type="button"
						onClick={() => {
							const div = document.createElement("div");
							div.id = "google_signin_button";
							document.body.appendChild(div);
							window.google?.accounts?.id?.renderButton(div, {
								type: "standard",
								size: "large",
								theme: "outline",
								text: "signin_with",
								locale: "en_US",
							});
						}}
						className="oauth-btn google-btn"
						style={{
							padding: "12px",
							backgroundColor: "#fff",
							border: "1px solid #ddd",
							borderRadius: "6px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "10px",
						}}
					>
						<svg width="20" height="20" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h3.26c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.89 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-5.64-4.53H3.07v2.86C7.86 21.8 9.84 23 12 23z"/>
							<path fill="#FBBC04" d="M6.36 18.04c-.39-1.05-.61-2.16-.61-3.31s.22-2.26.61-3.31V8.46H3.07A11.36 11.36 0 000 12c0-1.92.47-3.75 1.31-5.38h4.02c3.05-6.14 5.77-7.72 6.81-3.95zM12 5.74c2.05 0 3.89.71 5.34 1.87v-.34c0-2.18-1.79-3.96-4-3.96-3.48-2.35-5.77 0-9.68 0zm0 .93c-1.88 0-3.5.72-4.68 1.89v4.45c1.16 1.17 2.8 1.89 4.68 1.89s2.92-.78 4.08-1.89V9.45c-1.16-1.17-2.2 1.89-4.08-1.89z"/>
						</svg>
						Sign in with Google
					</button>

					{/* Apple Login */}
					<button
						type="button"
						onClick={handleAppleLogin}
						className="oauth-btn apple-btn"
						style={{
							padding: "12px",
							backgroundColor: "#000",
							color: "#fff",
							border: "1px solid #000",
							borderRadius: "6px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "10px",
						}}
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M17.05 13.5c-.91 0-1.82-.33-2.56-1.02a4.08 4.08 0 0 0-2.6-1.1c-.93 0-1.8.38-2.6 1.1-.73.69-1.65 1.02-2.56 1.02-1.62 0-2.97-.97-3.29-2.4-.11-.5-.16-1.02-.16-1.55 0-3.64 2.96-6.6 6.6-6.6 1.76 0 3.44.7 4.66 1.93 1.2 1.2 1.87 2.84 1.87 4.67 0 3.64-2.96 6.6-6.6 6.6z"/>
						</svg>
						Sign in with Apple
					</button>
				</div>

				<p className="auth-switch">
					No account yet? <Link className="links" to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
}
