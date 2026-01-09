import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  CheckCircle,
  X,
  RefreshCw,
  Download,
  AlertCircle,
  TrendingUp,
  Activity,
  Mail,
  Calendar,
  FileText,
  Settings,
  Filter,
  Info,
  XCircle,
  User as UserIcon,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";
import Toast from "../../../components/ui/Toast";

export default function AdminList() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showActivateGroupModal, setShowActivateGroupModal] = useState(false);
  const [showDeactivateGroupModal, setShowDeactivateGroupModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    inactifs: 0
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/admins/');
      setAdmins(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showToastMessage('Erreur lors du chargement des administrateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const actifs = data.filter(admin => admin.is_verified).length;
    const inactifs = total - actifs;

    setStats({ total, actifs, inactifs });
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch =
      admin.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter ||
      (statusFilter === 'active' && admin.is_verified) ||
      (statusFilter === 'inactive' && !admin.is_verified);

    return matchesSearch && matchesStatus;
  });

  // Gestion des sélections
  useEffect(() => {
    setShowBulkActions(selectedAdmins.size > 0);
    setSelectAll(selectedAdmins.size === filteredAdmins.length && filteredAdmins.length > 0);
  }, [selectedAdmins, filteredAdmins.length]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredAdmins.map(admin => admin.id.toString()));
      setSelectedAdmins(allIds);
      setSelectAll(true);
    } else {
      setSelectedAdmins(new Set());
      setSelectAll(false);
    }
  };

  const handleSelectAdmin = (adminId) => {
    const newSelected = new Set(selectedAdmins);
    if (newSelected.has(adminId.toString())) {
      newSelected.delete(adminId.toString());
    } else {
      newSelected.add(adminId.toString());
    }
    setSelectedAdmins(newSelected);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSelectedAdmins(new Set());
  };

  const handleBulkDelete = async () => {
    try {
      const idsArray = Array.from(selectedAdmins);
      await Promise.all(idsArray.map(id => api.delete(`/users/admins/${id}/`)));
      showToastMessage(`${idsArray.length} administrateur(s) supprimé(s) avec succès`, 'success');
      fetchAdmins();
      setSelectedAdmins(new Set());
      setShowDeleteGroupModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression groupée:', error);
      showToastMessage('Erreur lors de la suppression groupée', 'error');
    }
  };

  const handleBulkToggleStatus = async (newStatus) => {
    try {
      const idsArray = Array.from(selectedAdmins);
      await Promise.all(idsArray.map(id =>
        api.patch(`/users/admins/${id}/`, { is_verified: newStatus === 'activate' })
      ));
      showToastMessage(
        `${idsArray.length} administrateur(s) ${newStatus === 'activate' ? 'activé(s)' : 'désactivé(s)'} avec succès`,
        'success'
      );
      fetchAdmins();
      setSelectedAdmins(new Set());
      setShowActivateGroupModal(false);
      setShowDeactivateGroupModal(false);
    } catch (error) {
      console.error('Erreur lors de la modification groupée:', error);
      showToastMessage('Erreur lors de la modification groupée', 'error');
    }
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    try {
      await api.delete(`/users/admins/${adminToDelete.id}/`);
      showToastMessage('Administrateur supprimé avec succès', 'success');
      fetchAdmins();
      setSelectedAdmins(new Set());
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showToastMessage('Erreur lors de la suppression', 'error');
    } finally {
      setShowDeleteModal(false);
      setAdminToDelete(null);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const hasActiveFilters = searchTerm || statusFilter;

  const exportToCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Statut', 'Date création'];
    const csvData = filteredAdmins.map(admin => [
      admin.last_name,
      admin.first_name,
      admin.email,
      admin.is_verified ? 'Actif' : 'Inactif',
      formatDate(admin.created_at)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'administrateurs.csv';
    link.click();
    URL.revokeObjectURL(url);

    showToastMessage('Export CSV généré avec succès', 'success');
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des administrateurs...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6 mb-4">
        {/* En-tête amélioré */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="me-3 p-3 rounded-full bg-[#179150]/10 border border-[#179150]/20">
                <UserCheck className="w-6 h-6 text-[#179150]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                  Gestion des Administrateurs
                </h2>
                <p className="mb-0 text-gray-600 dark:text-gray-400">
                  Administration - Gestion des administrateurs de l'organisation
                </p>
              </div>
            </div>
            <Link
              to="/superadmin/admins/create"
              className="inline-flex items-center px-4 py-2 bg-[#179150] hover:bg-[#147a43] text-white font-medium rounded-lg transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nouvel Administrateur
            </Link>
          </div>
        </motion.div>

        {/* Cartes de statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
                <Users className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            className="card border-0 shadow-sm rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/50 p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.actifs}
                </h4>
                <small className="text-gray-600 dark:text-gray-400 text-sm">Actifs</small>
              </div>
              <div className="text-green-600 dark:text-green-400">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            className="card border-0 shadow-sm rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/30 border border-gray-200/50 dark:border-gray-600/50 p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                  {stats.inactifs}
                </h4>
                <small className="text-gray-600 dark:text-gray-400 text-sm">Inactifs</small>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <UserX className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Panel principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          {/* En-tête du panel */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Liste des Administrateurs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredAdmins.length} administrateur(s) trouvé(s)
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
                onClick={fetchAdmins}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtres de recherche améliorés */}
          <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche Globale */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Search className="w-3.5 h-3.5 mr-1" />
                  Recherche Globale
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Prénom, nom, email..."
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

              {/* Statut */}
              <div>
                <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1" />
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Tous</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            {/* Badge de résultats de recherche */}
            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-600 dark:text-gray-400">Filtres actifs:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                    Recherche: "{searchTerm}"
                  </span>
                )}
                {statusFilter && (
                  <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded">
                    {statusFilter === 'active' ? 'Actif' : 'Inactif'}
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

          {/* Actions groupées */}
          <AnimatePresence>
            {showBulkActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-3 bg-[#179150]/10 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedAdmins.size} administrateur(s) sélectionné(s)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowActivateGroupModal(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Activer
                  </button>
                  <button
                    onClick={() => setShowDeactivateGroupModal(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Désactiver
                  </button>
                  <button
                    onClick={() => setShowDeleteGroupModal(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tableau */}
          {filteredAdmins.length === 0 ? (
            <div className="p-12 text-center">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aucun administrateur trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {hasActiveFilters
                  ? "Aucun administrateur ne correspond à vos critères de recherche."
                  : "Commencez par créer votre premier administrateur."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#179150] bg-[#179150]/10 border border-[#179150]/20 rounded-lg hover:bg-[#179150]/20 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Réinitialiser les filtres
                </button>
              ) : (
                <Link
                  to="/superadmin/admins/create"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#179150] rounded-lg hover:bg-[#147a43] transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Créer un administrateur
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#179150] border-gray-300 rounded focus:ring-[#179150]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Administrateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.has(admin.id.toString())}
                          onChange={() => handleSelectAdmin(admin.id)}
                          className="w-4 h-4 text-[#179150] border-gray-300 rounded focus:ring-[#179150]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-600 mr-3">
                            {getInitials(admin.first_name, admin.last_name)}
                          </div>
                          <div className="text-sm font-bold text-[#179150] dark:text-blue-400">
                            {admin.first_name} {admin.last_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white hidden md:table-cell">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1.5 text-gray-400" />
                          {admin.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1.5" />
                            Inscrit le {formatDate(admin.created_at)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${admin.is_verified
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {admin.is_verified ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/superadmin/admins/${admin.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/superadmin/admins/${admin.id}/edit`}
                            className="text-[#179150] hover:text-[#147a43] dark:text-green-400 dark:hover:text-green-300"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>


      {/* Modal de suppression individuelle */}
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
                Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{adminToDelete?.first_name} {adminToDelete?.last_name}</strong> ?
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

      {/* Modal de suppression groupée */}
      <AnimatePresence>
        {showDeleteGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteGroupModal(false)}
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
                    Confirmer la suppression groupée
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedAdmins.size} administrateur(s)</strong> ?
                Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteGroupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'activation groupée */}
      <AnimatePresence>
        {showActivateGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowActivateGroupModal(false)}
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
                  <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirmer l'activation groupée
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir activer <strong>{selectedAdmins.size} administrateur(s)</strong> ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowActivateGroupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleBulkToggleStatus('activate')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Activer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de désactivation groupée */}
      <AnimatePresence>
        {showDeactivateGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeactivateGroupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4">
                  <UserX className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirmer la désactivation groupée
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir désactiver <strong>{selectedAdmins.size} administrateur(s)</strong> ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeactivateGroupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleBulkToggleStatus('deactivate')}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Désactiver
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </SuperAdminLayout>
  );
}