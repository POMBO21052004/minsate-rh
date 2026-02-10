import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

// Gerer par le personnel
import PersonnelDashboard from "../pages/Personnel/Dashboard";
import PersonnelProfile from "../pages/Personnel/Profil/Index";
import PersonnelProfileEdit from "../pages/Personnel/Profil/Edit";
import CongesList from "../pages/Personnel/Conges/Index";
import CongesShow from "../pages/Personnel/Conges/Show";
import CongesEdit from "../pages/Personnel/Conges/Edit";

// Gerer par les admins
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminProfile from "../pages/Admin/Profil/Index";
import AdminProfileEdit from "../pages/Admin/Profil/Edit";

// Gerer par les super admins
import SuperAdminDashboard from "../pages/SuperAdmin/Dashboard";

import SuperAdminProfile from "../pages/SuperAdmin/Profil/Index";
import SuperAdminProfileEdit from "../pages/SuperAdmin/Profil/Edit";

import SuperAdminList from "../pages/SuperAdmin/SuperAdmin/Index";
import SuperAdminView from "../pages/SuperAdmin/SuperAdmin/Show";
import SuperAdminEdit from "../pages/SuperAdmin/SuperAdmin/Edit";
import SuperAdminCreate from "../pages/SuperAdmin/SuperAdmin/Create";

import AdminList from "../pages/SuperAdmin/Admin/Index";
import AdminView from "../pages/SuperAdmin/Admin/Show";
import AdminEdit from "../pages/SuperAdmin/Admin/Edit";
import AdminCreate from "../pages/SuperAdmin/Admin/Create";

import DepartementList from "../pages/SuperAdmin/Departements/Index";
import DepartementView from "../pages/SuperAdmin/Departements/Show";
import DepartementEdit from "../pages/SuperAdmin/Departements/Edit";
import DepartementCreate from "../pages/SuperAdmin/Departements/Create";

import PosteList from "../pages/SuperAdmin/Postes/Index";
import PosteView from "../pages/SuperAdmin/Postes/Show";
import PosteEdit from "../pages/SuperAdmin/Postes/Edit";
import PosteCreate from "../pages/SuperAdmin/Postes/Create";

import PersonnelList from "../pages/SuperAdmin/Personnel/Index";
import PersonnelView from "../pages/SuperAdmin/Personnel/Show";
import PersonnelEdit from "../pages/SuperAdmin/Personnel/Edit";
import PersonnelCreate from "../pages/SuperAdmin/Personnel/Create";
import DepartementPersonnel from "../pages/SuperAdmin/Personnel/DepartementPersonnel";

import CongeList from "../pages/SuperAdmin/Conges/Index";
import CongeView from "../pages/SuperAdmin/Conges/Show";

import AuditList from "../pages/SuperAdmin/Audit/Index";

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

