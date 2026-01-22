import { useState, useEffect } from "react";
import notifyCSS from "../mainCss/notification.module.css";

function Notifications() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch notifications on component mount and set auto-refresh
  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get userId from sessionStorage
      const userStr = sessionStorage.getItem("users");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      // Get token from sessionStorage
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://campushub-hwty.onrender.com/notifications?userId=${user.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      
      // Format timestamps for display
      const formattedNotifications = data.notifications.map((note) => ({
        ...note,
        timeAgo: getTimeAgo(new Date(note.createdAt)),
      }));

      setNotes(formattedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Convert date to "time ago" format
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Delete notification handler
  const handleDeleteNotification = async (notificationId) => {
    try {
      setDeleting(notificationId);
      
      // Get userId from sessionStorage
      const userStr = sessionStorage.getItem("users");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.userId) {
        setError("User not logged in");
        setDeleting(null);
        return;
      }

      // Get token from sessionStorage
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setDeleting(null);
        return;
      }

      const response = await fetch(
        `https://campushub-hwty.onrender.com/notification/${notificationId}?userId=${user.userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove from UI with animation
      setNotes(notes.filter((note) => note._id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError(err.message || "Failed to delete notification");
    } finally {
      setDeleting(null);
    }
  };

  // Clear error message
  const clearError = () => setError(null);

  // Refresh notifications manually
  const handleRefresh = () => {
    setError(null);
    fetchNotifications();
  };

  // Get notification type color
  const getNotificationColor = (type) => {
    const colors = {
      welcome: { bg: "#fef3c7", color: "#b45309", icon: "fa-star" },
      upload: { bg: "#dbeafe", color: "#1e40af", icon: "fa-upload" },
      system: { bg: "#f3e8ff", color: "#7c3aed", icon: "fa-gears" },
      info: { bg: "#e0f2fe", color: "#0284c7", icon: "fa-bell" }
    };
    return colors[type] || colors.info;
  };

  return (
    <div className={notifyCSS.wrapper}>
      <div className={notifyCSS.header}>
        <div className={notifyCSS.titleContainer}>
          <h2 className={notifyCSS.title}>
            <i className="fa-solid fa-bell"></i> Notifications
          </h2>
          {notes.length > 0 && (
            <span className={notifyCSS.badge}>{notes.length}</span>
          )}
        </div>
        <button
          className={notifyCSS.refreshBtn}
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh notifications"
        >
          <i className={`fa-solid fa-rotate-right ${loading ? notifyCSS.spinning : ""}`}></i>
        </button>
      </div>

      {error && (
        <div className={notifyCSS.errorAlert}>
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
          <button className={notifyCSS.closeErrorBtn} onClick={clearError}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {loading && notes.length === 0 && (
        <div className={notifyCSS.loadingContainer}>
          <div className={notifyCSS.spinner}></div>
          <p className={notifyCSS.loadingText}>Loading notifications...</p>
        </div>
      )}

      {!loading && notes.length === 0 && !error && (
        <div className={notifyCSS.emptyContainer}>
          <i className="fa-solid fa-inbox"></i>
          <p className={notifyCSS.emptyText}>No notifications yet</p>
          <p className={notifyCSS.emptySubtext}>You're all caught up!</p>
        </div>
      )}

      <div className={notifyCSS.list}>
        {notes.map((n) => {
          const notifColor = getNotificationColor(n.type);
          return (
            <div
              key={n._id}
              className={`${notifyCSS.card} ${deleting === n._id ? notifyCSS.deleting : ""}`}
            >
              <div
                className={notifyCSS.icon}
                style={{
                  background: notifColor.bg,
                  color: notifColor.color,
                }}
              >
                <i className={`fa-solid ${notifColor.icon}`}></i>
              </div>

              <div className={notifyCSS.info}>
                <h3 className={notifyCSS.cardTitle}>{n.title}</h3>
                <p className={notifyCSS.cardMessage}>{n.message}</p>
                <span className={notifyCSS.time}>{n.timeAgo}</span>
              </div>

              <button
                className={notifyCSS.deleteBtn}
                onClick={() => handleDeleteNotification(n._id)}
                disabled={deleting === n._id}
                title="Delete notification"
              >
                {deleting === n._id ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-trash"></i>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Notifications;