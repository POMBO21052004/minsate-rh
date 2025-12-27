// Layout.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { useThemeStore } from "@/store/theme";
import { cn } from "@/lib/utils";
import SuperAdminSidebar from "./SideBar";
import SuperAdminNavbar from "./Navbar";

export default function AppLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || theme;
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    setTheme(savedTheme);
  }, [theme, setTheme]);

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
    console.log("Toggle sidebar clicked, current state:", sidebarVisible);
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex">
      {/* Sidebar Super Admin */}
      <SuperAdminSidebar
        user={user}
        collapsed={!sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        location={location}
      />

      {/* Section principale avec Navbar et contenu */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarVisible && !isMobile ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        {/* Navbar Super Admin */}
        <SuperAdminNavbar
          toggleSidebar={toggleSidebar}
          sidebarVisible={sidebarVisible}
          isMobile={isMobile}
          toggleTheme={toggleTheme}
          theme={theme}
        />

        {/* Overlay pour mobile - SEULEMENT quand la sidebar est visible sur mobile */}
        {isMobile && sidebarVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => {
              console.log("Overlay clicked, closing sidebar");
              setSidebarVisible(false);
            }}
          />
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-4 lg:p-6 mt-16 overflow-auto">
          <div className="container-fluid">
            <div className="py-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
