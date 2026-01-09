import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "./spinner.jsx";
import topStyle from "../mainCss/topbar.module.css";
import { useState } from "react";

function TopBar() {
	let navi = useNavigate();
	const location = useLocation();
	const [rotate, resetRot] = useState(false);
	let [ux, reset] = useState(() => JSON.parse(localStorage.getItem("user")));
	// remove data from session storage
	function remove(d) {
		reset(null);
		localStorage.removeItem(d);
	}
	setTimeout(() => {
		if (rotate) {
			resetRot(false);
		}
	}, 5000);
	return (
		<div className={topStyle.topBar}>
			<nav className={`${!ux ? topStyle.nav : topStyle.nav_user}`}>
				{/* HOME */}
				<div className={topStyle.vs}>
					<div className={topStyle.acc}>
						<Link
							to="/"
							className={`${topStyle.link} ${
								location.pathname === "/" ? topStyle.activeLink : ""
							}`}
						>
							<i className="fa-solid fa-house"></i>
							<p>Home</p>
						</Link>

						{ux && (
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
						className={`${topStyle.link} ${
							location.pathname === "/resources" ? topStyle.activeLink : ""
						}`}
					>
						<i className="fa-solid fa-folder"></i>
						<p>Resources</p>
					</Link>
					{/* videos */}
					<Link
						to="/videos"
						className={`${topStyle.link} ${
							location.pathname === "/videos" ? topStyle.activeLink : ""
						}`}
					>
						<i className="fa-solid fa-folder"></i>
						<p>Videos</p>
					</Link>
					{/* NOTIFICATIONS */}
					<Link
						to="/notifications"
						className={`${topStyle.link} ${
							location.pathname === "/notifications" ? topStyle.activeLink : ""
						}`}
					>
						<i className="fa-solid fa-bell"></i>
						<p>Notifications</p>
					</Link>

					{/* ACCOUNT */}
					<div className={topStyle.acc}>
						<p
							className={`${topStyle.link} ${
								location.pathname === "/login" ||
								location.pathname === "/signup"
									? topStyle.activeLink
									: ""
							}`}
						>
							Account
						</p>

						{!ux ? (
							<div className={topStyle.dropdown}>
								<Link className={topStyle.link} to="/login">
									Login
								</Link>
								<Link className={topStyle.link} to="/signup">
									SignUp
								</Link>
							</div>
						) : (
							<div className={topStyle.dropdown}>
								{" "}
								<p
									className={topStyle.link}
									onClick={() => {
										remove("user");
										navi("/");
										resetRot(!rotate);
									}}
								>
									Logout
								</p>
							</div>
						)}
					</div>
				</div>
				{ux && (
					<div className={topStyle.user}>
						<i className="fas fa-user"></i> {ux.user}
					</div>
				)}
			</nav>
			{/* spinning wheel container */}
			<div className={`${!rotate ? topStyle.conActive : topStyle.con}`}>
				<Spinner />
			</div>
		</div>
	);
}
export default TopBar;
