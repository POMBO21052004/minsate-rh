import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Key, Shield, AlertCircle, Sun, Moon, CheckCircle, ArrowLeft, RefreshCw, Users, Building } from "lucide-react";
import api from "../../services/api";

import rhBackground from "../../assets/images/rh-background.jpg";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Nouveau mot de passe
    const [form, setForm] = useState({
        email: "",
        otp_code: "",
        new_password: "",
        confirm_password: ""
    });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [theme, setTheme] = useState("light");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        setError(null);
    };

    // Étape 1: Demande de réinitialisation
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        try {
            const res = await api.post("/users/forgot-password/request/", { email: form.email });
            if (res.data.message) {
                setStep(2);
            }
        } catch (err) {
            const response = err.response;
            if (response?.status === 400 && response.data) {
                // Handle validation errors
                if (response.data.non_field_errors) {
                    setError(response.data.non_field_errors[0]);
                } else if (response.data.email) {
                    setFieldErrors({ email: response.data.email });
                } else {
                    setError(response.data.error || "Erreur lors de l'envoi du code");
                }
            } else {
                setError(response?.data?.error || "Erreur lors de l'envoi du code");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Étape 2: Vérification OTP
    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        try {
            const res = await api.post("/users/forgot-password/verify-otp/", {
                email: form.email,
                otp_code: form.otp_code
            });

            if (res.data.message) {
                setStep(3);
            }
        } catch (err) {
            const response = err.response;
            if (response?.status === 422 && response.data?.errors) {
                setFieldErrors(response.data.errors);
            } else {
                setError(response?.data?.error || "Code OTP invalide");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Étape 3: Nouveau mot de passe
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        if (form.new_password !== form.confirm_password) {
            setError("Les mots de passe ne correspondent pas");
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post("/users/forgot-password/reset/", {
                email: form.email,
                otp_code: form.otp_code,
                new_password: form.new_password,
                confirm_password: form.confirm_password
            });

            if (res.data.message) {
                // Redirection vers login après succès
                navigate("/login", { state: { message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter." } });
            }
        } catch (err) {
            const response = err.response;
            if (response?.status === 422 && response.data?.errors) {
                setFieldErrors(response.data.errors);
            } else {
                setError(response?.data?.error || "Erreur lors de la réinitialisation");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError(null);
        try {
            await api.post("/users/forgot-password/resend-otp/", { email: form.email });
            // Optionally show a success message
        } catch (err) {
            const response = err.response;
            setError(response?.data?.error || response?.data?.non_field_errors?.[0] || "Erreur lors de l'envoi du code OTP");
        }
    };

    const toggleTheme = () => {
        const html = document.documentElement;
        html.classList.toggle("dark");
        const newTheme = html.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-8 relative"
            style={{
                backgroundImage: `url(${rhBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-black/30 to-green-800/30 backdrop-blur-sm"></div>

            <div className="w-full max-w-md mx-4 relative z-10">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-green-500">
                                <Lock className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">Réinitialisation</h1>
                    <p className="text-white/90 drop-shadow-lg">
                        {step === 1 && "Récupérez l'accès à votre compte"}
                        {step === 2 && "Vérification de sécurité"}
                        {step === 3 && "Nouveau mot de passe"}
                    </p>
                </div>

                {/* Carte de réinitialisation */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-500">
                    {/* Barre de progression */}
                    <div className="h-1 bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>

                    {/* En-tête de la carte */}
                    <div className="px-6 py-6 border-b border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-white dark:from-green-900/30 dark:to-gray-900">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {step === 1 && "Mot de passe oublié"}
                                    {step === 2 && "Code de vérification"}
                                    {step === 3 && "Nouveau mot de passe"}
                                </h2>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Étape {step} sur 3
                                </p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg transition-colors text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="p-6 bg-white dark:bg-gray-900">
                        {/* Alerte d'erreur */}
                        {error && (
                            <div className="flex items-start p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-medium text-red-800 dark:text-red-400">Erreur</div>
                                    <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</div>
                                </div>
                            </div>
                        )}

                        {/* Étape 1: Email */}
                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-start">
                                        <Mail className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-green-800 dark:text-green-400">
                                                Entrez votre email professionnel
                                            </div>
                                            <div className="text-sm mt-1 text-green-700 dark:text-green-300">
                                                Un code de vérification sera envoyé à votre adresse email
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-green-600" />
                                            Email professionnel
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className={`w-5 h-5 ${focusedField === 'email'
                                                ? 'text-green-500'
                                                : 'text-green-400'
                                                }`} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="prenom.nom@minsante.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors ${fieldErrors.email
                                                ? 'border-red-500 focus:border-red-500'
                                                : focusedField === 'email'
                                                    ? 'border-green-500 focus:border-green-500'
                                                    : 'border-green-200 dark:border-green-800 focus:border-green-500'
                                                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                            required
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {fieldErrors.email[0]}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none border border-green-500"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Envoi en cours...
                                        </div>
                                    ) : (
                                        "Envoyer le code"
                                    )}
                                </button>

                                <Link
                                    to="/login"
                                    className="w-full border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour à la connexion
                                </Link>
                            </form>
                        )}

                        {/* Étape 2: Vérification OTP */}
                        {step === 2 && (
                            <form onSubmit={handleOTPSubmit} className="space-y-6">
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-start">
                                        <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-green-800 dark:text-green-400">
                                                Code envoyé à votre email
                                            </div>
                                            <div className="text-sm mt-1 text-green-700 dark:text-green-300">
                                                Vérifiez votre boîte mail: <strong>{form.email}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <Key className="w-4 h-4 mr-2 text-green-600" />
                                            Code de vérification à 6 chiffres
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className={`w-5 h-5 ${focusedField === 'otp_code'
                                                ? 'text-green-500'
                                                : 'text-green-400'
                                                }`} />
                                        </div>
                                        <input
                                            type="text"
                                            name="otp_code"
                                            placeholder="123456"
                                            value={form.otp_code}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('otp_code')}
                                            onBlur={() => setFocusedField(null)}
                                            maxLength={6}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors ${fieldErrors.otp_code
                                                ? 'border-red-500 focus:border-red-500'
                                                : focusedField === 'otp_code'
                                                    ? 'border-green-500 focus:border-green-500'
                                                    : 'border-green-200 dark:border-green-800 focus:border-green-500'
                                                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                            required
                                        />
                                    </div>
                                    {fieldErrors.otp_code && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {fieldErrors.otp_code[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors flex items-center justify-center mx-auto"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Renvoyer le code
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none border border-green-500"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Vérification...
                                        </div>
                                    ) : (
                                        "Vérifier le code"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour
                                </button>
                            </form>
                        )}

                        {/* Étape 3: Nouveau mot de passe */}
                        {step === 3 && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-green-800 dark:text-green-400">
                                                Code vérifié avec succès
                                            </div>
                                            <div className="text-sm mt-1 text-green-700 dark:text-green-300">
                                                Définissez maintenant votre nouveau mot de passe
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <Lock className="w-4 h-4 mr-2 text-green-600" />
                                            Nouveau mot de passe
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className={`w-5 h-5 ${focusedField === 'new_password'
                                                ? 'text-green-500'
                                                : 'text-green-400'
                                                }`} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="new_password"
                                            placeholder="••••••••"
                                            value={form.new_password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('new_password')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors ${fieldErrors.new_password
                                                ? 'border-red-500 focus:border-red-500'
                                                : focusedField === 'new_password'
                                                    ? 'border-green-500 focus:border-green-500'
                                                    : 'border-green-200 dark:border-green-800 focus:border-green-500'
                                                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-600 dark:hover:text-green-300"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.new_password && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {fieldErrors.new_password[0]}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Minimum 8 caractères
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <Lock className="w-4 h-4 mr-2 text-green-600" />
                                            Confirmer le mot de passe
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className={`w-5 h-5 ${focusedField === 'confirm_password'
                                                ? 'text-green-500'
                                                : 'text-green-400'
                                                }`} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirm_password"
                                            placeholder="••••••••"
                                            value={form.confirm_password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirm_password')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors ${fieldErrors.confirm_password
                                                ? 'border-red-500 focus:border-red-500'
                                                : focusedField === 'confirm_password'
                                                    ? 'border-green-500 focus:border-green-500'
                                                    : 'border-green-200 dark:border-green-800 focus:border-green-500'
                                                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-600 dark:hover:text-green-300"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.confirm_password && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {fieldErrors.confirm_password[0]}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none border border-green-500"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Réinitialisation...
                                        </div>
                                    ) : (
                                        "Réinitialiser le mot de passe"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 border-t border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <div className="flex items-center text-green-700 dark:text-green-400">
                                <Shield className="w-4 h-4 mr-1" />
                                Sécurité RH
                            </div>
                            <div className="flex items-center text-green-700 dark:text-green-400">
                                <Building className="w-4 h-4 mr-1" />
                                MINSANTE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
