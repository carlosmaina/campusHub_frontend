import { useState } from "react";
import styles from "../../components.css.styles/topBar.module.css";
import Notification from "../notifications/notification.jsx";
export function TopBar() {
  const [notification, setNotification] = useState(false);
  return (
    <nav className={styles.topNav}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <i className="fas fa-graduation-cap logo-icon"></i>
        <div className={styles.logo}>CampusHub</div>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <i className={`fas fa-search ${styles.searchIcon}`}></i>
        <input type="text" placeholder="Ask AI or search for resources..." />
      </div>

      {/* Actions */}
      <div className={styles.navActions}>
        <div
          className={styles.notificationBtn}
          onClick={() => setNotification(!notification)}
        >
          <i className="far fa-bell fa-lg"></i>
          <div className={styles.notificationBadge}>3</div>
        </div>
        {/* notification panel */}
        <div
          className={`${styles.notificationPanel} ${notification ? styles.activePanel : styles.inActive}`}
        >
          <Notification />
        </div>
        <div className={styles.userProfile}>
          <i className="far fa-user-circle fa-lg"></i>
          <div className={styles.user}>user</div>
        </div>

        <button className={`${styles.aiAssistantBtn} ${styles.aiPulse}`}>
          <i className="fas fa-robot"></i>
          <span>AI Assistant</span>
        </button>
      </div>
    </nav>
  );
}
