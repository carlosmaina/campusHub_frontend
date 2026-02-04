function Notification() {
  // Example data - usually this would come from props or a state
  const notifications = [
    { id: 1, text: "New assignment in CS101", time: "2m ago" },
    { id: 2, text: "CampusHub: Maintenance at 12AM", time: "1h ago" },
  ];

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h4 style={{ margin: 0, fontSize: "14px" }}>Notifications</h4>
      </div>
      <div style={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} style={styles.item}>
              <p style={styles.text}>{n.text}</p>
              <span style={styles.time}>{n.time}</span>
            </div>
          ))
        ) : (
          <p style={styles.empty}>No new updates</p>
        )}
      </div>
      <div style={styles.footer}>
        <button style={styles.button}>View All</button>
      </div>
    </div>
  );
}

// Minimal inline styles for quick setup
const styles = {
  panel: {
    position: "absolute",
    top: "40px", // Adjust based on your header height
    right: "0",
    width: "260px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "1px solid #e0e0e0",
    zIndex: 1000,
    overflow: "hidden",
  },
  header: {
    padding: "10px 15px",
    borderBottom: "1px solid #f0f0f0",
    backgroundColor: "#f9f9f9",
  },
  list: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  item: {
    padding: "12px 15px",
    borderBottom: "1px solid #f5f5f5",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  text: {
    margin: "0 0 4px 0",
    fontSize: "13px",
    color: "#333",
  },
  time: {
    fontSize: "11px",
    color: "#888",
  },
  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#999",
    fontSize: "13px",
  },
  footer: {
    padding: "8px",
    textAlign: "center",
    borderTop: "1px solid #f0f0f0",
  },
  button: {
    background: "none",
    border: "none",
    color: "#007bff",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Notification;
