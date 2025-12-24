import { AuthContext } from "@/hooks";
import api from "@/services/api";
import React, { useEffect, useState } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Vérifier la cohérence des rôles
  const validateUserRoles = (userData) => {
    if (!userData) return false;

    const roles = [
      userData.is_superadmin,
      userData.is_admin,
      userData.is_employe,
    ];
    const trueCount = roles.filter(Boolean).length;

    // Un utilisateur ne peut avoir qu'un seul rôle
    if (trueCount !== 1) {
      console.error("Incohérence des rôles utilisateur:", userData);
      return false;
    }

    return true;
  };

  const login = async (userData, authToken) => {
    if (authToken && userData) {
      // Valider les rôles avant de connecter
      if (!validateUserRoles(userData)) {
        logout();
        throw new Error("Incohérence dans les rôles utilisateur");
      }

      setToken(authToken);
      setUser(userData);
      localStorage.setItem("token", authToken);

      // Récupérer les données fraîches du profil après connexion
      await fetchUser();
    } else {
      logout();
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Utiliser la route de déconnexion de votre backend si elle existe
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  // Fonction pour récupérer les infos utilisateur depuis l'API
  const fetchUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setUser(null);
      setInitializing(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      const userData = response.data;

      // Valider les rôles
      if (!validateUserRoles(userData)) {
        throw new Error("Incohérence dans les rôles utilisateur");
      }

      setUser(userData);
      setToken(storedToken);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);

      if (error.response?.status === 401) {
        logout();
      } else if (error.message === "Incohérence dans les rôles utilisateur") {
        logout();
      }
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  const refreshUser = () => {
    fetchUser();
  };

  // Déterminer le rôle numérique pour les routes
  const getUserRole = () => {
    if (!user) return null;

    if (user.is_superadmin) return 2; // Super Admin
    if (user.is_admin) return 1; // Admin
    if (user.is_employe) return 0; // Employé

    return null;
  };

  // Initialisation au chargement de l'application
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        await fetchUser();
      } else {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initializing,
        userRole: getUserRole(),
        login,
        logout,
        refreshUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
