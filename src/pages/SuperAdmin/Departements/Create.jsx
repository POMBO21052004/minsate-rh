import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../contexts/Layout";
import {
  ArrowLeft,
  Save,
  FolderTree,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Building2,
  FileText,
  User,
  X
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";
import Toast from "../../../components/ui/Toast";

export default function DepartementCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    chef_departement: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    fetchEmployes();
  }, []);

  const fetchEmployes = async () => {
    try {
      const response = await api.get('/users/employe-profiles/');
      setEmployes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setErrors({});

      const submitData = {
        nom: formData.nom,
        description: formData.description || null
      };

      if (formData.chef_departement) {
        submitData.chef_departement = parseInt(formData.chef_departement);
      }

      const response = await api.post('/users/departements/', submitData);

      if (response.data) {
        showToastMessage('Département créé avec succès !', 'success');
        setTimeout(() => {
          navigate('/superadmin/departements');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showToastMessage('Veuillez corriger les erreurs du formulaire', 'error');
      } else {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création du département';
        setError(errorMsg);
        showToastMessage(errorMsg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <Link
              to="/superadmin/departements"
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouveau Département
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Création d'un nouveau département
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alertes */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6 rounded-lg"
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
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="bg-[#179150]/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FolderTree className="w-5 h-5 mr-2 text-[#179150]" />
                    Informations du département
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Nom du département *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.nom
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                      placeholder="Ex: Ressources Humaines"
                      required
                    />
                    {errors.nom && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.nom[0]}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border ${errors.description
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                      placeholder="Description du département..."
                    />
                    {errors.description && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.description[0]}
                      </p>
                    )}
                  </div>

                  {/* Chef de département */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Chef de département
                    </label>
                    <select
                      name="chef_departement"
                      value={formData.chef_departement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#179150] focus:ring-[#179150] transition-colors duration-200 rounded-lg"
                    >
                      <option value="">Sélectionner un employé...</option>
                      {employes.map((employe) => (
                        <option key={employe.id} value={employe.id}>
                          {employe.user?.first_name} {employe.user?.last_name}
                          {employe.matricule && ` (${employe.matricule})`}
                        </option>
                      ))}
                    </select>
                    {errors.chef_departement && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.chef_departement[0]}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Le chef de département peut être assigné plus tard
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700 px-6 pb-6">
                  <div></div>

                  <div className="flex gap-3">
                    <Link
                      to="/superadmin/departements"
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
                          Enregistrer le Département
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
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
                    Conseils
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le nom du département doit être unique
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      La description aide à clarifier le rôle du département
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le chef de département peut être assigné ultérieurement
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </SuperAdminLayout>
  );
}

