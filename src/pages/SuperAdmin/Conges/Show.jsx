import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "@/layouts/SuperAdmin/Layout";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  Settings,
  Activity,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle as XCircleIcon,
  Clock as ClockIcon,
  Building2,
  Briefcase,
  Info,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "@/services/api";
import { STATUTS, TYPES } from "@/constants";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

export default function CongeShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [raison, setRaison] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToastMessage = React.useCallback((message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  }, []);

  const fetchDemande = React.useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/users/leaves/${id}/`);
      setDemande(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      showToastMessage("Erreur lors du chargement de la demande", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToastMessage]);

  useEffect(() => {
    fetchDemande();
  }, [fetchDemande]);

  const handleApprove = async () => {
    if (!demande) return;

    try {
      setProcessing(true);
      await api.put(`/users/leaves/${id}/`, {
        statut: "approuve",
        description: demande.description,
        raison: raison,
      });
      showToastMessage("Demande approuvée avec succès", "success");
      fetchDemande();
      setShowApproveModal(false);
      setRaison("");
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de l'approbation";
      showToastMessage(errorMsg, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!demande) return;

    if (!raison.trim()) {
      showToastMessage("Veuillez indiquer une raison pour le rejet", "error");
      return;
    }

    try {
      setProcessing(true);
      await api.put(`/users/leaves/${id}/`, {
        statut: "rejete",
        description: demande.description,
        raison: raison,
      });
      showToastMessage("Demande rejetée avec succès", "success");
      fetchDemande();
      setShowRejectModal(false);
      setRaison("");
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors du rejet";
      showToastMessage(errorMsg, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setProcessing(true);
      await api.delete(`/users/leaves/${id}/`);
      showToastMessage("Demande supprimée avec succès", "success");
      setTimeout(() => {
        navigate("/superadmin/conges");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de la suppression";
      showToastMessage(errorMsg, "error");
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
    }
  };

  const calculateDays = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatutBadge = (statut) => {
    return STATUTS.find((s) => s.value === statut) || STATUTS[0];
  };

  const getTypeBadge = (type) => {
    return TYPES.find((t) => t.value === type) || TYPES[0];
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Chargement de la demande...
            </p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!demande) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Demande non trouvée
          </h3>
          <Link
            to="/superadmin/conges"
            className="text-[#179150] hover:text-[#147a43]"
          >
            Retour à la liste
          </Link>
        </div>
      </SuperAdminLayout>
    );
  }

  const statutBadge = getStatutBadge(demande.statut);
  const typeBadge = getTypeBadge(demande.type_conge);
  const StatutIcon = statutBadge.icon;
  const TypeIcon = typeBadge.icon;
  const jours = calculateDays(demande.date_debut, demande.date_fin);

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
                to="/superadmin/conges"
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Détails de la Demande de Congé
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Informations complètes de la demande
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {demande.statut === "en_attente" && (
                <>
                  <button
                    onClick={() => {
                      setRaison("");
                      setShowApproveModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approuver
                  </button>
                  <button
                    onClick={() => {
                      setRaison("");
                      setShowRejectModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    Rejeter
                  </button>
                </>
              )}
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
                {/* En-tête avec statut */}
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
                        <TypeIcon className="w-16 h-16" />
                      </div>
                      <span
                        className={cn(
                          "absolute -bottom-2 -right-2 text-white p-2 border-2 border-white dark:border-gray-800 rounded-lg",
                          statutBadge.value === "en_attente"
                            ? "bg-yellow-500"
                            : statutBadge.value === "approuve"
                            ? "bg-green-500"
                            : "bg-red-500"
                        )}
                      >
                        <StatutIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="md:w-3/4 md:pl-8">
                    <h4 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {typeBadge.label}
                    </h4>
                    <div className="flex flex-wrap gap-2 items-center mb-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded text-sm font-medium",
                          statutBadge.value === "en_attente"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            : statutBadge.value === "approuve"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        )}
                      >
                        <StatutIcon className="w-4 h-4 mr-1.5" />
                        {statutBadge.label}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm font-medium rounded">
                        {jours} jour(s)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(demande.date_debut)} →{" "}
                        {formatDate(demande.date_fin)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Informations de l'employé */}
            {demande.employe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="p-6">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#179150]" />
                    Informations de l'employé
                  </h5>

                  {typeof demande.employe === "object" ? (
                    <>
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                          {getInitials(
                            demande.employe?.user?.first_name,
                            demande.employe?.user?.last_name
                          )}
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 dark:text-white">
                            {demande.employe?.user?.first_name}{" "}
                            {demande.employe?.user?.last_name}
                          </h6>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Matricule: {demande.employe?.matricule}
                          </div>
                          {demande.employe?.user?.email && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {demande.employe.user.email}
                            </div>
                          )}
                        </div>
                      </div>

                      {demande.employe?.poste_details && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {demande.employe.poste_details
                            .departement_details && (
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Building2 className="w-4 h-4 text-[#179150] mr-2" />
                              <div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Département
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {
                                    demande.employe.poste_details
                                      .departement_details.nom
                                  }
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Briefcase className="w-4 h-4 text-[#179150] mr-2" />
                            <div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Poste
                              </div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {demande.employe.poste_details.titre}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        ID Employé: {demande.employe}
                      </p>
                      <Link
                        to={`/superadmin/employes/${demande.employe}`}
                        className="text-[#179150] hover:text-[#147a43] text-sm mt-2 inline-block"
                      >
                        Voir les détails de l'employé
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Détails de la demande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-[#179150]" />
                  Détails de la demande
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        Type de congé :
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {typeBadge.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date de début :
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(demande.date_debut)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date de fin :
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(demande.date_fin)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Durée :
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {jours} jour(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Statut :
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 text-xs font-medium rounded",
                          statutBadge.value === "en_attente"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            : statutBadge.value === "approuve"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        )}
                      >
                        <StatutIcon className="w-3 h-3 mr-1" />
                        {statutBadge.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Date de demande :
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDateTime(demande.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {demande.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Description
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {demande.description}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Actions rapides
                </h4>
              </div>
              <div className="p-4 space-y-2">
                {demande.statut === "en_attente" && (
                  <>
                    <button
                      onClick={() => {
                        setRaison("");
                        setShowApproveModal(true);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approuver la demande
                    </button>
                    <button
                      onClick={() => {
                        setRaison("");
                        setShowRejectModal(true);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <XCircleIcon className="w-4 h-4 mr-2" />
                      Rejeter la demande
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer la demande
                </button>
                <Link
                  to="/superadmin/conges"
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
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-[#179150]" />
                  Informations système
                </h4>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">ID</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {demande.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Créé le
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDateTime(demande.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Modifié le
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDateTime(demande.updated_at)}
                  </span>
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
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
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

      {/* Modal d'approbation */}
      <AnimatePresence>
        {showApproveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Approuver la demande
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Êtes-vous sûr de vouloir approuver la demande de congé de{" "}
                <strong>
                  {typeof demande?.employe === "object"
                    ? `${demande.employe?.user?.first_name || ""} ${
                        demande.employe?.user?.last_name || ""
                      }`.trim() || "cet employé"
                    : "cet employé"}
                </strong>{" "}
                ?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison (optionnelle)
                </label>
                <textarea
                  value={raison}
                  onChange={(e) => setRaison(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-[#179150] focus:ring-[#179150] transition-colors"
                  placeholder="Raison de l'approbation..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {processing ? "Traitement..." : "Approuver"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de rejet */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRejectModal(false)}
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
                  <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Rejeter la demande
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Êtes-vous sûr de vouloir rejeter la demande de congé de{" "}
                <strong>
                  {typeof demande?.employe === "object"
                    ? `${demande.employe?.user?.first_name || ""} ${
                        demande.employe?.user?.last_name || ""
                      }`.trim() || "cet employé"
                    : "cet employé"}
                </strong>{" "}
                ?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison du rejet *
                </label>
                <textarea
                  value={raison}
                  onChange={(e) => setRaison(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-[#179150] focus:ring-[#179150] transition-colors"
                  placeholder="Indiquez la raison du rejet..."
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  La raison est obligatoire pour le rejet
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {processing ? "Traitement..." : "Rejeter"}
                </button>
              </div>
            </motion.div>
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
                Êtes-vous sûr de vouloir supprimer cette demande de congé ?
                Cette action est irréversible.
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
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {processing ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SuperAdminLayout>
  );
}
