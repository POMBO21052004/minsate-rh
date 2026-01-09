import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../contexts/Layout";
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
  Database
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";
import Toast from "../../../components/ui/Toast";

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
      const response = await api.get(`/users/admins/${id}/`);
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
      await api.delete(`/users/admins/${id}/`);
      showToastMessage('Administrateur supprimé avec succès', 'success');
      navigate('/superadmin/admins');
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
            Administrateur non trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            L'administrateur que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/superadmin/admins"
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
          <Link to="/superadmin/admins" className="hover:text-[#179150] transition-colors">
            Administrateurs
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Détails</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center mb-3">
              <Link
                to="/superadmin/admins"
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {admin.first_name} {admin.last_name}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Détails du compte administrateur
            </p>
          </div>

          <div className="flex space-x-3">
            <Link
              to={`/superadmin/admins/${id}/edit`}
              className="flex items-center px-4 py-2 bg-[#179150] text-white font-medium hover:bg-[#147a43] focus:ring-2 focus:ring-[#179150] focus:ring-offset-2 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Link>

            <button
              onClick={handleDeleteClick}
              className="flex items-center px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
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
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Contact className="w-5 h-5 mr-3 text-[#179150]" />
                Informations personnelles
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#179150] to-[#147a43] flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(admin.first_name, admin.last_name)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#179150] text-white p-2 border-2 border-white dark:border-gray-800">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {admin.first_name} {admin.last_name}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400 mb-4">
                    <Mail className="w-4 h-4 mr-2" />
                    {admin.email}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20">
                      <UserCheck className="w-4 h-4 mr-1.5" />
                      Administrateur
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium ${admin.is_verified
                      ? 'bg-[#179150]/10 text-[#179150] border border-[#179150]/20'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      }`}>
                      {admin.is_verified ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Compte vérifié
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1.5" />
                          En attente de vérification
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Identité
                  </h4>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Prénom
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {admin.first_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Nom
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {admin.last_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Email professionnel
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {admin.email}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-gray-500" />
                    Activité
                  </h4>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Statut du compte
                    </span>
                    <span className={`font-medium ${admin.is_verified
                      ? 'text-[#179150]'
                      : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                      {admin.is_verified ? 'Actif' : 'En attente'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date de création
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(admin.created_at)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Dernière modification
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(admin.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rôle et permissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Key className="w-5 h-5 mr-3 text-[#179150]" />
                Rôle et permissions
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-4 bg-[#179150]/10 border border-[#179150]/20">
                  <Settings className="w-5 h-5 text-[#179150] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Gestion des employés</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Consultation et gestion des profils employés
                    </div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-[#179150]/10 border border-[#179150]/20">
                  <Database className="w-5 h-5 text-[#179150] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Gestion des congés</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Validation et suivi des demandes de congé
                    </div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-[#179150]/10 border border-[#179150]/20">
                  <Activity className="w-5 h-5 text-[#179150] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Rapports et statistiques</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Accès aux tableaux de bord et analyses
                    </div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-[#179150]/10 border border-[#179150]/20">
                  <UserCheck className="w-5 h-5 text-[#179150] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Gestion des départements</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Organisation et structure hiérarchique
                    </div>
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
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center">
                <Settings className="w-4 h-4 mr-2 text-[#179150]" />
                Actions
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <Link
                to={`/superadmin/admins/${id}/edit`}
                className="flex items-center justify-between p-3 bg-[#179150]/10 hover:bg-[#179150]/20 border border-[#179150]/20 transition-colors duration-200 group rounded-lg"
              >
                <div className="flex items-center">
                  <Edit className="w-4 h-4 text-[#179150] mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Modifier le profil</span>
                </div>
                <div className="text-[#179150] group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </Link>

              <button
                onClick={handleDeleteClick}
                className="flex items-center justify-between w-full p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 transition-colors duration-200 group rounded-lg"
              >
                <div className="flex items-center">
                  <Trash2 className="w-4 h-4 text-red-600 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Supprimer le compte</span>
                </div>
                <div className="text-red-600 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </button>

              <Link
                to="/superadmin/admins"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors duration-200 group rounded-lg"
              >
                <div className="flex items-center">
                  <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Retour à la liste</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
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
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center">
                <Database className="w-4 h-4 mr-2 text-[#179150]" />
                Système
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rôle</span>
                <span className="text-sm font-medium text-[#179150]">Administrateur</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">ID</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white">{admin.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Créé le</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatDate(admin.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Modifié le</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatDate(admin.updated_at)}</span>
              </div>
            </div>
          </motion.div>

          {/* Statut */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-[#179150]/10 border border-[#179150]/20 p-4"
          >
            <div className="flex items-start">
              <UserCheck className="w-5 h-5 text-[#179150] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-[#179150] mb-2">
                  Statut du compte
                </h4>
                <div className={`inline-flex items-center px-3 py-1 text-sm font-medium ${admin.is_verified
                  ? 'bg-[#179150]/10 text-[#179150] border border-[#179150]/20'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                  }`}>
                  {admin.is_verified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Compte actif et vérifié
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-1.5" />
                      En attente de vérification
                    </>
                  )}
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
              className="bg-white dark:bg-gray-800 w-full max-w-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl"
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
                  Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{admin.first_name} {admin.last_name}</strong> ?
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
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center rounded-lg"
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
    </SuperAdminLayout>
  );
}