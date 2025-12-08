import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import { 
  ArrowLeft, 
  Save, 
  Users,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff,
  X,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";

export default function EmployeCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [departements, setDepartements] = useState([]);
  const [postes, setPostes] = useState([]);
  const [selectedDepartement, setSelectedDepartement] = useState("");

  const [formData, setFormData] = useState({
    // User fields
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    // Employe fields
    matricule: '',
    date_embauche: '',
    date_naissance: '',
    statut: 'actif',
    adresse: '',
    telephone: '',
    poste: ''
  });

  useEffect(() => {
    fetchDepartements();
  }, []);

  useEffect(() => {
    if (selectedDepartement) {
      fetchPostesByDepartement(selectedDepartement);
    } else {
      setPostes([]);
      setFormData(prev => ({ ...prev, poste: '' }));
    }
  }, [selectedDepartement]);

  const fetchDepartements = async () => {
    try {
      const response = await api.get('/users/departements/');
      setDepartements(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    }
  };

  const fetchPostesByDepartement = async (deptId) => {
    try {
      const response = await api.get('/users/postes/');
      const allPostes = response.data || [];
      const deptPostes = allPostes.filter(poste => poste.departement?.toString() === deptId);
      setPostes(deptPostes);
    } catch (error) {
      console.error('Erreur lors du chargement des postes:', error);
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
    
    if (name === 'departement') {
      setSelectedDepartement(value);
      setFormData(prev => ({ ...prev, poste: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
      
      const submitData = {
        // User fields (flat structure)
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        confirm_password: formData.confirm_password,
        // Employe fields
        matricule: formData.matricule,
        date_embauche: formData.date_embauche || null,
        poste_id: formData.poste ? parseInt(formData.poste) : null
      };
      
      const response = await api.post('/users/employes/', submitData);
      
      if (response.data) {
        showToastMessage('Employé créé avec succès !', 'success');
        setTimeout(() => {
          navigate('/superadmin/employes');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showToastMessage('Veuillez corriger les erreurs du formulaire', 'error');
      } else if (err.response?.data) {
        const errorData = err.response.data;
        
        if (typeof errorData === 'object') {
          setErrors(errorData);
          showToastMessage('Erreurs de validation', 'error');
        } else if (errorData.message) {
          setError(errorData.message);
          showToastMessage(errorData.message, 'error');
        } else {
          setError('Erreur lors de la création');
          showToastMessage('Erreur lors de la création', 'error');
        }
        } else {
        const errorMsg = err.response?.data?.message || 'Erreur lors de la création de l\'employe';
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
              to="/superadmin/employes"
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouvel Employé
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Création d'un nouveau compte employé
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
            <div className="lg:col-span-2 space-y-6">
              {/* Informations utilisateur */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="bg-[#179150]/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#179150]" />
                    Informations personnelles
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
                        Nouvel Employé
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20 rounded">
                          <Users className="w-3 h-3 mr-1" />
                          Employé
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

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
                        className={`w-full px-4 py-3 border ${
                          errors.first_name 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        placeholder="Prénom de l'employé"
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
                        className={`w-full px-4 py-3 border ${
                          errors.last_name 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        placeholder="Nom de l'employé"
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
                        className={`w-full px-4 py-3 border ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        placeholder="employe@example.com"
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
                          className={`w-full px-4 py-3 border ${
                            errors.password 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg pr-10`}
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
                        Minimum 8 caractères
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
                          className={`w-full px-4 py-3 border ${
                            errors.confirm_password 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg pr-10`}
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
                </div>
              </motion.div>

              {/* Informations employé */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Informations professionnelles
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Matricule *
                      </label>
                      <input
                        type="text"
                        name="matricule"
                        value={formData.matricule}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.matricule 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        placeholder="EMP001"
                        required
                      />
                      {errors.matricule && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.matricule[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date d'embauche *
                      </label>
                      <input
                        type="date"
                        name="date_embauche"
                        value={formData.date_embauche}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.date_embauche 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
                        required
                      />
                      {errors.date_embauche && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.date_embauche[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        name="date_naissance"
                        value={formData.date_naissance}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Statut *
                      </label>
                      <select
                        name="statut"
                        value={formData.statut}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg"
                        required
                      >
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                        <option value="suspendu">Suspendu</option>
                        <option value="congé">En congé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Département
                      </label>
                      <select
                        name="departement"
                        value={selectedDepartement}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg"
                      >
                        <option value="">Sélectionner un département...</option>
                        {departements.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.nom}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sélectionnez d'abord un département pour voir les postes disponibles
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Poste
                      </label>
                      <select
                        name="poste"
                        value={formData.poste}
                        onChange={handleInputChange}
                        disabled={!selectedDepartement}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Sélectionner un poste...</option>
                        {postes.map((poste) => (
                          <option key={poste.id} value={poste.id}>
                            {poste.titre}
                          </option>
                        ))}
                      </select>
                      {!selectedDepartement && (
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                          Veuillez d'abord sélectionner un département
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg"
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Adresse
                      </label>
                      <textarea
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg"
                        placeholder="Adresse complète..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div></div>
                <div className="flex gap-3">
                  <Link
                    to="/superadmin/employes"
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
                        Enregistrer l'Employé
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Conseils */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
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
                      Le matricule doit être unique
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sélectionnez d'abord le département puis le poste
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le statut peut être modifié ultérieurement
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

