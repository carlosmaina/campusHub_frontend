import { useState } from "react";
import Search from "./online.jsx";
import downloadCSS from "../mainCss/download.module.css";
import Locally from "./localdownload.jsx";

// getting import as a state
function Download({ state }) {
  // State to track which button is active
  const [activeTab, setActiveTab] = useState("online"); // default is "online"
  const [toggle, resetToggle] = useState("onlineDownloads");
  return (
    <div
      className={`${downloadCSS.download} ${
        state === "upload" ? downloadCSS.inActive : ""
      }`}
    >
      <h2 className={downloadCSS.title}>Available Resources</h2>

      <div className={`${downloadCSS.btns}`}>
        <button
          className={`${downloadCSS.search} ${
            activeTab === "online" ? downloadCSS.active : ""
          }`}
          onClick={() => {
            setActiveTab("online");
            resetToggle("onlineDownloads");
          }}
        >
          Online
        </button>
        <button
          className={`${downloadCSS.search} ${
            activeTab === "local" ? downloadCSS.active : ""
          }`}
          onClick={() => {
            setActiveTab("local");
            resetToggle("Locally");
          }}
        >
          Locally
        </button>
      </div>
      <Search toggle={toggle} />
      <Locally toggle={toggle} />
    </div>
  );
}

export default Download;
