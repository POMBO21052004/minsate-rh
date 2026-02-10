import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AdminLayout from "../../../layouts/Admin/Layout";
import {
    User,
    Mail,
    Shield,
    Edit3,
    ArrowLeft,
    Save,
    Lock,
    AlertCircle,
    CheckCircle,
    HelpCircle,
    BadgeCheck,
    X,
    Info
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../services/api";
import Toast from "../../../components/ui/Toast";

export default function AdminProfileEdit() {
    const { user: authUser, updateUser } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errors, setErrors] = useState({});

    // États pour les notifications toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/profile/');
                const userData = response.data;
                setUser(userData);

                setFormData({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || ''
                });
            } catch (err) {
                showToastMessage('Erreur lors du chargement du profil', 'error');
                console.error('Erreur profil:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

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

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            setErrors({});

            const response = await api.put('/users/profile/update/', formData);

            if (response.data) {
                showToastMessage('Profil mis à jour avec succès !', 'success');

                if (updateUser) {
                    updateUser(response.data);
                }

                setTimeout(() => {
                    navigate('/admin/profile');
                }, 2000);
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                showToastMessage('Veuillez corriger les erreurs du formulaire', 'error');
            } else {
                const errorMsg = err.response?.data?.message || 'Erreur lors de la mise à jour du profil';
                setError(errorMsg);
                showToastMessage(errorMsg, 'error');
            }
        } finally {
            setSaving(false);
        }
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

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const roleInfo = getRoleDisplay(user);

    return (
        <AdminLayout>
            {/* En-tête */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
            >
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Modifier mon profil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mettez à jour vos informations personnelles
                    </p>
                </div>
                <Link
                    to="/admin/profile"
                    className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour au profil
                </Link>
            </motion.div>

            {/* Alertes */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
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
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
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
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#179150] to-[#147a43] rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                                        {formData.first_name?.charAt(0) || 'S'}{formData.last_name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {formData.first_name} {formData.last_name}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20`}>
                                                <BadgeCheck className="w-3 h-3 mr-1" />
                                                {roleInfo.label}
                                            </span>
                                            {user?.is_verified && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#179150]/10 text-[#179150] border border-[#179150]/20 ml-2">
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
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.first_name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
                                            placeholder="Votre prénom"
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
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.last_name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
                                            placeholder="Votre nom"
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
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.email
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-[#179150] focus:ring-[#179150]'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
                                            placeholder="votre@email.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                                {errors.email[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Informations non modifiables */}
                                <div className="mt-8 p-4 bg-[#179150]/10 rounded-lg border border-[#179150]/20">
                                    <h4 className="text-sm font-semibold text-[#179150] mb-2 flex items-center">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Informations système (non modifiables)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-[#179150] font-medium">Rôle :</span>
                                            <span className="ml-2 text-[#147a43] font-semibold">{roleInfo.label}</span>
                                        </div>
                                        <div>
                                            <span className="text-[#179150] font-medium">Statut vérification :</span>
                                            <span className={`ml-2 font-semibold ${user?.is_verified ? 'text-[#179150]' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {user?.is_verified ? 'Vérifié' : 'En attente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                                    <div></div>

                                    <div className="flex gap-3">
                                        <Link
                                            to="/admin/profile"
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
                        </motion.div>
                    </div>

                    {/* Colonne latérale */}
                    <div className="space-y-6">
                        {/* Conseils */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
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
                                        Utilisez votre nom complet officiel pour une identification facile dans le système.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Votre email sera utilisé pour toutes les communications importantes et la récupération de compte.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#179150] mr-3 mt-1 flex-shrink-0" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        En tant qu'Admin, vos informations sont importantes pour la gestion du système.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Informations importantes */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                        >
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                                        Informations importantes
                                    </h4>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                        <li>• Les champs marqués d'un * sont obligatoires</li>
                                        <li>• Votre email doit être valide et accessible</li>
                                        <li>• Les modifications prennent effet immédiatement</li>
                                        <li>• Contactez le support en cas de problème</li>
                                    </ul>
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
        </AdminLayout>
    );
}
