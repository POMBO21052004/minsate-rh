import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Calendar, 
  UserCheck,
  CheckCircle,
  X,
  Settings,
  Activity,
  AlertCircle,
  User,
  Contact,
  Key,
  Database,
  Shield,
  Clock,
  Info,
  Home,
  Users,
  BarChart,
  Zap,
  Globe,
  UserX,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function AdminView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/superadmins/${id}/`);
      setAdmin(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showToastMessage('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/users/superadmins/${id}/`);
      showToastMessage('Super Administrateur supprimé avec succès', 'success');
      navigate('/superadmin/super-admins');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showToastMessage('Erreur lors de la suppression', 'error');
    } finally {
      setShowDeleteModal(false);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProfileCompletion = () => {
    let completion = 0;
    if (admin.first_name) completion += 33;
    if (admin.last_name) completion += 33;
    if (admin.email) completion += 34;
    return Math.min(completion, 100);
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des données...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!admin) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-16">
          <UserCheck className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Super Administrateur non trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Le super administrateur que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/superadmin/super-admins"
            className="inline-flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      {/* En-tête amélioré */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <Link
                to="/superadmin/super-admins"
                className="btn btn-outline-secondary btn-sm me-3 flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour
              </Link>
              <div>
                <h1 className="text-2xl font-bold mb-0 text-gray-900 dark:text-white">
                  {admin.first_name} {admin.last_name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="badge bg-red-600 px-2 py-1 rounded flex items-center text-white text-xs">
                    <Settings className="w-3 h-3 mr-1" />
                    Super Administrateur
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 lg:mt-0">
            <Link
              to={`/superadmin/super-admins/${id}/edit`}
              className="btn btn-primary flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] transition-colors rounded-lg"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Link>
            <button
              onClick={handleDeleteClick}
              className="btn btn-danger flex items-center px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors rounded-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Informations principales */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profil */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Contact className="w-5 h-5 mr-3 text-[#179150]" />
                Informations personnelles
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                <div className="md:w-1/4 text-center mb-4 md:mb-0">
                  <div className="relative inline-block">
                    <div 
                      className="rounded-full border-4 border-red-600 flex items-center justify-center"
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
                        color: 'white', 
                        fontSize: '2.5rem', 
                        fontWeight: '700' 
                      }}
                    >
                      {getInitials(admin.first_name, admin.last_name)}
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 border-2 border-white dark:border-gray-800 rounded-full">
                      <Settings className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <div className="md:w-3/4 md:pl-8">
                  <h4 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{admin.first_name} {admin.last_name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {admin.email}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded">Super Administrateur</span>
                    <span className={`px-3 py-1 text-white text-sm font-medium rounded ${admin.is_verified ? 'bg-green-600' : 'bg-gray-500'}`}>
                      {admin.is_verified ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Prénom :</span>
                    <span className="font-medium text-gray-900 dark:text-white">{admin.first_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Nom :</span>
                    <span className="font-medium text-gray-900 dark:text-white">{admin.last_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Email :</span>
                    <span className="font-medium text-gray-900 dark:text-white">{admin.email}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Statut du compte :</span>
                    <span className={`font-medium ${admin.is_verified ? 'text-green-600' : 'text-gray-600'}`}>
                      {admin.is_verified ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Inscrit depuis :</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(admin.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Dernière mise à jour :</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(admin.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions et accès */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-5 h-5 mr-3 text-yellow-600" />
                Permissions et accès système
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                Cet administrateur système dispose d'un accès complet à toutes les fonctionnalités de la plateforme.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Home className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Gestion des établissements</div>
                    <small className="text-gray-600 dark:text-gray-400">Création et administration</small>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Users className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</div>
                    <small className="text-gray-600 dark:text-gray-400">Tous les types d'utilisateurs</small>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Settings className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Configuration système</div>
                    <small className="text-gray-600 dark:text-gray-400">Paramètres globaux</small>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Database className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Gestion des données</div>
                    <small className="text-gray-600 dark:text-gray-400">Export/Import et sauvegarde</small>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Activity className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Monitoring système</div>
                    <small className="text-gray-600 dark:text-gray-400">Journaux et statistiques</small>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Key className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Sécurité et accès</div>
                    <small className="text-gray-600 dark:text-gray-400">Gestion des permissions</small>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <h5 className="mb-0 font-semibold text-gray-900 dark:text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-red-600" />
                Actions rapides
              </h5>
            </div>
            <div className="p-4 space-y-2">
              <Link
                to={`/superadmin/super-admins/${id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors rounded-lg"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Link>
              <Link
                to="/superadmin/super-admins"
                className="w-full flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-lg"
              >
                <Users className="w-4 h-4 mr-2" />
                Tous les admins système
              </Link>
              <Link
                to="/superadmin/dashboard"
                className="w-full flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-lg"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Retour au Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Statut du compte */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <h5 className="mb-0 font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-red-600" />
                Statut du compte
              </h5>
            </div>
            <div className="p-6">
              <div className="text-center mb-3">
                <div className="text-red-600 mb-2">
                  <Settings className="w-12 h-12 mx-auto" />
                </div>
                <h6 className="mb-0 text-gray-900 dark:text-white">Type de compte</h6>
                <h4 className="text-red-600 mb-0 font-bold">Super Administrateur</h4>
                <small className="text-gray-600 dark:text-gray-400">Accès complet au système</small>
              </div>

              <hr className="my-3" />

              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Profil complété :</span>
                  <span className="font-bold text-green-600">
                    {calculateProfileCompletion()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${calculateProfileCompletion()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Statut :</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    admin.is_verified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {admin.is_verified ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Rôle :</span>
                  <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium">Super Administrateur</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informations système */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h5 className="mb-0 font-semibold text-gray-900 dark:text-white flex items-center">
                <Info className="w-5 h-5 mr-2 text-gray-600" />
                Informations système
              </h5>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex items-start">
                <Key className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">ID Utilisateur</div>
                  <div className="text-gray-600 dark:text-gray-400 font-mono">{admin.id}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Date de création</div>
                  <div className="text-gray-600 dark:text-gray-400">{formatDate(admin.created_at)}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Dernière modification</div>
                  <div className="text-gray-600 dark:text-gray-400">{formatDate(admin.updated_at)}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Niveau d'accès</div>
                  <div className="text-gray-600 dark:text-gray-400">Super Administrateur - Accès Total</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {showDeleteModal && (
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
                  Êtes-vous sûr de vouloir supprimer le super administrateur <strong>{admin.first_name} {admin.last_name}</strong> ?
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
                    onClick={() => setShowDeleteModal(false)}
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