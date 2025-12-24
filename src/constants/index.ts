import {
  BarChart3,
  Bell,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  ClockIcon,
  Database,
  File,
  FileText,
  FolderTree,
  LayoutDashboard,
  MessageCircle,
  Network,
  Settings,
  Shield,
  TrendingUp,
  User,
  UserCheck,
  Users,
  XCircleIcon,
} from "lucide-react";

export const adminMenuSections = [
  {
    title: "Tableau de bord",
    items: [{ label: "Dashboard", icon: "📊", path: "/admin/dashboard" }],
  },
  {
    title: "Gestion du personnel",
    items: [
      { label: "Employés", icon: "👥", path: "/admin/employees" },
      { label: "Contrats", icon: "📝", path: "/admin/contracts" },
      { label: "Postes", icon: "💼", path: "/admin/positions" },
    ],
  },
  {
    title: "Gestion des congés",
    items: [
      { label: "Demandes de congés", icon: "🏖️", path: "/admin/leaves" },
      { label: "Solde des congés", icon: "📅", path: "/admin/leave-balance" },
    ],
  },
  {
    title: "Formation & Évaluation",
    items: [
      { label: "Formations", icon: "🎓", path: "/admin/trainings" },
      { label: "Évaluations", icon: "⭐", path: "/admin/evaluations" },
    ],
  },
  {
    title: "Paie & Documents",
    items: [
      { label: "Bulletins de paie", icon: "💰", path: "/admin/payroll" },
      { label: "Documents RH", icon: "📁", path: "/admin/documents" },
    ],
  },
];

export const SuperAdminMenuSections = [
  {
    title: "Tableau de bord",
    items: [
      {
        label: "Vue d'ensemble",
        icon: LayoutDashboard,
        path: "/superadmin/dashboard",
      },
    ],
  },
  {
    title: "Gestion des organisations",
    items: [
      {
        label: "Départements",
        icon: FolderTree,
        path: "/superadmin/departements",
      },
      { label: "Postes", icon: Network, path: "/superadmin/postes" },
    ],
  },
  {
    title: "Gestion des utilisateurs",
    items: [
      {
        label: "Super administrateurs",
        icon: Users,
        path: "/superadmin/super-admins",
      },
      { label: "Administrateurs", icon: Users, path: "/superadmin/admins" },
      { label: "Employes", icon: Users, path: "/superadmin/employes" },
    ],
  },
  {
    title: "Supervision & Audit",
    items: [
      { label: "Formation", icon: FileText, path: "/superadmin/formation" },
      { label: "Evaluation", icon: File, path: "/superadmin/evaluation" },
      { label: "Contrat", icon: Database, path: "/superadmin/contrat" },
      { label: "Demande Congé", icon: BarChart3, path: "/superadmin/conges" },
    ],
  },
];

export const AdminDashboardMenu = [
  { id: "dashboard", name: "Tableau de bord", icon: BarChart3 },
  { id: "employees", name: "Gestion Employés", icon: Users },
  { id: "leaves", name: "Gestion Congés", icon: Calendar },
  { id: "reports", name: "Rapports", icon: FileText },
  { id: "settings", name: "Paramètres", icon: Settings },
];

export const AuthLoginIcons = [
  { icon: Users, text: "Gestion centralisée du personnel", color: "green" },
  { icon: CheckCircle, text: "Processus automatisés", color: "green" },
  { icon: Shield, text: "Données sécurisées", color: "green" },
  { icon: Building, text: "Collaboration optimisée", color: "green" },
];

export const EmployeeDashboardMenu = [
  { id: "dashboard", name: "Tableau de bord", icon: BarChart3 },
  { id: "profile", name: "Mon Profil", icon: User },
  { id: "leaves", name: "Mes Congés", icon: Calendar },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "chatbot", name: "Assistant RH", icon: MessageCircle },
  { id: "settings", name: "Paramètres", icon: Settings },
];

// Statuts et types depuis le backend
export const STATUTS = [
  {
    value: "en_attente",
    label: "En attente",
    icon: ClockIcon,
    color: "yellow",
  },
  { value: "approuve", label: "Approuvé", icon: CheckCircle2, color: "green" },
  { value: "rejete", label: "Rejeté", icon: XCircleIcon, color: "red" },
];

export const TYPES = [
  { value: "annuel", label: "Congé annuel", icon: CalendarDays },
  { value: "maladie", label: "Congé maladie", icon: FileText },
  { value: "sans_solde", label: "Congé sans solde", icon: Calendar },
];

export const badges = {
  actif: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-400",
    label: "Actif",
  },
  inactif: {
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-800 dark:text-gray-300",
    label: "Inactif",
  },
  suspendu: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-800 dark:text-orange-400",
    label: "Suspendu",
  },
  congé: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-400",
    label: "En congé",
  },
};


  export const fonctionnalites = [
    {
      id: 'super-admins',
      title: 'Gestion des Super Administrateurs',
      description: 'Créer, modifier et gérer les comptes super administrateurs',
      icon: Shield,
      color: 'red',
      link: '/superadmin/super-admins',
      available: true
    },
    {
      id: 'admins',
      title: 'Gestion des Administrateurs',
      description: 'Créer, modifier et gérer les comptes administrateurs',
      icon: UserCheck,
      color: 'blue',
      link: '/superadmin/admins',
      available: true
    },
    {
      id: 'departements',
      title: 'Gestion des Départements',
      description: 'Créer et gérer les départements de l\'entreprise',
      icon: Building2,
      color: 'green',
      link: '/superadmin/departements',
      available: true
    },
    {
      id: 'postes',
      title: 'Gestion des Postes',
      description: 'Créer et gérer les postes de travail',
      icon: Briefcase,
      color: 'purple',
      link: '/superadmin/postes',
      available: true
    },
    {
      id: 'employes',
      title: 'Gestion des Employés',
      description: 'Créer, modifier et gérer les employés de l\'entreprise',
      icon: Users,
      color: 'indigo',
      link: '/superadmin/employes',
      available: true
    },
    {
      id: 'conges',
      title: 'Gestion des Demandes de Congé',
      description: 'Approuver, rejeter et suivre les demandes de congé',
      icon: Calendar,
      color: 'yellow',
      link: '/superadmin/conges',
      available: true
    },
    {
      id: 'rapports',
      title: 'Rapports et Statistiques',
      description: 'Consulter les rapports détaillés et les statistiques du système',
      icon: TrendingUp,
      color: 'pink',
      link: '#',
      available: false
    },
    {
      id: 'parametres',
      title: 'Paramètres Système',
      description: 'Configurer les paramètres généraux du système',
      icon: Settings,
      color: 'gray',
      link: '#',
      available: false
    }
  ];
