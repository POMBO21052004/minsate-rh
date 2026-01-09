import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../../contexts/Layout";
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
import Toast from "../../../components/ui/Toast";

export default function EmployeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [departements, setDepartements] = useState([]);
  const [postes, setPostes] = useState([]);
  const [selectedDepartement, setSelectedDepartement] = useState("");

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    matricule: '',
    date_embauche: '',
    date_naissance: '',
    statut: 'actif',
    adresse: '',
    telephone: '',
    poste: ''
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
    fetchEmploye();
    fetchDepartements();
  }, [id]);

  useEffect(() => {
    if (selectedDepartement) {
      fetchPostesByDepartement(selectedDepartement);
    } else if (employe?.poste_details?.departement) {
      setSelectedDepartement(employe.poste_details.departement.toString());
    }
  }, [selectedDepartement, employe]);

  const fetchEmploye = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/employe-profiles/${id}/`);
      const empData = response.data;
      setEmploye(empData);

      setFormData({
        first_name: empData.user?.first_name || '',
        last_name: empData.user?.last_name || '',
        email: empData.user?.email || '',
        matricule: empData.matricule || '',
        date_embauche: empData.date_embauche ? empData.date_embauche.split('T')[0] : '',
        date_naissance: empData.date_naissance ? empData.date_naissance.split('T')[0] : '',
        statut: empData.statut || 'actif',
        adresse: empData.adresse || '',
        telephone: empData.telephone || '',
        poste: empData.poste?.toString() || ''
      });

      if (empData.poste_details?.departement) {
        setSelectedDepartement(empData.poste_details.departement.toString());
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'employé:', error);
      showToastMessage('Erreur lors du chargement de l\'employé', 'error');
    } finally {
      setLoading(false);
    }
  };

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

      const submitData = {
        user: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email
        },
        matricule: formData.matricule,
        date_embauche: formData.date_embauche || null,
        date_naissance: formData.date_naissance || null,
        statut: formData.statut,
        adresse: formData.adresse || null,
        telephone: formData.telephone || null,
        poste: formData.poste ? parseInt(formData.poste) : null
      };

      const response = await api.put(`/users/employe-profiles/${id}/`, submitData);

      if (response.data) {
        showToastMessage('Employé modifié avec succès !', 'success');
        setTimeout(() => {
          navigate(`/superadmin/employes/${id}`);
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showToastMessage('Veuillez corriger les erreurs du formulaire', 'error');
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la modification de l\'employé');
        showToastMessage(err.response?.data?.message || 'Erreur lors de la modification de l\'employé', 'error');
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
      await api.put(`/users/employe-profiles/${id}/password/`, {
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de l'employé...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!employe) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Employé non trouvé
          </h3>
          <Link
            to="/superadmin/employes"
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
      <div className="space-y-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <Link
              to={`/superadmin/employes/${id}`}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Modifier l'Employé
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Mettez à jour les informations de l'employé
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
                          <Users className="w-3 h-3 mr-1" />
                          Employé
                        </span>
                        {employe.user?.is_verified && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20 ml-2 rounded">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Vérifié
                          </span>
                        )}
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
                        className={`w-full px-4 py-3 border ${errors.first_name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
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
                        required
                      />
                      {errors.email && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.email[0]}
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
                        className={`w-full px-4 py-3 border ${errors.matricule
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 rounded-lg`}
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
                        className={`w-full px-4 py-3 border ${errors.date_embauche
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
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center px-6 py-3 bg-[#179150]/10 hover:bg-[#179150]/20 text-[#179150] font-medium transition-colors duration-200 rounded-lg"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Changer le mot de passe
                  </button>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/superadmin/employes/${id}`}
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
                        Enregistrer les modifications
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
                      Le matricule doit rester unique
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vous pouvez modifier le département et le poste
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le statut peut être changé à tout moment
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de changement de mot de passe */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#179150] transition-colors rounded-lg pr-10"
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
                      Minimum 8 caractères
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#179150] transition-colors rounded-lg pr-10"
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
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors duration-200 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex-1 px-4 py-3 bg-[#179150] hover:bg-[#147a43] text-white font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 rounded-lg"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </SuperAdminLayout>
  );
}

