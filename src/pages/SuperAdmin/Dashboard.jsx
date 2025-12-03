import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AppLayoutSuperAdmin from "../../layouts/SuperAdmin/Layout";
import { 
  LogOut, 
  Shield,
  Users, 
  BarChart3, 
  Settings,
  UserCog,
  Database,
  Activity,
  Globe
} from "lucide-react";
import api from "../../services/api";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/management/admin-dashboard-data");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppLayoutSuperAdmin>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Portail RH - Espace Super Administrateur
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Super Administrateur
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Super Administrateur
                  </p>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "dashboard", name: "Tableau de bord", icon: BarChart3 },
                    { id: "users", name: "Gestion Utilisateurs", icon: Users },
                    { id: "system", name: "Système", icon: Database },
                    { id: "monitoring", name: "Monitoring", icon: Activity },
                    { id: "settings", name: "Paramètres Système", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Tableau de Bord Super Administrateur
                </h3>

                {/* Statistiques système */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          Total Utilisateurs
                        </p>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                          {stats?.users?.total || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Super Admins
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                          {stats?.users?.superadmins || 0}
                        </p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          Administrateurs
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                          {stats?.users?.admins || 0}
                        </p>
                      </div>
                      <UserCog className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                          Employés
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                          {stats?.users?.employes || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Informations système */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Informations Système
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Mon Profil
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Rôle</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Super Administrateur
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Membre depuis</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Non spécifiée"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Statut Système
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Base de données</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            En ligne
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Opérationnel
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Dernière sauvegarde</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Aujourd'hui
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions système */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Administration Système
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Gérer Admins
                      </span>
                    </button>
                    <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <Database className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Sauvegardes
                      </span>
                    </button>
                    <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Logs Système
                      </span>
                    </button>
                    <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Configuration
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppLayoutSuperAdmin>
  );
};

export default SuperAdminDashboard;