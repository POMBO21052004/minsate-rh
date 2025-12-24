// Layout.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./SideBar";
import AdminNavbar from "./Navbar";
import { useAuth } from "@/hooks";
import { useThemeStore } from "@/store/theme";
import { cn } from "@/lib/utils";

export default function AppLayoutAdmin({ children }) {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { user } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Gère le thème
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || theme;
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    setTheme(savedTheme);
  }, [theme, setTheme]);

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
        location={location}
      />

      {/* Overlay pour mobile */}
      {isMobile && sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Contenu principal */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarVisible ? "lg:ml-64" : "lg:ml-0",
          "pt-16"
        )}
      >
        <main className="p-4 lg:p-6">
          <div className="container-fluid">
            <div className="py-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
