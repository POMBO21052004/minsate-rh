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
  AlertCircle,
  Briefcase,
  TrendingUp,
  Award,
  User,
  GraduationCap
} from "lucide-react";
import api from "../../services/api";
import EmployeLayout from "../../layouts/Employe/Layout";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Doughnut, Line, Radar } from 'react-chartjs-2';

// Enregistrer les composants ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    congesRestants: 18,
    congesPris: 12,
    congesTotal: 30,
    documentsAttente: 2,
    notifications: 3,
    tauxPresence: 98,
    heuresSup: 4.5,
    formationsCompletees: 3
  });

  // Mock data for charts
  const [chartData, setChartData] = useState({
    attendance: null,
    skills: null,
    leave: null
  });

  useEffect(() => {
    fetchProfile();
    initCharts();
  }, []);

  const fetchProfile = async () => {
    try {
      // In a real scenario, this endpoint would exist
      // const response = await api.get("/employe-profiles/me");
      // For now, we mock the profile response based on user context or static data if backend is missing
      const mockProfile = {
        matricule: "EMP-" + Math.floor(1000 + Math.random() * 9000),
        statut: "Actif",
        poste_details: { titre: "Développeur Senior" },
        service_details: { nom: "Département IT" }
      };
      setProfile(mockProfile);

      // Attempt to fetch real profile if endpoint existed
      try {
        const response = await api.get("/employe-profiles/me");
        if (response.data) setProfile(response.data);
      } catch (e) { /* ignore 404 for now */ }

    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const initCharts = () => {
    // 1. Leave Distribution (Doughnut)
    const leaveData = {
      labels: ['Pris', 'Restants'],
      datasets: [{
        data: [12, 18],
        backgroundColor: ['rgba(209, 213, 219, 0.5)', '#179150'],
        borderColor: ['rgba(209, 213, 219, 1)', '#179150'],
        borderWidth: 1,
      }],
    };

    // 2. Weekly Attendance (Line)
    const attendanceData = {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
      datasets: [{
        label: 'Heures travaillées',
        data: [8.5, 8, 9, 8.5, 7.5],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }],
    };

    // 3. Skills/Performance (Radar)
    const skillsData = {
      labels: ['Technique', 'Communication', 'Gestion', 'Ponctualité', 'Initiative'],
      datasets: [{
        label: 'Niveau Actuel',
        data: [90, 75, 60, 95, 80],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8B5CF6',
        pointBackgroundColor: '#8B5CF6',
      }],
    };

    setChartData({
      leave: leaveData,
      attendance: attendanceData,
      skills: skillsData
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  if (loading) {
    return (
      <EmployeLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#179150]"></div>
            <p className="text-gray-500 font-medium">Chargement de votre espace...</p>
          </div>
        </div>
      </EmployeLayout>
    );
  }

  return (
    <EmployeLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-1">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 dark:bg-green-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#179150] to-[#0f6035] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.first_name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getGreeting()}, {user?.first_name} !
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <Briefcase size={16} />
                  {profile?.poste_details?.titre || "Employé"}
                  <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                  {profile?.service_details?.nom || "Service Général"}
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className="w-4 h-4 text-[#179150]" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de Présence</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.tauxPresence}%</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.tauxPresence}%` }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Heures Sup. (Mois)</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.heuresSup} h</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-4 flex items-center gap-1">
              <TrendingUp size={12} /> +1.5h vs mois dernier
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Formations</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.formationsCompletees}</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <GraduationCap size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Modules complétés cette année</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">À Signer</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.documentsAttente}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <FileText size={20} />
              </div>
            </div>
            <p className="text-xs text-red-500 mt-4 font-medium">Action requise</p>
          </motion.div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (Charts) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Congés Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#179150]" />
                  Solde de Congés
                </h3>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="h-48 w-48 relative">
                  {chartData.leave && <Doughnut data={chartData.leave} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.congesRestants}</span>
                    <span className="text-xs text-gray-500 uppercase">Jours Restants</span>
                  </div>
                </div>
                <div className="space-y-4 w-full md:w-auto">
                  <div className="flex items-center justify-between md:justify-start gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#179150]"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Restants</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{stats.congesRestants} j</span>
                  </div>
                  <div className="flex items-center justify-between md:justify-start gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Consommés</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{stats.congesPris} j</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Attendance Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Activité Hebdomadaire
              </h3>
              <div className="h-64">
                {chartData.attendance && <Line data={chartData.attendance} options={{ responsive: true, maintainAspectRatio: false }} />}
              </div>
            </motion.div>

          </div>

          {/* Right Column (Quick Actions & Skills) */}
          <div className="space-y-8">

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-[#179150]/10 hover:border-[#179150] transition-all group">
                  <Calendar className="w-6 h-6 text-[#179150] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Congés</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-blue-50 hover:border-blue-500 transition-all group">
                  <Clock className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Pointage</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-orange-50 hover:border-orange-500 transition-all group">
                  <FileText className="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Documents</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-purple-50 hover:border-purple-500 transition-all group">
                  <User className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Profil</span>
                </button>
              </div>
            </motion.div>

            {/* Skills Radar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Mes Compétences
              </h3>
              <div className="h-64 flex justify-center">
                {chartData.skills && <Radar data={chartData.skills} options={{
                  responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                  scales: { r: { ticks: { display: false }, grid: { circular: true } } }
                }} />}
              </div>
            </motion.div>

            {/* Recent Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-500" />
                  Notifications
                </h3>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">{stats.notifications}</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Congé approuvé</p>
                    <p className="text-xs text-gray-500">Votre demande pour le 12/03 a été validée.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Rappel formation</p>
                    <p className="text-xs text-gray-500">Module "Sécurité" à terminer avant vendredi.</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </EmployeLayout>
  );
};

export default EmployeeDashboard;