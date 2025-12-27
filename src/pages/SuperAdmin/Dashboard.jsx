import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Building2,
  Briefcase,
  UserCheck,
  Calendar,
  Settings,
  User,
  Clock,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/hooks";
import api from "@/services/api";
import { cn, getColorClasses } from "@/lib/utils";

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    superAdmins: 0,
    admins: 0,
    departements: 0,
    postes: 0,
    employes: 0,
    demandesEnAttente: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Récupérer les statistiques depuis les différentes APIs
      const [
        superAdminsRes,
        adminsRes,
        departementsRes,
        postesRes,
        employesRes,
        demandesRes,
      ] = await Promise.allSettled([
        api.get("/users/superadmins/"),
        api.get("/users/admins/"),
        api.get("/users/departements/"),
        api.get("/users/postes/"),
        api.get("/users/employes/"),
        api.get("/users/demandes/?statut=en_attente"),
      ]);

      setStats({
        superAdmins:
          superAdminsRes.status === "fulfilled"
            ? superAdminsRes.value.data?.length || 0
            : 0,
        admins:
          adminsRes.status === "fulfilled"
            ? adminsRes.value.data?.length || 0
            : 0,
        departements:
          departementsRes.status === "fulfilled"
            ? departementsRes.value.data?.length || 0
            : 0,
        postes:
          postesRes.status === "fulfilled"
            ? postesRes.value.data?.length || 0
            : 0,
        employes:
          employesRes.status === "fulfilled"
            ? employesRes.value.data?.length || 0
            : 0,
        demandesEnAttente:
          demandesRes.status === "fulfilled"
            ? demandesRes.value.data?.length || 0
            : 0,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Chargement du tableau de bord...
            </p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tableau de Bord Super Administrateur
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Bienvenue, {user?.first_name} {user?.last_name}
              </p>
            </div>
            <Link
              to="/superadmin/profile"
              className="inline-flex items-center px-4 py-2 bg-[#179150] hover:bg-[#147a43] text-white font-medium rounded-lg transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Mon Profil
            </Link>
          </div>
        </motion.div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Super Admins
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.superAdmins}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admins
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.admins}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Départements
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.departements}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Postes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.postes}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employés
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.employes}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Congés en attente
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.demandesEnAttente}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fonctionnalités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Fonctionnalités Disponibles
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Accédez aux différentes sections de gestion
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fonctionnalites.map((fonctionnalite, index) => {
                const Icon = fonctionnalite.icon;
                const isAvailable = fonctionnalite.available;

                const CardContent = (
                  <div
                    className={cn(
                      "relative border-2 rounded-lg p-6 transition-all duration-200",
                      isAvailable
                        ? "border-gray-200 dark:border-gray-700 hover:border-[#179150] hover:shadow-md cursor-pointer"
                        : "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
                    )}
                  >
                    {!isAvailable && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded">
                          En développement
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "w-12 h-12",
                        getColorClasses(fonctionnalite.color)
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {fonctionnalite.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fonctionnalite.description}
                    </p>
                    {isAvailable && (
                      <div className="mt-4 flex items-center text-[#179150] text-sm font-medium">
                        Accéder
                        <span className="ml-2">→</span>
                      </div>
                    )}
                  </div>
                );

                return (
                  <motion.div
                    key={fonctionnalite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                  >
                    {isAvailable ? (
                      <Link to={fonctionnalite.link}>{CardContent}</Link>
                    ) : (
                      CardContent
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Avertissement de développement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Wrench className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                Fonctionnalités en développement
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Certaines fonctionnalités du tableau de bord sont actuellement
                en cours de développement. Les sections marquées "En
                développement" seront disponibles dans une prochaine mise à
                jour.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
