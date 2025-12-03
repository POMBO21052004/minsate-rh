// SideBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ user, collapsed, onClose }) {
  const location = useLocation();

  // Menu adapté pour le portail RH
  const menuSections = [
    {
      title: "Tableau de bord",
      items: [
        { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
      ]
    },
    {
      title: "Gestion du personnel",     
      items: [
        { label: "Employés", icon: "👥", path: "/admin/employees" },
        { label: "Contrats", icon: "📝", path: "/admin/contracts" },
        { label: "Postes", icon: "💼", path: "/admin/positions" },
      ]
    },
    {
      title: "Gestion des congés",     
      items: [
        { label: "Demandes de congés", icon: "🏖️", path: "/admin/leaves" },
        { label: "Solde des congés", icon: "📅", path: "/admin/leave-balance" },
      ]
    },
    {
      title: "Formation & Évaluation",     
      items: [
        { label: "Formations", icon: "🎓", path: "/admin/trainings" },
        { label: "Évaluations", icon: "⭐", path: "/admin/evaluations" },
      ]
    },
    {
      title: "Paie & Documents",     
      items: [
        { label: "Bulletins de paie", icon: "💰", path: "/admin/payroll" },
        { label: "Documents RH", icon: "📁", path: "/admin/documents" },
      ]
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`
      fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
      shadow-xl z-20 transition-all duration-300 ease-in-out
      ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
    `}>
      {/* Header avec logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center space-x-3 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
            DP
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                DigiPlus RH
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Portail Admin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {/* Titre de section (caché en mode collapsed) */}
            {!collapsed && (
              <h3 className="px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center mx-3 px-3 py-3 rounded-xl transition-all duration-200
                      ${isActiveLink(item.path) 
                        ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className={`text-lg flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium text-sm truncate">
                        {item.label}
                      </span>
                    )}
                    
                    {/* Indicateur visuel pour les liens actifs */}
                    {isActiveLink(item.path) && !collapsed && (
                      <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer avec informations utilisateur */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.first_name || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Administrateur
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}