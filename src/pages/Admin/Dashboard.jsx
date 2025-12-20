import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Bell,
  CheckCircle,
  Clock,
  Briefcase
} from "lucide-react";
import api from "../../services/api";
import AdminLayout from "../../layouts/Admin/Layout";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Enregistrer les composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/management/admin-dashboard-data");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // Données simulées pour les graphiques (à remplacer par des données API si disponibles)
  const employeeData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Recrutements',
        data: [4, 2, 5, 3, 6, 4],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green
      },
      {
        label: 'Départs',
        data: [1, 0, 1, 0, 2, 1],
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red
      },
    ],
  };

  const leaveData = {
    labels: ['Congés Payés', 'Maladie', 'Sans Solde', 'Autre'],
    datasets: [
      {
        data: [12, 5, 3, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(245, 158, 11, 0.7)', // Orange
          'rgba(239, 68, 68, 0.7)', // Red
          'rgba(156, 163, 175, 0.7)', // Gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du tableau de bord...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue d'ensemble des activités RH et statistiques.
          </p>
        </motion.div>

        {/* Statistiques Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employés</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.employes?.total || 0}</h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+2 ce mois</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Employés Actifs</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.employes?.actifs || 0}</h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              98% de l'effectif total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-orange-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Congés en attente</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</h3>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600 cursor-pointer hover:underline">
              <span>Voir les demandes</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-purple-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postes Ouverts</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.postes || 0}</h3>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Dans 3 départements
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mouvements du personnel</h3>
            <div className="h-64">
              <Bar data={employeeData} options={barOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition des Absences</h3>
            <div className="h-64 flex justify-center">
              <div className="w-2/3">
                <Doughnut data={leaveData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions Rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Gestion Rapide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Ajouter Employé", color: "blue" },
              { icon: Calendar, label: "Valider Congés", color: "orange" },
              { icon: FileText, label: "Générer Rapport", color: "green" },
              { icon: Bell, label: "Envoyer Notification", color: "purple" },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button key={idx} className={`flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group`}>
                  <div className={`p-3 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/20 text-${action.color}-600 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="ml-4 font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;