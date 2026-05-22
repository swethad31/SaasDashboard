import { useState } from "react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={`main-layout__body${sidebarCollapsed ? " collapsed" : ""}`}>
        <Navbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
        <main className="main-content" onClick={() => mobileSidebarOpen && setMobileSidebarOpen(false)}>
          {children}
        </main>
      </div>
    </div>
  );
}
