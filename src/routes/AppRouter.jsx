import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

// Gerer par les employes
import EmployeeDashboard from "../pages/Employe/Dashboard";
import EmployeeProfile from "../pages/Employe/Profil/Index";
import EmployeeProfileEdit from "../pages/Employe/Profil/Edit";
import CongesList from "../pages/Employe/Conges/Index";
import CongesShow from "../pages/Employe/Conges/Show";
import CongesEdit from "../pages/Employe/Conges/Edit";

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

import EmployeList from "../pages/SuperAdmin/Employes/Index";
import EmployeView from "../pages/SuperAdmin/Employes/Show";
import EmployeEdit from "../pages/SuperAdmin/Employes/Edit";
import EmployeCreate from "../pages/SuperAdmin/Employes/Create";
import DepartementEmployes from "../pages/SuperAdmin/Employes/DepartementEmployes";

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

        {/* Employe */}
        <Route path="/employe/dashboard" element={<PrivateRoute allowedRoles={[0]}> <EmployeeDashboard /> </PrivateRoute>} />
        <Route path="/employe/profile" element={<PrivateRoute allowedRoles={[0]}> <EmployeeProfile /> </PrivateRoute>} />
        <Route path="/employe/profile/edit" element={<PrivateRoute allowedRoles={[0]}> <EmployeeProfileEdit /> </PrivateRoute>} />
        <Route path="/employe/conges" element={<PrivateRoute allowedRoles={[0]}> <CongesList /> </PrivateRoute>} />
        <Route path="/employe/conges/:id" element={<PrivateRoute allowedRoles={[0]}> <CongesShow /> </PrivateRoute>} />
        <Route path="/employe/conges/:id/edit" element={<PrivateRoute allowedRoles={[0]}> <CongesEdit /> </PrivateRoute>} />

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

        <Route path="/superadmin/employes" element={<PrivateRoute allowedRoles={[2]}> <EmployeList /> </PrivateRoute>} />
        <Route path="/superadmin/employes/create" element={<PrivateRoute allowedRoles={[2]}> <EmployeCreate /> </PrivateRoute>} />
        <Route path="/superadmin/employes/departement/:id" element={<PrivateRoute allowedRoles={[2]}> <DepartementEmployes /> </PrivateRoute>} />
        <Route path="/superadmin/employes/:id" element={<PrivateRoute allowedRoles={[2]}> <EmployeView /> </PrivateRoute>} />
        <Route path="/superadmin/employes/:id/edit" element={<PrivateRoute allowedRoles={[2]}> <EmployeEdit /> </PrivateRoute>} />

        <Route path="/superadmin/conges" element={<PrivateRoute allowedRoles={[2]}> <CongeList /> </PrivateRoute>} />
        <Route path="/superadmin/conges/:id" element={<PrivateRoute allowedRoles={[2]}> <CongeView /> </PrivateRoute>} />

        <Route path="/superadmin/audit" element={<PrivateRoute allowedRoles={[2]}> <AuditList /> </PrivateRoute>} />

        {/* Catch-all pour les routes inexistantes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
