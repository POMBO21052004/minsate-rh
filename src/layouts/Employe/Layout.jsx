// Layout.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import EmployeSidebar from "./SideBar";
import EmployeNavbar from "./Navbar";

export default function EmployeLayout({ children }) {
    const location = useLocation();
    const { user } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex">
            {/* Sidebar Employé */}
            <EmployeSidebar
                user={user}
                collapsed={!sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />

            {/* Section principale avec Navbar et contenu */}
            <div className={`
        flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
        ${sidebarVisible && !isMobile ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
                {/* Navbar Employé */}
                <EmployeNavbar
                    toggleSidebar={toggleSidebar}
                    sidebarVisible={sidebarVisible}
                    isMobile={isMobile}
                />

                {/* Overlay pour mobile */}
                {isMobile && sidebarVisible && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarVisible(false)}
                    />
                )}

                {/* Contenu principal */}
                <main className="flex-1 p-4 lg:p-6 mt-16 overflow-auto">
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
