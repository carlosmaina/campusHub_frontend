import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "./spinner.jsx";
import topStyle from "../mainCss/topbar.module.css";

function TopBar() {
	const navigate = useNavigate();
	const location = useLocation();

	// user state from sessionStorage
	const [user, setUser] = useState(() => {
		const stored = sessionStorage.getItem("users");
		return stored ? JSON.parse(stored) : null;
	});

	const [rotate, setRotate] = useState(false);

	// Spinner reset after 5s
	useEffect(() => {
		if (!rotate) return;
		const timer = setTimeout(() => setRotate(false), 5000);
		return () => clearTimeout(timer);
	}, [rotate]);

	// Logout handler
	const handleLogout = () => {
		sessionStorage.removeItem("users");
		setUser(null);         // clear state
		setRotate(true);       // show spinner
		navigate("/");         // go home
	};

	return (
		<div className={topStyle.topBar}>
			<nav className={`${user ? topStyle.nav_user : topStyle.nav}`}>
				<div className={topStyle.vs}>
					{/* HOME */}
					<div className={topStyle.acc}>
						<Link
							to="/"
							className={`${topStyle.link} ${location.pathname === "/" ? topStyle.activeLink : ""
								}`}
						>
							<i className="fa-solid fa-house"></i>
							<p>Home</p>
						</Link>

						{user && (
							<div className={topStyle.dropdown}>
								<Link className={topStyle.link} to="/">
									Home
								</Link>
								<Link className={topStyle.link} to="/dashboard">
									Dashboard
								</Link>
							</div>
						)}
					</div>

					{/* RESOURCES */}
					<Link
						to="/resources"
						className={`${topStyle.link} ${location.pathname === "/resources" ? topStyle.activeLink : ""
							}`}
					>
						<i className="fa-solid fa-folder"></i>
						<p>Resources</p>
					</Link>

					{/* VIDEOS */}
					<Link
						to="/videos"
						className={`${topStyle.link} ${location.pathname === "/videos" ? topStyle.activeLink : ""
							}`}
					>
						<i className="fa-solid fa-folder"></i>
						<p>Videos</p>
					</Link>

					{/* NOTIFICATIONS */}
					<Link
						to="/notifications"
						className={`${topStyle.link} ${location.pathname === "/notifications" ? topStyle.activeLink : ""
							}`}
					>
						<i className="fa-solid fa-bell"></i>
						<p>Notifications</p>
					</Link>

					{/* ACCOUNT */}
					<div className={topStyle.acc}>
						<p
							className={`${topStyle.link} ${location.pathname === "/login" || location.pathname === "/signup"
									? topStyle.activeLink
									: ""
								}`}
						>
							Account
						</p>

						<div className={topStyle.dropdown}>
							{!user ? (
								<>
									<Link className={topStyle.link} to="/login">
										Login
									</Link>
									<Link className={topStyle.link} to="/signup">
										SignUp
									</Link>
								</>
							) : (
								<p className={topStyle.link} onClick={handleLogout}>
									Logout
								</p>
							)}
						</div>
					</div>
				</div>

				{/* USER ICON */}
				{user && (
					<div className={topStyle.user}>
						<i className="fas fa-user"></i> {user.user}
					</div>
				)}
			</nav>

			{/* Spinner overlay */}
			<div className={rotate ? topStyle.con : topStyle.conActive}>
				<Spinner />
			</div>
		</div>
	);
}

export default TopBar;
