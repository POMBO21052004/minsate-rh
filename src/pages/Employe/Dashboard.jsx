import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Calendar,
  FileText,
  Bell,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import api from "../../services/api";
import EmployeLayout from "../../contexts/Layout";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Enregistrer les composants ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    congesRestants: 18,
    congesPris: 12,
    congesTotal: 30,
    documentsAttente: 2,
    notifications: 3
  });

  useEffect(() => {
    fetchProfile();
    // Simuler le chargement des stats (à remplacer par un vrai appel API)
    // fetchStats(); 
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/employe-profiles/me");
      setProfile(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // Données du graphique
  const chartData = {
    labels: ['Pris', 'Restants'],
    datasets: [
      {
        data: [stats.congesPris, stats.congesRestants],
        backgroundColor: [
          'rgba(209, 213, 219, 0.5)', // Gris pour pris
          'rgba(59, 130, 246, 0.8)', // Bleu pour restants
        ],
        borderColor: [
          'rgba(209, 213, 219, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <EmployeLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de votre espace...</p>
          </div>
        </div>
      </EmployeLayout>
    );
  }

  return (
    <EmployeLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.first_name} !
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Voici un aperçu de votre activité aujourd'hui.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Stats Cards & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Carte Solde Congés avec Graphique */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Solde de Congés</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.congesRestants} <span className="text-sm font-normal text-gray-500">jours</span></p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="h-32 w-full flex items-center justify-between">
                  <div className="w-1/2 h-full relative">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round((stats.congesPris / stats.congesTotal) * 100)}%</span>
                    </div>
                  </div>
                  <div className="w-1/2 pl-4 space-y-2">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>Restants: {stats.congesRestants}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                      <span>Pris: {stats.congesPris}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Autres Stats */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Documents à signer</p>
                      <p className="text-2xl font-bold mt-1">{stats.documentsAttente}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Notifications</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.notifications}</p>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Activité Récente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">Activité Récente</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">Voir tout</button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { type: 'Congé', status: 'Approuvé', date: 'Il y a 2 jours', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { type: 'Document', status: 'En attente', date: 'Hier', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { type: 'Congé', status: 'Rejeté', date: 'Semaine dernière', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${item.bg}`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.type}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'Approuvé' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          item.status === 'En attente' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Right - Profile & Quick Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.first_name} {user?.last_name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.poste_details?.titre || "Employé"}</p>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Matricule</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{profile?.matricule || "N/A"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Statut</p>
                    <p className="font-semibold text-green-600 dark:text-green-400 capitalize">{profile?.statut || "Actif"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group">
                  <Calendar className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Demander Congé</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group">
                  <Clock className="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Pointage</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group">
                  <FileText className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Documents</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group">
                  <MessageCircle className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Assistant</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </EmployeLayout>
  );
};

export default EmployeeDashboard;