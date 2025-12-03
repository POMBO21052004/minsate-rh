// Layout.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "./SideBar";
import AdminNavbar from "./Navbar";

export default function AppLayoutAdmin({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [theme, setTheme] = useState("light");

  // Gère le thème
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.className = savedTheme;
    setTheme(savedTheme);
  }, []);

  // Détection responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fermer la sidebar en mobile lors du changement de route
  useEffect(() => {
    if (isMobile && sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [location.pathname, isMobile, sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar fixe en haut */}
      <AdminNavbar toggleSidebar={toggleSidebar} />
      
      {/* Sidebar */}
      <AdminSidebar 
        user={user} 
        collapsed={!sidebarVisible} 
        onClose={() => setSidebarVisible(false)}
      />
      
      {/* Overlay pour mobile */}
      {isMobile && sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      
      {/* Contenu principal */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarVisible ? 'lg:ml-64' : 'lg:ml-0'}
        pt-16
      `}>
        <main className="p-4 lg:p-6">
          <div className="container-fluid">
            <div className="py-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}