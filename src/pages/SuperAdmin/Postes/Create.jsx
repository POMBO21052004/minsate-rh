import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import { 
  ArrowLeft, 
  Save, 
  Briefcase,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Building2,
  FileText,
  DollarSign,
  X
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function PosteCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    salaire_de_base: '',
    departement: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    fetchDepartements();
  }, []);

  const fetchDepartements = async () => {
    try {
      const response = await api.get('/users/departements/');
      setDepartements(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
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
        titre: formData.titre,
        description: formData.description || null,
        salaire_de_base: parseFloat(formData.salaire_de_base) || 0
      };
      
      if (formData.departement) {
        submitData.departement = parseInt(formData.departement);
      }
      
      const response = await api.post('/users/postes/', submitData);
      
      if (response.data) {
        showToastMessage('Poste créé avec succès !', 'success');
        setTimeout(() => {
          navigate('/superadmin/postes');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showToastMessage('Veuillez corriger les erreurs du formulaire', 'error');
      } else {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création du poste';
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
              to="/superadmin/postes"
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouveau Poste
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Création d'un nouveau poste
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
                    <Briefcase className="w-5 h-5 mr-2 text-[#179150]" />
                    Informations du poste
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Titre du poste *
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.titre 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                      placeholder="Ex: Développeur Full Stack"
                      required
                    />
                    {errors.titre && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.titre[0]}
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
                      className={`w-full px-4 py-3 border ${
                        errors.description 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                      placeholder="Description du poste..."
                    />
                    {errors.description && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.description[0]}
                      </p>
                    )}
                  </div>

                  {/* Département */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Département
                    </label>
                    <select
                      name="departement"
                      value={formData.departement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#179150] focus:ring-[#179150] transition-colors duration-200 rounded-lg"
                    >
                      <option value="">Sélectionner un département...</option>
                      {departements.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.nom}
                        </option>
                      ))}
                    </select>
                    {errors.departement && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.departement[0]}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Le département peut être assigné plus tard
                    </p>
                  </div>

                  {/* Salaire de base */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Salaire de base *
                    </label>
                    <input
                      type="number"
                      name="salaire_de_base"
                      value={formData.salaire_de_base}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 border ${
                        errors.salaire_de_base 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                      placeholder="0.00"
                      required
                    />
                    {errors.salaire_de_base && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.salaire_de_base[0]}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Montant en FCFA (XAF)
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700 px-6 pb-6">
                  <div></div>
                  
                  <div className="flex gap-3">
                    <Link
                      to="/superadmin/postes"
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
                          Enregistrer le Poste
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
                      Le titre doit être clair et descriptif
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      La description aide à clarifier les responsabilités
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le salaire de base est en FCFA (XAF)
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le département peut être assigné ultérieurement
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
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
    </SuperAdminLayout>
  );
}

