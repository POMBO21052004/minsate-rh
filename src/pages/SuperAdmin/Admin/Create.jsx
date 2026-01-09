import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  X,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";
import Toast from "../../../components/ui/Toast";

export default function AdminCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      showToastMessage('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setErrors({});

      const response = await api.post('/users/admins/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password
      });

      if (response.data) {
        showToastMessage('Administrateur créé avec succès !', 'success');
        setTimeout(() => {
          navigate('/superadmin/admins');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showToastMessage('Veuillez corriger les erreurs du formulaire', 'error');
      } else {
        const errorMsg = err.response?.data?.message || 'Erreur lors de la création de l\'administrateur';
        setError(errorMsg);
        showToastMessage(errorMsg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

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
              to="/superadmin/admins"
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouvel Administrateur
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Création d'un nouveau compte administrateur
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
                  Informations du nouvel administrateur
                </h2>
              </div>

              <div className="p-6">
                {/* Avatar placeholder */}
                <div className="flex items-center mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#179150] to-[#147a43] flex items-center justify-center text-white font-bold text-lg mr-4 rounded-lg">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Nouvel Administrateur
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20 rounded">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Administrateur
                      </span>
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
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
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
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
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
                      placeholder="admin@minsante.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.email[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        placeholder="Mot de passe sécurisé"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.password[0]}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum 8 caractères avec majuscules, minuscules et chiffres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.confirm_password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        placeholder="Confirmez le mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.confirm_password[0]}
                      </p>
                    )}
                  </div>
                </div>

                <hr className="my-4" />

                {/* Informations système */}
                <div className="mt-8 p-4 bg-[#179150]/10 border border-[#179150]/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-[#179150] mb-2 flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Informations système (non modifiables)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#179150] font-medium">Rôle :</span>
                      <span className="ml-2 text-[#147a43] font-semibold">Administrateur</span>
                    </div>
                    <div>
                      <span className="text-[#179150] font-medium">Statut :</span>
                      <span className="ml-2 text-[#147a43] font-semibold">Activé automatiquement</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                  <div></div>

                  <div className="flex gap-3">
                    <Link
                      to="/superadmin/admins"
                      className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200 rounded-lg"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Link>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-6 py-3 bg-[#179150] hover:bg-[#147a43] text-white font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 rounded-lg"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Enregistrer l'Administrateur
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
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Conseils - Admin
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Les administrateurs ont accès aux fonctionnalités de gestion
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    L'email doit être unique et sera utilisé pour la connexion
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Le mot de passe doit être sécurisé et confidentiel
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Permissions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Permissions Administrateur
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gestion des employés et des congés
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accès aux rapports et statistiques
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Validation des demandes de congé
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gestion des départements et postes
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </form>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </SuperAdminLayout>
  );
}