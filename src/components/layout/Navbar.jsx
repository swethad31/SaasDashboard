import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { FiMenu, FiBell, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import "./Navbar.css";

const routeNames = {
  "/": "Dashboard", "/analytics": "Analytics", "/users": "Users",
  "/reports": "Reports", "/revenue": "Revenue", "/content": "Movies / Content",
  "/performance": "Performance", "/settings": "Settings", "/profile": "Profile",
};

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const pageName = routeNames[location.pathname] || "Dashboard";

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuClick}><FiMenu /></button>
        <div className="navbar__breadcrumb">
          Nexus <span>›</span> <strong>{pageName}</strong>
        </div>
      </div>

      <div className="navbar__right">
        <button className="navbar__icon-btn"><FiSearch /></button>
        <button className="navbar__icon-btn">
          <FiBell />
          <span className="navbar__badge" />
        </button>
        <button className="navbar__theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
        <div className="navbar__avatar">A</div>
      </div>
    </header>
  );
}
