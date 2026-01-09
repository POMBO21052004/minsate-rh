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
  File,
  Settings,
  Filter,
  Info,
  XCircle,
  User as UserIcon,
  Clock,
  Sliders
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
      const response = await api.get('/users/superadmins/');
      setAdmins(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showToastMessage('Erreur lors du chargement des supers administrateurs', 'error');
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

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    try {
      await api.delete(`/users/superadmins/${adminToDelete.id}/`);
      showToastMessage('Super Administrateur supprimé avec succès', 'success');
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

  const handleBulkDelete = async () => {
    try {
      const idsArray = Array.from(selectedAdmins);
      await Promise.all(idsArray.map(id => api.delete(`/users/superadmins/${id}/`)));
      showToastMessage(`${idsArray.length} super(s) administrateur(s) supprimé(s) avec succès`, 'success');
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
        api.patch(`/users/superadmins/${id}/`, { is_verified: newStatus === 'activate' })
      ));
      showToastMessage(
        `${idsArray.length} super(s) administrateur(s) ${newStatus === 'activate' ? 'activé(s)' : 'désactivé(s)'} avec succès`,
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

  const exportToCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Statut', 'Date création'];
    const csvData = filteredAdmins.map(admin => [
      admin.last_name || '',
      admin.first_name || '',
      admin.email || '',
      admin.is_verified ? 'Actif' : 'Inactif',
      formatDate(admin.created_at)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supers_administrateurs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToastMessage('Export CSV généré avec succès', 'success');
  };

  const hasActiveFilters = searchTerm || statusFilter;

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des supers administrateurs...</p>
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
          <div className="flex items-center mb-3">
            <div className="me-3 p-3 rounded-full bg-[#179150]/10 border border-[#179150]/20">
              <Settings className="w-6 h-6 text-[#179150]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                Gestion des Supers Administrateurs
              </h2>
              <p className="mb-0 text-gray-600 dark:text-gray-400">
                Administration - Gestion des super administrateurs
              </p>
            </div>
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

        {/* Panneau principal amélioré */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          {/* En-tête du panneau */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-[#179150] mr-3" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Liste des Supers Administrateurs
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative group">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-[#179150] text-[#179150] dark:text-[#179150] hover:bg-[#179150] hover:text-white dark:hover:bg-[#179150] transition-colors rounded-lg font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>

                <Link
                  to="/superadmin/super-admins/create"
                  className="flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] focus:ring-2 focus:ring-[#179150] focus:ring-offset-2 transition-colors rounded-lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouvel Super Admin
                </Link>
              </div>
            </div>
          </div>

          {/* Filtres de recherche améliorés */}
          <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche Globale */}
              <div className="md:col-span-1">
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

              {/* Actions filtres */}
              <div className="flex items-end gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
                  title="Réinitialiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Résultats de recherche */}
            {hasActiveFilters && (
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      Filtres appliqués :
                    </span>
                    {searchTerm && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                        {searchTerm}
                      </span>
                    )}
                    {statusFilter && (
                      <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded">
                        {statusFilter === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Effacer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Boutons d'actions groupées */}
          <AnimatePresence>
            {showBulkActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-b border-yellow-200 dark:border-yellow-700"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center">
                    <Sliders className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      <span className="text-yellow-600 dark:text-yellow-400">{selectedAdmins.size}</span> administrateur(s) sélectionné(s)
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowActivateGroupModal(true)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg transition-colors text-sm"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Activer
                    </button>
                    <button
                      onClick={() => setShowDeactivateGroupModal(true)}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white font-medium hover:bg-yellow-700 rounded-lg transition-colors text-sm"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Désactiver
                    </button>
                    <button
                      onClick={() => setShowDeleteGroupModal(true)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAdmins(new Set());
                        setSelectAll(false);
                      }}
                      className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors text-sm"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Tout désélectionner
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tableau amélioré */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-[#179150] border-gray-300 rounded focus:ring-[#179150]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-16">
                    Photo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Nom & Prénom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmins.map((admin, index) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.has(admin.id.toString())}
                        onChange={() => handleSelectAdmin(admin.id)}
                        className="w-4 h-4 text-[#179150] border-gray-300 rounded focus:ring-[#179150]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-600">
                        {getInitials(admin.first_name, admin.last_name)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#179150] dark:text-blue-400">
                        {admin.first_name} {admin.last_name}
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
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${admin.is_verified
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
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactif
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          to={`/superadmin/super-admins/${admin.id}`}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/superadmin/super-admins/${admin.id}/edit`}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* État vide amélioré */}
          {filteredAdmins.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-4"
            >
              <Settings className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h5 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">
                {hasActiveFilters ? 'Aucun super administrateur trouvé' : 'Aucun super administrateur'}
              </h5>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {hasActiveFilters
                  ? "Aucun super administrateur ne correspond à vos critères de recherche."
                  : "Commencez par créer votre premier super administrateur."
                }
              </p>
              <div className="flex gap-2 justify-center">
                {!hasActiveFilters && (
                  <Link
                    to="/superadmin/super-admins/create"
                    className="inline-flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] transition-colors rounded-lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter le premier administrateur
                  </Link>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Modals pour actions groupées */}
        {/* Modal Suppression groupée */}
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 w-full max-w-md border border-red-200 dark:border-red-700 rounded-lg shadow-xl"
              >
                <div className="px-6 py-4 border-b border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <h5 className="text-lg font-semibold text-red-600">
                      Confirmer la Suppression
                    </h5>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Êtes-vous sûr de vouloir supprimer les <strong className="text-red-600">{selectedAdmins.size} super(s) administrateur(s)</strong> sélectionné(s) ?
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 mb-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Attention !</strong> Cette action est irréversible et supprimera définitivement tous les comptes sélectionnés.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteGroupModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors rounded-lg flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Activation groupée */}
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 w-full max-w-md border border-green-200 dark:border-green-700 rounded-lg shadow-xl"
              >
                <div className="px-6 py-4 border-b border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                    <h5 className="text-lg font-semibold text-green-600">
                      Activer les Administrateurs
                    </h5>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Êtes-vous sûr de vouloir activer les <strong className="text-green-600">{selectedAdmins.size} super(s) administrateur(s)</strong> sélectionné(s) ?
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4 mb-4 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Les administrateurs activés pourront à nouveau accéder à leur compte.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowActivateGroupModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleBulkToggleStatus('activate')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors rounded-lg flex items-center justify-center"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Activer
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Désactivation groupée */}
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 w-full max-w-md border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-xl"
              >
                <div className="px-6 py-4 border-b border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center">
                    <UserX className="w-5 h-5 text-yellow-600 mr-3" />
                    <h5 className="text-lg font-semibold text-yellow-600">
                      Désactiver les Administrateurs
                    </h5>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Êtes-vous sûr de vouloir désactiver les <strong className="text-yellow-600">{selectedAdmins.size} super(s) administrateur(s)</strong> sélectionné(s) ?
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 mb-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Les administrateurs désactivés ne pourront plus accéder à leur compte.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeactivateGroupModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleBulkToggleStatus('deactivate')}
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors rounded-lg flex items-center justify-center"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Désactiver
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de confirmation de suppression individuelle */}
        <AnimatePresence>
          {showDeleteModal && adminToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white dark:bg-gray-800 w-full max-w-md border border-gray-200 dark:border-gray-600"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Confirmer la suppression
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Êtes-vous sûr de vouloir supprimer le super administrateur <strong>{adminToDelete.first_name} {adminToDelete.last_name}</strong> ?
                  </p>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Cette action est irréversible. Toutes les données associées seront définitivement supprimées.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setAdminToDelete(null);
                      }}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
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
      </div>
    </SuperAdminLayout>
  );
}