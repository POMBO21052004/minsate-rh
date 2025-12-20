// Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    Building,
    Menu,
    Moon,
    Sun,
    ChevronDown,
    User,
    Settings,
    LogOut
} from "lucide-react";

export default function EmployeNavbar({ toggleSidebar, sidebarVisible, isMobile }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const currentTheme = document.documentElement.className;
        setTheme(currentTheme === "dark" ? "dark" : "light");

        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.className;
            setTheme(newTheme === "dark" ? "dark" : "light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        const newTheme = html.className === "dark" ? "light" : "dark";
        html.className = newTheme;
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className={`
      fixed top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30 transition-all duration-300
      ${sidebarVisible && !isMobile ? 'left-64' : 'left-0'}
    `}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Toggle Sidebar Button */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full border border-blue-200 dark:border-blue-700">
                        Employé
                    </span>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="relative group">
                        <button className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'E'}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.first_name || "Employé"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white">{user?.first_name} {user?.last_name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <Link to="/employe/profile" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <User className="w-4 h-4 mr-3" />
                                    Mon Profil
                                </Link>
                                <Link to="/employe/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Settings className="w-4 h-4 mr-3" />
                                    Paramètres
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
