import { Link, useLocation } from "react-router-dom";
import topStyle from "../mainCss/topbar.module.css";

function TopBar() {
	const location = useLocation();

	return (
		<div className={topStyle.topBar}>
			<nav className={topStyle.nav}>
				{/* HOME */}
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

					<div className={topStyle.dropdown}>
						<Link className={topStyle.link} to="/">
							Home
						</Link>
						<Link className={topStyle.link} to="/dashboard">
							Dashboard
						</Link>
					</div>
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
							location.pathname === "/login" || location.pathname === "/signup"
								? topStyle.activeLink
								: ""
						}`}
					>
						Account
					</p>

					<div className={topStyle.dropdown}>
						<Link className={topStyle.link} to="/login">
							Login
						</Link>
						<Link className={topStyle.link} to="/signup">
							SignUp
						</Link>
					</div>
				</div>
			</nav>
		</div>
	);
}

export default TopBar;
