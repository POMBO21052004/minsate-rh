import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import { 
  User, 
  Mail, 
  Shield,
  Edit3,
  ArrowLeft,
  CheckCircle,
  Clock,
  Award,
  Settings,
  Lock,
  Activity,
  Users,
  Database,
  Calendar,
  BadgeCheck,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Building,
  Key,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function SuperAdminProfile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour le modal de changement de mot de passe
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  
  // États pour les notifications toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/profile');
        setUser(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error('Erreur profil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplay = (user) => {
    if (user?.is_superadmin) {
      return { label: 'Super Administrateur', color: 'green' };
    } else if (user?.is_admin) {
      return { label: 'Administrateur', color: 'blue' };
    } else {
      return { label: 'Employé', color: 'gray' };
    }
  };

  function calculateProfileCompletion(user) {
    if (!user) return 0;
    
    const fields = [
        user?.first_name,
        user?.last_name, 
        user?.email
    ];
    
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setChangingPassword(true);
      setPasswordErrors({});
      
      const response = await api.put('/users/change-password', passwordForm);
      
      if (response.data.message) {
        showToastMessage('Mot de passe changé avec succès !', 'success');
        setShowPasswordModal(false);
        setPasswordForm({
          old_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setPasswordErrors(err.response.data.errors);
      } else if (err.response?.data?.error) {
        showToastMessage(err.response.data.error, 'error');
      } else {
        showToastMessage('Erreur lors du changement de mot de passe', 'error');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      old_password: '',
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors({});
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </h3>
            </div>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  const roleInfo = getRoleDisplay(user);

  return (
    <SuperAdminLayout>
      {/* En-tête */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mon Profil Administrateur
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Informations personnelles et professionnelles
          </p>
        </div>
        <Link
          to="/superadmin/profile/edit"
          className="inline-flex items-center px-6 py-3 bg-[#179150] hover:bg-[#147a43] text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Edit3 className="w-5 h-5 mr-2" />
          Modifier le profil
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* En-tête de la carte */}
            <div className="bg-[#179150]/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-[#179150]" />
                Informations personnelles
              </h2>
            </div>

            <div className="p-6">
              {/* Photo et informations basiques */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    {user?.first_name?.charAt(0) || 'S'}{user?.last_name?.charAt(0) || 'A'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#179150] text-white p-2 rounded-lg border-2 border-white dark:border-gray-800 shadow-sm">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20`}>
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      {roleInfo.label}
                    </span>
                    {user?.is_verified && (
                      <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Compte vérifié
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grille d'informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Prénom
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user?.first_name || 'Non renseigné'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Nom
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user?.last_name || 'Non renseigné'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user?.email}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Rôle
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {roleInfo.label}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Statut vérification
                    </span>
                    <span className={`font-medium ${user?.is_verified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {user?.is_verified ? 'Vérifié' : 'En attente'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Membre depuis
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(user?.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Dernière mise à jour
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(user?.updated_at)}
                    </span>
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
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-[#179150]" />
                Actions rapides
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <Link
                to="/superadmin/profile/edit"
                className="flex items-center justify-between p-3 rounded-lg bg-[#179150]/10 hover:bg-[#179150]/20 border border-[#179150]/20 transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <Edit3 className="w-4 h-4 text-[#179150] mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Modifier le profil</span>
                </div>
                <div className="text-[#179150] group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </Link>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-[#179150]/10 hover:bg-[#179150]/20 border border-[#179150]/20 transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-[#179150] mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Changer mot de passe</span>
                </div>
                <div className="text-[#179150] group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </button>
              
              <Link
                to="/superadmin/dashboard"
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Retour au Dashboard</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Statistiques du compte */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#179150]" />
                Statistiques du compte
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {calculateProfileCompletion(user)}%
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Profil complété
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Statut du compte</span>
                  <span className="font-medium text-[#179150]">Actif</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Vérification</span>
                  <span className={`font-medium ${user?.is_verified ? 'text-[#179150]' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {user?.is_verified ? 'Complète' : 'En attente'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Type de compte</span>
                  <span className="font-medium text-[#179150]">Super Admin</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closePasswordModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              {/* En-tête du modal */}
              <div className="bg-[#179150]/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-[#179150]" />
                    Changer le mot de passe
                  </h3>
                  <button
                    onClick={closePasswordModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

            {/* Corps du modal */}
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Ancien mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ancien mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      name="old_password"
                      value={passwordForm.old_password}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 transition-colors ${
                        passwordErrors.old_password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150]'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Entrez votre ancien mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('old')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-600 dark:hover:text-green-300"
                    >
                      {showPasswords.old ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.old_password && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {passwordErrors.old_password[0]}
                    </p>
                  )}
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 transition-colors ${
                        passwordErrors.new_password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150]'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Entrez votre nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-600 dark:hover:text-green-300"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {passwordErrors.new_password[0]}
                    </p>
                  )}
                </div>

                {/* Confirmation du mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 transition-colors ${
                        passwordErrors.confirm_password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150]'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Confirmez votre nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-600 dark:hover:text-green-300"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirm_password && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {passwordErrors.confirm_password[0]}
                    </p>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex-1 px-4 py-3 bg-[#179150] hover:bg-[#147a43] text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {changingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Modification...
                      </div>
                    ) : (
                      "Changer le mot de passe"
                    )}
                  </button>
                </div>
              </form>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </SuperAdminLayout>
  );
}