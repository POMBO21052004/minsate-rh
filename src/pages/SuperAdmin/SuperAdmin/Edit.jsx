import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import {
  ArrowLeft,
  Save,
  UserCheck,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";
import Toast from "../../../components/ui/Toast";

export default function AdminEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/superadmins/${id}/`);
      const adminData = response.data;
      setAdmin(adminData);

      setFormData({
        first_name: adminData.first_name || '',
        last_name: adminData.last_name || '',
        email: adminData.email || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement du super administrateur:', error);
      showToastMessage('Erreur lors du chargement du super administrateur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setErrors({});

      const response = await api.put(`/users/superadmins/${id}/`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      });

      if (response.data) {
        showToastMessage('Super Administrateur mis à jour avec succès !', 'success');
        setTimeout(() => {
          navigate(`/superadmin/super-admins/${id}`);
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la mise à jour du super administrateur');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.password !== passwordForm.confirm_password) {
      showToastMessage('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    try {
      setChangingPassword(true);
      await api.put(`/users/superadmins/${id}/password`, {
        password: passwordForm.password
      });

      showToastMessage('Mot de passe modifié avec succès', 'success');
      setShowPasswordModal(false);
      setPasswordForm({ password: '', confirm_password: '' });
    } catch (error) {
      showToastMessage('Erreur lors de la modification du mot de passe', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179150] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du super administrateur...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!admin) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Super Administrateur non trouvé
          </h3>
          <Link
            to="/superadmin/super-admins"
            className="inline-flex items-center px-4 py-2 bg-[#179150] text-white hover:bg-[#147a43] transition-colors"
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center mb-2">
            <Link
              to={`/superadmin/super-admins/${id}`}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Modifier le super administrateur
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Mettez à jour les informations du super administrateur
          </p>
        </div>
      </motion.div>

      {/* Alertes */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <div className="text-sm text-red-800 dark:text-red-400">
                {error}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-[#179150]/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-[#179150]" />
                  Informations du super administrateur
                </h2>
              </div>

              <div className="p-6">
                {/* Avatar et informations de rôle */}
                <div className="flex items-center mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#179150] to-[#147a43] flex items-center justify-center text-white font-bold text-lg mr-4 rounded-lg">
                    {getInitials(formData.first_name, formData.last_name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {formData.first_name} {formData.last_name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20 rounded">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Super Administrateur
                      </span>
                      {admin.is_verified && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20 rounded ml-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Vérifié
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Champs du formulaire */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.first_name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
                      placeholder="Prénom de l'admin"
                      required
                    />
                    {errors.first_name && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.first_name[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.last_name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
                      placeholder="Nom de l'admin"
                      required
                    />
                    {errors.last_name && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.last_name[0]}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                      placeholder="admin@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.email[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Informations système */}
                <div className="mt-8 p-4 bg-[#179150]/10 border border-[#179150]/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-[#179150] mb-2 flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Informations système (non modifiables)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#179150] font-medium">Rôle :</span>
                      <span className="ml-2 text-[#147a43] font-semibold">Super Administrateur</span>
                    </div>
                    <div>
                      <span className="text-[#179150] font-medium">Statut vérification :</span>
                      <span className={`ml-2 font-semibold ${admin.is_verified ? 'text-[#179150]' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {admin.is_verified ? 'Vérifié' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-0">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center px-6 py-3 bg-[#179150]/10 hover:bg-[#179150]/20 text-[#179150] font-medium transition-colors duration-200"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Changer le mot de passe
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/superadmin/super-admins/${id}`}
                      className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors duration-200"
                    >
                      Annuler
                    </Link>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-6 py-3 bg-[#179150] hover:bg-[#147a43] text-white font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Conseils */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-[#179150]/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-[#179150]" />
                  Conseils
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <User className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Utilisez le nom complet officiel pour une identification facile dans le système.
                  </p>
                </div>
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    L'email sera utilisé pour toutes les communications importantes et la récupération de compte.
                  </p>
                </div>
                <div className="flex items-start">
                  <UserCheck className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    En tant qu'Admin, ces informations sont importantes pour la gestion du système.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Informations importantes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4"
            >
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                    Informations importantes
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Les champs marqués d'un * sont obligatoires</li>
                    <li>• L'email doit être valide et accessible</li>
                    <li>• Les modifications prennent effet immédiatement</li>
                    <li>• Contactez le support en cas de problème</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </form>

      {/* Modal de changement de mot de passe */}
      <AnimatePresence>
        {showPasswordModal && (
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
              className="bg-white dark:bg-gray-800 w-full max-w-md border border-[#179150]"
            >
              <div className="bg-[#179150]/10 px-6 py-4 border-b border-[#179150]/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-[#179150]" />
                    Changer le mot de passe
                  </h3>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="password"
                          value={passwordForm.password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#179150] transition-colors"
                          placeholder="Entrez votre nouveau mot de passe"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#179150] hover:text-[#147a43]"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Minimum 8 caractères avec majuscules, minuscules et chiffres
                      </p>
                    </div>

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
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#179150] transition-colors"
                          placeholder="Confirmez votre nouveau mot de passe"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#179150] hover:text-[#147a43]"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="flex-1 px-4 py-3 bg-[#179150] hover:bg-[#147a43] text-white font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50"
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

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </SuperAdminLayout>
  );
}