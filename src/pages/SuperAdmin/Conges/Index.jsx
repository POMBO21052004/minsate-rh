import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import {
  Calendar,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  XCircle,
  Clock,
  Filter,
  User,
  Mail,
  CalendarDays,
  FileText,
  CheckCircle2,
  XCircle as XCircleIcon,
  Clock as ClockIcon,
  TrendingUp,
  Users,
  Building2,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function CongeList() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedDemandes, setSelectedDemandes] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [demandeToAction, setDemandeToAction] = useState(null);
  const [raison, setRaison] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    approuvees: 0,
    rejetees: 0
  });

  // Statuts et types depuis le backend
  const STATUTS = [
    { value: 'en_attente', label: 'En attente', icon: ClockIcon, color: 'yellow' },
    { value: 'approuve', label: 'Approuvé', icon: CheckCircle2, color: 'green' },
    { value: 'rejete', label: 'Rejeté', icon: XCircleIcon, color: 'red' }
  ];

  const TYPES = [
    { value: 'annuel', label: 'Congé annuel', icon: CalendarDays },
    { value: 'maladie', label: 'Congé maladie', icon: FileText },
    { value: 'sans_solde', label: 'Congé sans solde', icon: Calendar }
  ];

  useEffect(() => {
    fetchDemandes();
  }, []);

  useEffect(() => {
    calculateStats(demandes);
  }, [demandes]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/demandes/');
      setDemandes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showToastMessage('Erreur lors du chargement des demandes de congé', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const enAttente = data.filter(d => d.statut === 'en_attente').length;
    const approuvees = data.filter(d => d.statut === 'approuve').length;
    const rejetees = data.filter(d => d.statut === 'rejete').length;

    setStats({ total, enAttente, approuvees, rejetees });
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const filteredDemandes = demandes.filter(demande => {
    // Gérer le cas où employe peut être un ID ou un objet
    const employeData = typeof demande.employe === 'object' ? demande.employe : null;
    const employeId = typeof demande.employe === 'number' ? demande.employe : null;

    const matchesSearch =
      employeData?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeData?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeData?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeData?.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.type_conge?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut = !statutFilter || demande.statut === statutFilter;
    const matchesType = !typeFilter || demande.type_conge === typeFilter;

    return matchesSearch && matchesStatut && matchesType;
  });

  const handleApproveClick = (demande) => {
    setDemandeToAction(demande);
    setRaison("");
    setShowApproveModal(true);
  };

  const handleRejectClick = (demande) => {
    setDemandeToAction(demande);
    setRaison("");
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    if (!demandeToAction) return;

    try {
      await api.patch(`/users/leaves/${demandeToAction.id}/`, {
        statut: 'approuve',
        description: demandeToAction.description,
        raison: raison
      });
      showToastMessage('Demande approuvée avec succès', 'success');
      fetchDemandes();
      setShowApproveModal(false);
      setDemandeToAction(null);
      setRaison("");
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      let errorMsg = 'Erreur lors de l\'approbation';

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          const messages = Object.values(data).flat();
          if (messages.length > 0) {
            errorMsg = messages[0];
          }
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        }
      }

      showToastMessage(errorMsg, 'error');
    }
  };

  const handleReject = async () => {
    if (!demandeToAction) return;

    if (!raison.trim()) {
      showToastMessage('Veuillez indiquer une raison pour le rejet', 'error');
      return;
    }

    try {
      await api.patch(`/users/leaves/${demandeToAction.id}/`, {
        statut: 'rejete',
        description: demandeToAction.description,
        raison: raison
      });
      showToastMessage('Demande rejetée avec succès', 'success');
      fetchDemandes();
      setShowRejectModal(false);
      setDemandeToAction(null);
      setRaison("");
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      let errorMsg = 'Erreur lors du rejet';

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          const messages = Object.values(data).flat();
          if (messages.length > 0) {
            errorMsg = messages[0];
          }
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        }
      }

      showToastMessage(errorMsg, 'error');
    }
  };

  const handleDeleteClick = (demande) => {
    setDemandeToAction(demande);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!demandeToAction) return;

    try {
      await api.delete(`/users/leaves/${demandeToAction.id}/`);
      showToastMessage('Demande supprimée avec succès', 'success');
      fetchDemandes();
      setSelectedDemandes(new Set());
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      let errorMsg = 'Erreur lors de la suppression';

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          const messages = Object.values(data).flat();
          if (messages.length > 0) {
            errorMsg = messages[0];
          }
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        }
      }

      showToastMessage(errorMsg, 'error');
    } finally {
      setShowDeleteModal(false);
      setDemandeToAction(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatutBadge = (statut) => {
    return STATUTS.find(s => s.value === statut) || STATUTS[0];
  };

  const getTypeBadge = (type) => {
    return TYPES.find(t => t.value === type) || TYPES[0];
  };

  const calculateDays = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const exportToCSV = () => {
    const headers = ['Matricule', 'Employé', 'Type', 'Date début', 'Date fin', 'Durée (jours)', 'Statut', 'Date demande'];
    const csvData = filteredDemandes.map(demande => {
      const employeData = typeof demande.employe === 'object' ? demande.employe : null;
      return [
        employeData?.matricule || '',
        `${employeData?.user?.first_name || ''} ${employeData?.user?.last_name || ''}`.trim() || 'N/A',
        getTypeBadge(demande.type_conge).label,
        formatDate(demande.date_debut),
        formatDate(demande.date_fin),
        calculateDays(demande.date_debut, demande.date_fin),
        getStatutBadge(demande.statut).label,
        formatDateTime(demande.created_at)
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demandes_conges_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToastMessage('Export CSV généré avec succès', 'success');
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatutFilter("");
    setTypeFilter("");
    setSelectedDemandes(new Set());
  };

  const hasActiveFilters = searchTerm || statutFilter || typeFilter;

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des demandes de congé...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6 mb-4">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="me-3 p-3 rounded-full bg-[#179150]/10 border border-[#179150]/20">
                <Calendar className="w-6 h-6 text-[#179150]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                  Gestion des Demandes de Congé
                </h2>
                <p className="mb-0 text-gray-600 dark:text-gray-400">
                  Administration - Validation et suivi des congés
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            className="card border-0 shadow-sm rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/50 p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stats.total}
                </h4>
                <small className="text-gray-600 dark:text-gray-400 text-sm">Total</small>
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            className="card border-0 shadow-sm rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200/50 dark:border-yellow-700/50 p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {stats.enAttente}
                </h4>
                <small className="text-gray-600 dark:text-gray-400 text-sm">En attente</small>
              </div>
              <div className="text-yellow-600 dark:text-yellow-400">
                <ClockIcon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            className="card border-0 shadow-sm rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/50 p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.approuvees}
                </h4>
                <small className="text-gray-600 dark:text-gray-400 text-sm">Approuvées</small>
              </div>
              <div className="text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            className="card border-0 shadow-sm rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-700/50 p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {stats.rejetees}
                </h4>
                <small className="text-gray-600 dark:text-gray-400 text-sm">Rejetées</small>
              </div>
              <div className="text-red-600 dark:text-red-400">
                <XCircleIcon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Panel principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          {/* En-tête du panel */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Liste des Demandes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredDemandes.length} demande(s) trouvée(s)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <button
                onClick={fetchDemandes}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Search className="w-3.5 h-3.5 mr-1" />
                  Recherche Globale
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nom, prénom, email, matricule, type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  Statut
                </label>
                <select
                  value={statutFilter}
                  onChange={(e) => setStatutFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Tous les statuts</option>
                  {STATUTS.map((statut) => (
                    <option key={statut.value} value={statut.value}>
                      {statut.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  Type de congé
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Tous les types</option>
                  {TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-600 dark:text-gray-400">Filtres actifs:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                    Recherche: "{searchTerm}"
                  </span>
                )}
                {statutFilter && (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                    Statut: {STATUTS.find(s => s.value === statutFilter)?.label}
                  </span>
                )}
                {typeFilter && (
                  <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded">
                    Type: {TYPES.find(t => t.value === typeFilter)?.label}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          {/* Tableau des demandes */}
          <div className="overflow-x-auto">
            {filteredDemandes.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucune demande trouvée
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {hasActiveFilters
                    ? "Aucune demande ne correspond à vos critères de recherche."
                    : "Aucune demande de congé n'a été soumise pour le moment."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#179150] bg-[#179150]/10 border border-[#179150]/20 rounded-lg hover:bg-[#179150]/20 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date demande
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDemandes.map((demande) => {
                    const statutBadge = getStatutBadge(demande.statut);
                    const typeBadge = getTypeBadge(demande.type_conge);
                    const StatutIcon = statutBadge.icon;
                    const TypeIcon = typeBadge.icon;
                    const jours = calculateDays(demande.date_debut, demande.date_fin);
                    // Gérer le cas où employe peut être un ID ou un objet
                    const employeData = typeof demande.employe === 'object' ? demande.employe : null;

                    return (
                      <motion.tr
                        key={demande.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {employeData?.user?.first_name?.charAt(0) || ''}{employeData?.user?.last_name?.charAt(0) || ''}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {employeData?.user?.first_name} {employeData?.user?.last_name || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {employeData?.matricule || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 mr-2 text-[#179150]" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {typeBadge.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(demande.date_debut)} → {formatDate(demande.date_fin)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                            {jours} jour(s)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${statutBadge.value === 'en_attente'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                              : statutBadge.value === 'approuve'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                            }`}>
                            <StatutIcon className="w-3 h-3 mr-1" />
                            {statutBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(demande.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/superadmin/conges/${demande.id}`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {demande.statut === 'en_attente' && (
                              <>
                                <button
                                  onClick={() => handleApproveClick(demande)}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="Approuver"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(demande)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Rejeter"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteClick(demande)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${toastType === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              }`}
          >
            {toastType === 'success' ? (
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
                Êtes-vous sûr de vouloir approuver la demande de congé de <strong>{
                  typeof demandeToAction?.employe === 'object'
                    ? `${demandeToAction.employe?.user?.first_name || ''} ${demandeToAction.employe?.user?.last_name || ''}`.trim() || 'cet employé'
                    : 'cet employé'
                }</strong> ?
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
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approuver
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
                Êtes-vous sûr de vouloir rejeter la demande de congé de <strong>{
                  typeof demandeToAction?.employe === 'object'
                    ? `${demandeToAction.employe?.user?.first_name || ''} ${demandeToAction.employe?.user?.last_name || ''}`.trim() || 'cet employé'
                    : 'cet employé'
                }</strong> ?
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
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Rejeter
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
                Êtes-vous sûr de vouloir supprimer cette demande de congé ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
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

