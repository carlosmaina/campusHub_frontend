import { Link } from "react-router-dom";
import { useState } from "react";
import topStyle from "../mainCss/topbar.module.css";

function TopBar() {
  const [active, setActive] = useState("home");

  return (
    <div className={topStyle.topBar}>
      <nav className={topStyle.nav}>
        <Link
          className={`${topStyle.link} ${
            active === "home" ? topStyle.activeLink : ""
          }`}
          onClick={() => setActive("home")}
          to="/"
        >
          <i className="fa-solid fa-house"></i>
          <p>Home</p>
        </Link>

        <Link
          className={`${topStyle.link} ${
            active === "resources" ? topStyle.activeLink : ""
          }`}
          onClick={() => setActive("resources")}
          to="/resources"
        >
          <i className="fa-solid fa-folder"></i>
          <p>Resources</p>
        </Link>

        <Link
          className={`${topStyle.link} ${
            active === "notifications" ? topStyle.activeLink : ""
          }`}
          onClick={() => setActive("notifications")}
          to="/notifications"
        >
          <i className="fa-solid fa-bell"></i>
          <p>Notifications</p>
        </Link>

        {/* ACCOUNT with active class + dropdown */}
        <div className={`${topStyle.acc}`} onClick={() => setActive("account")}>
          <p
            className={`${topStyle.link} ${
              active === "account" ? topStyle.activeLink : ""
            }`}
          >
            Account
          </p>

          <div className={topStyle.dropdown}>
            <Link className={topStyle.link} to="/login">
              <i className="fa-solid fa-user"></i> Login
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
