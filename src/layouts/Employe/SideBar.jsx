// SideBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    Clock,
    Settings,
    LogOut,
    Building,
    Circle
} from "lucide-react";

export default function EmployeSidebar({ user, collapsed, onClose }) {
    const location = useLocation();

    const menuSections = [
        {
            title: "Mon Espace",
            items: [
                { label: "Tableau de bord", icon: LayoutDashboard, path: "/employe/dashboard" },
            ]
        },
        {
            title: "Mes Congés",
            items: [
                { label: "Mes demandes", icon: Calendar, path: "/employe/conges" },
                { label: "Solde & Historique", icon: Clock, path: "/employe/conges/historique" },
            ]
        },
        {
            title: "Documents & Infos",
            items: [
                { label: "Mon Profil", icon: User, path: "/employe/profile" },
                { label: "Mes Documents", icon: FileText, path: "/employe/documents" },
            ]
        },
    ];

    const isActiveLink = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`
      fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
      shadow-xl z-50 transition-transform duration-300 ease-in-out
      ${collapsed ? '-translate-x-full' : 'translate-x-0'}
      w-64
    `}>
            {/* Header avec logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                        <Building className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            MINSANTE RH
                        </h1>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">
                            Espace Employé
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 h-[calc(100vh-200px)]">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6">
                        <h3 className="px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            {section.title}
                        </h3>

                        <ul className="space-y-1">
                            {section.items.map((item, itemIndex) => {
                                const IconComponent = item.icon;
                                return (
                                    <li key={itemIndex}>
                                        <Link
                                            to={item.path}
                                            onClick={onClose}
                                            className={`
                        flex items-center mx-3 px-3 py-3 rounded-xl transition-all duration-200 group
                        ${isActiveLink(item.path)
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                                                }
                      `}
                                        >
                                            <IconComponent className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 mr-3" />
                                            <span className="font-medium text-sm truncate flex-1">
                                                {item.label}
                                            </span>

                                            {isActiveLink(item.path) && (
                                                <Circle className="w-2 h-2 fill-blue-500 text-blue-500 ml-2" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.first_name || 'Employé'}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                            Connecté
                        </p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="En ligne"></div>
                </div>
            </div>
        </aside>
    );
}
