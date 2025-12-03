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
  CheckCircle,
  X,
  RefreshCw,
  Download,
  AlertCircle,
  TrendingUp,
  Activity,
  Mail,
  Calendar,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function AdminList() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

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
      {/* En-tête */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link to="/superadmin/dashboard" className="hover:text-[#179150] transition-colors">
            Tableau de bord
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Administrateurs</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center mb-3">
              <div className="p-3 bg-[#179150]/10 mr-4 border border-[#179150]/20">
                <UserCheck className="w-6 h-6 text-[#179150]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Administrateurs
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gestion des comptes administrateurs
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/superadmin/admins/create"
            className="flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] focus:ring-2 focus:ring-[#179150] focus:ring-offset-2 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel administrateur
          </Link>
        </div>
      </motion.div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total administrateurs
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
              <div className="flex items-center mt-2 text-xs text-[#179150]">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Tous les comptes</span>
              </div>
            </div>
            <div className="p-3 bg-[#179150]/10 border border-[#179150]/20">
              <Users className="w-6 h-6 text-[#179150]" />
            </div>
          </div>
        </motion.div>

        {/* Actifs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Comptes actifs
              </p>
              <p className="text-3xl font-bold text-[#179150]">
                {stats.actifs}
              </p>
              <div className="flex items-center mt-2 text-xs text-[#179150]">
                <Activity className="w-3 h-3 mr-1" />
                <span>{stats.total > 0 ? Math.round((stats.actifs / stats.total) * 100) : 0}% du total</span>
              </div>
            </div>
            <div className="p-3 bg-[#179150]/10 border border-[#179150]/20">
              <CheckCircle className="w-6 h-6 text-[#179150]" />
            </div>
          </div>
        </motion.div>

        {/* Inactifs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Comptes inactifs
              </p>
              <p className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                {stats.inactifs}
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <X className="w-3 h-3 mr-1" />
                <span>{stats.total > 0 ? Math.round((stats.inactifs / stats.total) * 100) : 0}% du total</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <X className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Panneau principal */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        {/* En-tête du panneau */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Liste des administrateurs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredAdmins.length} compte(s) trouvé(s)
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>

              <button
                onClick={fetchAdmins}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, prénom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#179150] focus:border-[#179150] transition-colors"
                />
              </div>
            </div>

            {/* Filtre statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut du compte
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#179150] focus:border-[#179150] transition-colors"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>

            {/* Actions filtres */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Administrateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden xl:table-cell">
                  Date de création
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#179150] to-[#147a43] flex items-center justify-center text-white font-semibold text-sm mr-4">
                        {getInitials(admin.first_name, admin.last_name)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {admin.first_name} {admin.last_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 lg:hidden mt-1">
                          <Mail className="w-3 h-3 inline mr-1" />
                          {admin.email}
                        </div>
                        <div className="flex items-center mt-1 md:hidden">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
                            admin.is_verified 
                              ? 'bg-[#179150]/10 text-[#179150] border border-[#179150]/20' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                          }`}>
                            {admin.is_verified ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                      admin.is_verified 
                        ? 'bg-[#179150]/10 text-[#179150] border border-[#179150]/20' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden xl:table-cell">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {formatDate(admin.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/superadmin/admins/${admin.id}`}
                        className="text-[#179150] hover:text-[#147a43] p-2 hover:bg-[#179150]/10 transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/superadmin/admins/${admin.id}/edit`}
                        className="text-[#179150] hover:text-[#147a43] p-2 hover:bg-[#179150]/10 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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

        {/* État vide */}
        {filteredAdmins.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter ? 'Aucun résultat' : 'Aucun administrateur'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter 
                ? "Aucun administrateur ne correspond à vos critères de recherche." 
                : "Commencez par créer votre premier administrateur."
              }
            </p>
            {!searchTerm && !statusFilter && (
              <Link
                to="/superadmin/admins/create"
                className="inline-flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] focus:ring-2 focus:ring-[#179150] focus:ring-offset-2 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Créer un administrateur
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Modal de confirmation de suppression */}
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
                  Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{adminToDelete.first_name} {adminToDelete.last_name}</strong> ?
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

      {/* Notifications Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`border ${
              toastType === 'success' 
                ? 'bg-[#179150]/10 border-[#179150]/20' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            } p-4 max-w-sm`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${
                  toastType === 'success' ? 'text-[#179150]' : 'text-red-600'
                }`}>
                  {toastType === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    toastType === 'success' 
                      ? 'text-[#179150]' 
                      : 'text-red-800 dark:text-red-400'
                  }`}>
                    {toastMessage}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SuperAdminLayout>
  );
}