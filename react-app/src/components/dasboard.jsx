import { useState } from "react";
import { SideBar } from "./navigations/sidebar.jsx";
import { TopBar } from "./navigations/topbar.jsx";
import "../components.css.styles/dashboard.css";

export function Dashboard({ children }) {
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  return (
    <div>
      <TopBar />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideBar
          collapsed={collapsedSidebar}
          setCollapsed={setCollapsedSidebar}
        />
        <main
          className={`main ${collapsedSidebar ? "collapsedSidebar" : "notCollapsed"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
