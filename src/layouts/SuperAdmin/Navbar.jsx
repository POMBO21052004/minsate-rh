// SuperAdminNavbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  Shield,
  LogOut,
  Bell,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export default function SuperAdminNavbar({
  toggleSidebar,
  sidebarVisible,
  isMobile,
  toggleTheme,
  theme,
}) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "SA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateName = (name, maxLength = 15) => {
    if (!name) return "";
    return name.length > maxLength
      ? name.slice(0, maxLength - 3) + "..."
      : name;
  };

  const handleToggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggle button clicked, isMobile:", isMobile);
    if (typeof toggleSidebar === "function") {
      toggleSidebar();
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-40 transition-all duration-300",
        sidebarVisible && !isMobile ? "lg:left-64 lg:right-0" : "left-0 right-0"
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Partie gauche - Bouton toggle et titre */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 lg:hidden"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {sidebarVisible ? "Tableau de bord" : "MINSANTE RH"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Super Administration
              </p>
            </div>
          </div>
        </div>

        {/* Partie droite - Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Indicateur de rôle Super Admin */}
          <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full border border-green-200 dark:border-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Super Admin
          </span>

          {/* Bouton changement de thème */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            title={`Passer au thème ${theme === "dark" ? "clair" : "sombre"}`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          {/* Notifications */}
          <div className="relative">
            <NotificationDropdown />
          </div>

          {/* Dropdown utilisateur Super Admin */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-semibold border border-white border-opacity-30">
                {user?.profil_url ? (
                  <img
                    src={user.profil_url}
                    alt={user.name || "Super Admin"}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}
                {!user?.profil_url && getInitials(user?.first_name)}
              </div>
              <span className="hidden sm:block text-sm font-medium max-w-32 truncate">
                {truncateName(user?.first_name || "Super Admin")}
              </span>
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* Menu dropdown Super Admin */}
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
              {/* En-tête du dropdown */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user?.first_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {user?.first_name || "Super Admin"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {user?.email || "superadmin@minsante.com"}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                        Super Administrateur
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items du menu Super Admin */}
              <div className="p-2 space-y-1">
                <Link
                  to="/superadmin/profile"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>Mon Profil</span>
                </Link>

                <Link
                  to="/superadmin/audit"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Shield className="w-4 h-4" />
                  <span>Journal d'audit</span>
                </Link>

                <Link
                  to="/superadmin/system"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configuration Système</span>
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
