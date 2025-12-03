import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

// Gerer par les employes
import EmployeeDashboard from "../pages/Employe/Dashboard";

// Gerer par les admins
import AdminDashboard from "../pages/Admin/Dashboard";

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

        {/* Protégées */}

        {/* Employe */}
        <Route path="/employe/dashboard" element={ <PrivateRoute allowedRoles={[0]}> <EmployeeDashboard /> </PrivateRoute> } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={ <PrivateRoute allowedRoles={[1]}> <AdminDashboard /> </PrivateRoute> } />

        {/*Super Admin */}
        <Route path="/superadmin/dashboard" element={ <PrivateRoute allowedRoles={[2]}> <SuperAdminDashboard /> </PrivateRoute> } />

        <Route path="/superadmin/profile" element={<PrivateRoute allowedRoles={[2]}> <SuperAdminProfile /> </PrivateRoute>} />
        <Route path="/superadmin/profile/edit" element={ <PrivateRoute allowedRoles={[2]}> <SuperAdminProfileEdit /> </PrivateRoute> } />

        <Route path="/superadmin/super-admins" element={ <PrivateRoute allowedRoles={[2]}> <SuperAdminList /> </PrivateRoute> } />
        <Route path="/superadmin/super-admins/create" element={ <PrivateRoute allowedRoles={[2]}> <SuperAdminCreate /> </PrivateRoute> } />
        <Route path="/superadmin/super-admins/:id" element={ <PrivateRoute allowedRoles={[2]}> <SuperAdminView /> </PrivateRoute> } />
        <Route path="/superadmin/super-admins/:id/edit" element={ <PrivateRoute allowedRoles={[2]}> <SuperAdminEdit /> </PrivateRoute> } />

        <Route path="/superadmin/admins" element={ <PrivateRoute allowedRoles={[2]}> <AdminList /> </PrivateRoute> } />
        <Route path="/superadmin/admins/create" element={ <PrivateRoute allowedRoles={[2]}> <AdminCreate /> </PrivateRoute> } />
        <Route path="/superadmin/admins/:id" element={ <PrivateRoute allowedRoles={[2]}> <AdminView /> </PrivateRoute> } />
        <Route path="/superadmin/admins/:id/edit" element={ <PrivateRoute allowedRoles={[2]}> <AdminEdit /> </PrivateRoute> } />

        {/* Catch-all pour les routes inexistantes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