// Autres
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<PublicRoute> <Login /> </PublicRoute>} />
        <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute> <ForgotPassword /> </PublicRoute>} />

        {/* Protégées */}

        {/* Personnel */}
        <Route path="/personnel/dashboard" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />
        <Route path="/personnel/profile" element={<PrivateRoute allowedRoles={[0]}> <PersonnelProfile /> </PrivateRoute>} />
        <Route path="/personnel/profile/edit" element={<PrivateRoute allowedRoles={[0]}> <PersonnelProfileEdit /> </PrivateRoute>} />
        <Route path="/personnel/conges" element={<PrivateRoute allowedRoles={[0]}> <CongesList /> </PrivateRoute>} />
        <Route path="/personnel/conges/:id" element={<PrivateRoute allowedRoles={[0]}> <CongesShow /> </PrivateRoute>} />
        <Route path="/personnel/conges/:id/edit" element={<PrivateRoute allowedRoles={[0]}> <CongesEdit /> </PrivateRoute>} />

        {/* Routes RH Personnel (Placeholders) */}
        <Route path="/personnel/presences" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />
        <Route path="/personnel/heures-sup" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />
        <Route path="/personnel/formations" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />
        <Route path="/personnel/evaluations" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />
        <Route path="/personnel/documents" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />
        <Route path="/personnel/contrats" element={<PrivateRoute allowedRoles={[0]}> <PersonnelDashboard /> </PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={[1]}> <AdminDashboard /> </PrivateRoute>} />
        <Route path="/admin/profile" element={<PrivateRoute allowedRoles={[1]}> <AdminProfile /> </PrivateRoute>} />
        <Route path="/admin/profile/edit" element={<PrivateRoute allowedRoles={[1]}> <AdminProfileEdit /> </PrivateRoute>} />

        {/*Super Admin */}
        <Route path="/superadmin/dashboard" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminDashboard /> </PrivateRoute>} />

        <Route path="/superadmin/profile" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminProfile /> </PrivateRoute>} />
        <Route path="/superadmin/profile/edit" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminProfileEdit /> </PrivateRoute>} />

        <Route path="/superadmin/super-admins" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminList /> </PrivateRoute>} />
        <Route path="/superadmin/super-admins/create" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminCreate /> </PrivateRoute>} />
        <Route path="/superadmin/super-admins/:id" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminView /> </PrivateRoute>} />
        <Route path="/superadmin/super-admins/:id/edit" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminEdit /> </PrivateRoute>} />

        <Route path="/superadmin/admins" element={<PrivateRoute allowedRoles={[2]}> <AdminList /> </PrivateRoute>} />
        <Route path="/superadmin/admins/create" element={<PrivateRoute allowedRoles={[2]}> <AdminCreate /> </PrivateRoute>} />
        <Route path="/superadmin/admins/:id" element={<PrivateRoute allowedRoles={[2]}> <AdminView /> </PrivateRoute>} />
        <Route path="/superadmin/admins/:id/edit" element={<PrivateRoute allowedRoles={[2]}> <AdminEdit /> </PrivateRoute>} />

        <Route path="/superadmin/departements" element={<PrivateRoute allowedRoles={[2]}> <DepartementList /> </PrivateRoute>} />
        <Route path="/superadmin/departements/create" element={<PrivateRoute allowedRoles={[2]}> <DepartementCreate /> </PrivateRoute>} />
        <Route path="/superadmin/departements/:id" element={<PrivateRoute allowedRoles={[2]}> <DepartementView /> </PrivateRoute>} />
        <Route path="/superadmin/departements/:id/edit" element={<PrivateRoute allowedRoles={[2]}> <DepartementEdit /> </PrivateRoute>} />

        <Route path="/superadmin/postes" element={<PrivateRoute allowedRoles={[2]}> <PosteList /> </PrivateRoute>} />
        <Route path="/superadmin/postes/create" element={<PrivateRoute allowedRoles={[2]}> <PosteCreate /> </PrivateRoute>} />
        <Route path="/superadmin/postes/:id" element={<PrivateRoute allowedRoles={[2]}> <PosteView /> </PrivateRoute>} />
        <Route path="/superadmin/postes/:id/edit" element={<PrivateRoute allowedRoles={[2]}> <PosteEdit /> </PrivateRoute>} />

        <Route path="/superadmin/personnel" element={<PrivateRoute allowedRoles={[2]}> <PersonnelList /> </PrivateRoute>} />
        <Route path="/superadmin/personnel/create" element={<PrivateRoute allowedRoles={[2]}> <PersonnelCreate /> </PrivateRoute>} />
        <Route path="/superadmin/personnel/departement/:id" element={<PrivateRoute allowedRoles={[2]}> <DepartementPersonnel /> </PrivateRoute>} />
        <Route path="/superadmin/personnel/:id" element={<PrivateRoute allowedRoles={[2]}> <PersonnelView /> </PrivateRoute>} />
        <Route path="/superadmin/personnel/:id/edit" element={<PrivateRoute allowedRoles={[2]}> <PersonnelEdit /> </PrivateRoute>} />

        <Route path="/superadmin/conges" element={<PrivateRoute allowedRoles={[2]}> <CongeList /> </PrivateRoute>} />
        <Route path="/superadmin/conges/:id" element={<PrivateRoute allowedRoles={[2]}> <CongeView /> </PrivateRoute>} />

        <Route path="/superadmin/audit" element={<PrivateRoute allowedRoles={[2]}> <AuditList /> </PrivateRoute>} />

        {/* Catch-all pour les routes inexistantes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
