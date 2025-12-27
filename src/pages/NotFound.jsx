import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Icône d'erreur */}
      <div className="mb-8 relative">
        <div className="relative">
          <AlertTriangle className="w-24 h-24 text-red-500 mx-auto" />
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 blur-xl"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto">
        {/* Code d'erreur */}
        <h1 className="text-8xl font-bold text-red-500 mb-4 tracking-tighter">
          404
        </h1>

        {/* Titre */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page introuvable
        </h2>

        {/* Message d'erreur */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Oups ! La page que vous recherchez semble s'être égarée. Elle a
          peut-être été déplacée, supprimée ou n'a jamais existé.
        </p>

        {/* Bouton de retour */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <Home className="w-5 h-5 mr-3" />
          Retour à l'accueil
        </Link>

        {/* Lien de support */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Besoin d'aide ?{" "}
            <a
              href="/support"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200"
            >
              Contactez le support
            </a>
          </p>
        </div>
      </div>

      {/* Design décoratif */}
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-10 right-10 w-16 h-16 bg-red-200 dark:bg-red-900 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-xl"></div>
    </div>
  );
}
