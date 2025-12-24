import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Key,
  Shield,
  AlertCircle,
  Sun,
  Moon,
  ArrowLeft,
  RefreshCw,
  HeartPulse,
  Building,
} from "lucide-react";
import { useAuth } from "@/hooks";
import api from "@/services/api";
import rhBackground from "@/assets/images/rh-background.jpg";
import { useThemeStore } from "@/store/theme";
import { AuthLoginIcons } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    otp_code: "",
  });
  const [error, setError] = React.useState(null);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    setError(null);
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    // TODO: Sync with backend

    // try {
    //   const res = await api.post("/users/login", form);
    //   if (res.data.message) {
    //     setStep(2);
    //   }
    // } catch (err) {
    //   const response = err.response;
    //   if (response?.status === 422 && response.data?.errors) {
    //     setFieldErrors(response.data.errors);
    //   } else {
    //     setError(err.message || response?.data?.error || "Erreur de connexion");
    //   }
    // } finally {
    //   setIsLoading(false);
    // }

    // Actual mock
    if (form.email === "admin@admin.com" && form.password === "admin") {
      setStep(2);
    } else {
      setError("Email ou mot de passe incorrect");
    }
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {

      // Actual mock

      if (form.otp_code === "123456") navigate("/employe/dashboard");

      // TODO: Sync with backend

      // const res = await api.post("/users/verify-otp", {
      //   email: form.email,
      //   otp_code: form.otp_code,
      // });

      // const { user, tokens } = res.data;
      // await login(user, tokens.access);

      // // Redirection basée sur le rôle
      // if (user.is_superadmin) {
      //   navigate("/superadmin/dashboard");
      // } else if (user.is_admin) {
      //   navigate("/admin/dashboard");
      // } else {
      //   navigate("/employe/dashboard");
      // }
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

  const handleResendOTP = async () => {
    try {
      await api.post("/users/resend-otp", { email: form.email });
      setError(null);
    } catch (err) {
      setError(
        "Erreur lors de l'envoi du code OTP.",
        err.response.data.error || err.message || err
      );
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 relative"
      style={{
        backgroundImage: `url(${rhBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay vert foncé pour mieux faire ressortir le vert de la charte */}
      <div className="absolute inset-0 bg-linear-to-br from-green-900/40 via-black/30 to-green-800/30 backdrop-blur-sm"></div>

      <div className="w-full max-w-4xl mx-4 relative z-10">
        {/* En-tête avec logo et branding RH */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-green-500">
                <HeartPulse className="w-8 h-8 text-green-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                MINSANTE
              </h1>
              <p className="text-lg text-green-300 font-semibold drop-shadow-md">
                Portail Intelligent
              </p>
            </div>
          </div>
          <p className="text-white/90 drop-shadow-lg mb-4 max-w-2xl mx-auto text-lg">
            Solution de gestion des ressources humaines intelligente et
            sécurisée
          </p>
          <div className="inline-flex items-center gap-4">
            <div className="flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm border border-green-300/30">
              <Building className="w-3 h-3 mr-1" />
              MINSANTE
            </div>
            <div className="flex items-center px-3 py-1 rounded-full bg-green-500/40 backdrop-blur-sm text-white text-sm border border-green-400/50">
              <Shield className="w-3 h-3 mr-1" />
              Sécurité RH
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Section informations - visible uniquement sur grand écran */}
          <div className="hidden lg:block">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-green-500/30">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2">
                  Gestion RH Intelligente
                </h3>
                <p className="text-green-200 drop-shadow-md">
                  Automatisez et optimisez vos processus ressources humaines
                </p>
              </div>

              {/* Points forts */}
              <div className="space-y-4">
                {AuthLoginIcons.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-400/30"
                  >
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 border border-green-400/30">
                      <item.icon className="w-4 h-4 text-green-300" />
                    </div>
                    <span className="text-white font-medium drop-shadow-sm">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bénéfices */}
              {/* <div className="mt-8 p-4 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-400/30">
                <h4 className="text-white font-semibold mb-2 text-center">Bénéfices</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    +40% d'efficacité
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    Réduction des délais
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    Meilleure collaboration
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    Décisions éclairées
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Carte de connexion */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-500">
            {/* Barre de progression */}
            <div className="h-1 bg-linear-to-r from-green-500 to-green-700"></div>

            {/* En-tête de la carte */}
            <div className="px-6 py-6 border-b border-green-200 dark:border-green-800 bg-linear-to-r from-green-50 to-white dark:from-green-900/30 dark:to-gray-900">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step === 1
                      ? "Connexion au Portail RH"
                      : "Vérification de Sécurité"}
                  </h2>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {step === 1
                      ? "Accédez à votre espace personnel"
                      : "Authentification à deux facteurs"}
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-colors text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Corps de la carte */}
            <div className="p-6 bg-white dark:bg-gray-900">
              {/* Alerte d'erreur */}
              {error && (
                <div className="flex items-start p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-red-800 dark:text-red-400">
                      Erreur d'authentification
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 1: Email et mot de passe */}
              {step === 1 && (
                <form
                  onSubmit={handleEmailPasswordSubmit}
                  className="space-y-6"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-green-600" />
                        Identifiant professionnel
                      </div>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User
                          className={cn(
                            "w-5 h-5",
                            focusedField === "email"
                              ? "text-green-500"
                              : "text-green-400"
                          )}
                        />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="prenom.nom@minsante.com"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors",
                          fieldErrors.email
                            ? "border-red-500 focus:border-red-500"
                            : focusedField === "email"
                            ? "border-green-500 focus:border-green-500"
                            : "border-green-200 dark:border-green-800 focus:border-green-500",
                          "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        )}
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

                  {/* Mot de passe */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-green-600" />
                        Mot de passe
                      </div>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key
                          className={cn(
                            "w-5 h-5",
                            focusedField === "password"
                              ? "text-green-500"
                              : "text-green-400"
                          )}
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          "w-full pl-10 pr-12 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors",
                          fieldErrors.password
                            ? "border-red-500 focus:border-red-500"
                            : focusedField === "password"
                            ? "border-green-500 focus:border-green-500"
                            : "border-green-200 dark:border-green-800 focus:border-green-500",
                          "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        )}
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
                    {fieldErrors.password && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {fieldErrors.password[0]}
                      </p>
                    )}
                  </div>

                  {/* Bouton de connexion */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none border border-green-500"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Connexion en cours...
                      </div>
                    ) : (
                      "Accéder au Portail RH"
                    )}
                  </button>
                </form>
              )}

              {/* Étape 2: Vérification OTP */}
              {step === 2 && (
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  {/* Instructions */}
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-green-800 dark:text-green-400">
                          Vérification de sécurité requise
                        </div>
                        <div className="text-sm mt-1 text-green-700 dark:text-green-300">
                          Un code de vérification a été envoyé à{" "}
                          <strong>{form.email}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code OTP */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Key className="w-4 h-4 mr-2 text-green-600" />
                        Code de vérification à 6 chiffres
                      </div>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield
                          className={cn(
                            "w-5 h-5",
                            focusedField === "otp_code"
                              ? "text-green-500"
                              : "text-green-400"
                          )}
                        />
                      </div>
                      <input
                        type="text"
                        name="otp_code"
                        placeholder="123456"
                        value={form.otp_code}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("otp_code")}
                        onBlur={() => setFocusedField(null)}
                        maxLength={6}
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 transition-colors",
                          fieldErrors.otp_code
                            ? "border-red-500 focus:border-red-500"
                            : focusedField === "otp_code"
                            ? "border-green-500 focus:border-green-500"
                            : "border-green-200 dark:border-green-800 focus:border-green-500",
                          "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        )}
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

                  {/* Bouton renvoyer OTP */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors flex items-center justify-center mx-auto"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renvoyer le code de vérification
                    </button>
                  </div>

                  {/* Bouton de vérification */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none border border-green-500"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Vérification en cours...
                      </div>
                    ) : (
                      "Vérifier et Accéder"
                    )}
                  </button>

                  {/* Bouton retour */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </button>
                </form>
              )}
            </div>

            {/* Footer de la carte */}
            <div className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center text-green-700 dark:text-green-400">
                  <Shield className="w-4 h-4 mr-1" />
                  Sécurité RH
                </div>
                <div className="flex items-center text-green-700 dark:text-green-400">
                  <HeartPulse className="w-4 h-4 mr-1" />
                  Portail Intelligent
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
    </div>
  );
};

export default Login;
