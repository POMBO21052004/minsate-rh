import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "@/layouts/SuperAdmin/Layout";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Building2,
  FileText,
  User,
  Calendar,
  Clock,
  Mail,
  Settings,
  Key,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "@/services/api";
import { cn } from "@/lib/utils";

export default function DepartementShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departement, setDepartement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchDepartement();
  }, [id]);

  const fetchDepartement = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/departements/${id}/`);
      setDepartement(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement du département:", error);
      showToastMessage("Erreur lors du chargement du département", error);
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/departements/${id}/`);
      showToastMessage("Département supprimé avec succès", "success");
      setTimeout(() => {
        navigate("/superadmin/departements");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de la suppression";
      showToastMessage(errorMsg, error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseigné";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "D";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Chargement du département...
            </p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!departement) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Département non trouvé
          </h3>
          <Link
            to="/superadmin/departements"
            className="text-[#179150] hover:text-[#147a43]"
          >
            Retour à la liste
          </Link>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link
                to="/superadmin/departements"
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Détails du Département
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Informations complètes du département
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/superadmin/departements/${id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-[#179150] hover:bg-[#147a43] text-white font-medium rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte principale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="p-6">
                {/* En-tête avec avatar */}
                <div className="flex flex-col md:flex-row md:items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="md:w-1/4 text-center mb-4 md:mb-0">
                    <div className="relative inline-block">
                      <div
                        className="rounded-lg border-4 border-[#179150] flex items-center justify-center"
                        style={{
                          width: "120px",
                          height: "120px",
                          background:
                            "linear-gradient(135deg, #179150 0%, #147a43 100%)",
                          color: "white",
                          fontSize: "3rem",
                          fontWeight: "700",
                        }}
                      >
                        {getInitials(departement.nom)}
                      </div>
                      <span className="absolute -bottom-2 -right-2 bg-[#179150] text-white p-2 border-2 border-white dark:border-gray-800 rounded-lg">
                        <Building2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="md:w-3/4 md:pl-8">
                    <h4 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {departement.nom}
                    </h4>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-3 py-1 bg-[#179150] text-white text-sm font-medium rounded">
                        Département
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#179150]" />
                    Informations générales
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Nom :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {departement.nom}
                        </span>
                      </div>
                      <div className="flex justify-between items-start py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Description :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">
                          {departement.description || "Aucune description"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Créé le :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(departement.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Modifié le :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(departement.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chef de département */}
            {departement.chef_info && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="p-6">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#179150]" />
                    Chef de Département
                  </h5>

                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#179150] to-[#147a43] flex items-center justify-center text-white font-bold text-lg mr-4 rounded-lg">
                      {departement.chef_info.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white">
                        {departement.chef_info.name}
                      </h6>
                      {departement.chef_info.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {departement.chef_info.email}
                        </p>
                      )}
                      {departement.chef_info.poste && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {departement.chef_info.poste}
                        </p>
                      )}
                      {departement.chef_info.matricule && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                          Matricule: {departement.chef_info.matricule}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Actions rapides
                </h4>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  to={`/superadmin/departements/${id}/edit`}
                  className="flex items-center px-4 py-2 text-sm font-medium text-[#179150] bg-[#179150]/10 border border-[#179150]/20 rounded-lg hover:bg-[#179150]/20 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le département
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer le département
                </button>
                <Link
                  to="/superadmin/departements"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la liste
                </Link>
              </div>
            </motion.div>

            {/* Informations système */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-[#179150]" />
                  Informations système
                </h4>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-start">
                  <Key className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      ID Département
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono">
                      {departement.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Date de création
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {formatDate(departement.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Dernière modification
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {formatDate(departement.updated_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Chef assigné
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {departement.chef_info ? "Oui" : "Non"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={cn(
              "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3",
              {
                "bg-green-500 text-white": toastType === "success",
                "bg-red-500 text-white": toastType === "error",
              }
            )}
          >
            {toastType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de suppression */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirmer la suppression
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer le département{" "}
                <strong>{departement.nom}</strong> ? Cette action est
                irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SuperAdminLayout>
  );
}
