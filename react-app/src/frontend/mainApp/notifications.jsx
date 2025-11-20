import { useState} from "react";
import notifyCSS from "../mainCss/notification.module.css";

function Notifications() {
  // fake sample notifications (replace with backend later)
  const [notes] = useState([
    {
      id: 1,
      title: "New File Uploaded",
      message: "Your lecturer added a new PDF to Data Structures.",
      time: "2 hrs ago",
    },
    {
      id: 2,
      title: "Maintenance Alert",
      message: "CampusHub will undergo maintenance tonight at 11 PM.",
      time: "5 hrs ago",
    },
    {
      id: 3,
      title: "Assignment Posted",
      message: "A new assignment has been posted for Web Development.",
      time: "Yesterday",
    },
  ]);
  return (
    <div className={notifyCSS.wrapper}>
      <h2 className={notifyCSS.title}>Notifications</h2>

      <div className={notifyCSS.list}>
        {notes.map((n) => (
          <div key={n.id} className={notifyCSS.card}>
            <div className={notifyCSS.icon}>
              <i className="fa-solid fa-bell"></i>
            </div>

            <div className={notifyCSS.info}>
              <h3>{n.title}</h3>
              <p>{n.message}</p>
              <span className={notifyCSS.time}>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
