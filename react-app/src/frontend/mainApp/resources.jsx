import { useState } from "react";
import Download from "./download.jsx";
import Upload from "./upload.jsx";
import resourceCSS from "../mainCss/resource.module.css";

function ResourcePage() {
  let [nav, resetNav] = useState("download");
  function navPage(nxt) {
    resetNav(nxt);
  }
  return (
    <div className={resourceCSS.sets}>
      <div className="setNavs">
        
      </div>
      <div className={resourceCSS.topSet}>
        <div
          className={`${resourceCSS.views} ${
            nav === "download" ? resourceCSS.activeView : ""
          }`}
          onClick={() => navPage("download")}
        >
          Download
        </div>
        <div
          className={`${resourceCSS.views} ${
            nav === "upload" ? resourceCSS.activeView : ""
          }`}
          onClick={() => navPage("upload")}
        >
          Upload
        </div>
        <Download state={nav} />
        <Upload state={nav} />
      </div>
    </div>
  );
}
export default ResourcePage;
