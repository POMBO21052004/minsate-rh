import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Download,
  AlertCircle,
  Calendar,
  X,
  XCircle,
  Clock,
  Building2,
  Briefcase,
  CheckCircle,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function DepartementEmployes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employes, setEmployes] = useState([]);
  const [departement, setDepartement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [groupedByPoste, setGroupedByPoste] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeToDelete, setEmployeToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    inactifs: 0
  });

  useEffect(() => {
    fetchDepartement();
    fetchEmployes();
  }, [id]);

  useEffect(() => {
    groupEmployesByPoste();
  }, [employes, searchTerm, statutFilter]);

  const fetchDepartement = async () => {
    try {
      const response = await api.get(`/users/departements/${id}/`);
      setDepartement(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du département:', error);
      showToastMessage('Erreur lors du chargement du département', 'error');
    }
  };

  const fetchEmployes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/employe-profiles/');
      const allEmployes = response.data || [];
      // Filtrer les employés du département
      const deptEmployes = allEmployes.filter(emp => 
        emp.poste_details?.departement?.toString() === id
      );
      setEmployes(deptEmployes);
      calculateStats(deptEmployes);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showToastMessage('Erreur lors du chargement des employés', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const actifs = data.filter(emp => emp.statut === 'actif').length;
    const inactifs = total - actifs;
    
    setStats({ total, actifs, inactifs });
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const filteredEmployes = employes.filter(emp => {
    const matchesSearch = 
      emp.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.poste_details?.titre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = !statutFilter || emp.statut === statutFilter;
    
    return matchesSearch && matchesStatut;
  });

  const groupEmployesByPoste = () => {
    const grouped = {};
    
    filteredEmployes.forEach(emp => {
      const posteId = emp.poste?.toString() || 'sans-poste';
      const posteTitre = emp.poste_details?.titre || 'Sans poste';
      
      if (!grouped[posteId]) {
        grouped[posteId] = {
          titre: posteTitre,
          id: posteId,
          employes: []
        };
      }
      
      grouped[posteId].employes.push(emp);
    });
    
    setGroupedByPoste(grouped);
  };

  const handleDeleteClick = (employe) => {
    setEmployeToDelete(employe);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeToDelete) return;

    try {
      await api.delete(`/users/employe-profiles/${employeToDelete.id}/`);
      showToastMessage('Employé supprimé avec succès', 'success');
      fetchEmployes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de la suppression';
      showToastMessage(errorMsg, 'error');
    } finally {
      setShowDeleteModal(false);
      setEmployeToDelete(null);
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

  const getStatutBadge = (statut) => {
    const badges = {
      'actif': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', label: 'Actif' },
      'inactif': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: 'Inactif' },
      'suspendu': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-400', label: 'Suspendu' },
      'congé': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', label: 'En congé' }
    };
    return badges[statut] || badges['inactif'];
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const exportToCSV = () => {
    const headers = ['Matricule', 'Nom', 'Prénom', 'Email', 'Poste', 'Statut', 'Date embauche'];
    const csvData = filteredEmployes.map(emp => [
      emp.matricule || '',
      emp.user?.last_name || '',
      emp.user?.first_name || '',
      emp.user?.email || '',
      emp.poste_details?.titre || 'Non assigné',
      emp.statut || '',
      formatDate(emp.date_embauche)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employes_${departement?.nom || 'departement'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToastMessage('Export CSV généré avec succès', 'success');
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatutFilter("");
  };

  const hasActiveFilters = searchTerm || statutFilter;

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des employés...</p>
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
              <Link
                to="/superadmin/employes"
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div className="me-3 p-3 rounded-full bg-[#179150]/10 border border-[#179150]/20">
                <Building2 className="w-6 h-6 text-[#179150]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                  Employés du Département: {departement?.nom}
                </h2>
                <p className="mb-0 text-gray-600 dark:text-gray-400">
                  Gestion des employés groupés par poste
                </p>
              </div>
            </div>
            <Link
              to="/superadmin/employes/create"
              className="inline-flex items-center px-4 py-2 bg-[#179150] hover:bg-[#147a43] text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Employé
            </Link>
          </div>
        </motion.div>

        {/* Cartes de statistiques */}
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
                <CheckCircle className="w-5 h-5" />
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
                <AlertCircle className="w-5 h-5" />
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
                Employés groupés par poste
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredEmployes.length} employé(s) trouvé(s)
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
                onClick={fetchEmployes}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Search className="w-3.5 h-3.5 mr-1" />
                  Recherche Globale
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nom, prénom, email, matricule..."
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
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="congé">En congé</option>
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
                  <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded">
                    Statut: {statutFilter}
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

          {/* Liste groupée par poste */}
          <div className="p-6">
            {Object.keys(groupedByPoste).length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucun employé trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {hasActiveFilters 
                    ? "Aucun employé ne correspond à vos critères de recherche."
                    : "Ce département n'a pas encore d'employés."}
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
                    to="/superadmin/employes/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#179150] rounded-lg hover:bg-[#147a43] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un employé
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.values(groupedByPoste).map((poste) => (
                  <motion.div
                    key={poste.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* En-tête du poste */}
                    <div className="bg-gradient-to-r from-[#179150]/10 to-[#179150]/5 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#179150] rounded-lg flex items-center justify-center mr-3">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                              {poste.titre}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {poste.employes.length} employé(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Liste des employés */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {poste.employes.map((emp) => {
                          const statutBadge = getStatutBadge(emp.statut);
                          
                          return (
                            <motion.div
                              key={emp.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                    {getInitials(emp.user?.first_name, emp.user?.last_name)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                      {emp.user?.first_name} {emp.user?.last_name}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                      {emp.matricule}
                                    </div>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${statutBadge.bg} ${statutBadge.text}`}>
                                  {statutBadge.label}
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-sm mb-3">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Mail className="w-3 h-3 mr-2" />
                                  <span className="truncate">{emp.user?.email}</span>
                                </div>
                                {emp.telephone && (
                                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Phone className="w-3 h-3 mr-2" />
                                    {emp.telephone}
                                  </div>
                                )}
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Calendar className="w-3 h-3 mr-2" />
                                  Embauche: {formatDate(emp.date_embauche)}
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <Link
                                  to={`/superadmin/employes/${emp.id}`}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Voir les détails"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/superadmin/employes/${emp.id}/edit`}
                                  className="text-[#179150] hover:text-[#147a43] dark:text-green-400 dark:hover:text-green-300"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteClick(emp)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toastType === 'success' 
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
                Êtes-vous sûr de vouloir supprimer l'employé <strong>{employeToDelete?.user?.first_name} {employeToDelete?.user?.last_name}</strong> ? 
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
    </SuperAdminLayout>
  );
}

