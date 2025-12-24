import AdminDashboard from "@/pages/Admin/Dashboard";
import Login from "@/pages/Auth/Login";
import EmployeeDashboard from "@/pages/Employe/Dashboard";
import SuperAdminDashboard from "@/pages/SuperAdmin/Dashboard";
import SuperAdminProfile from "@/pages/SuperAdmin/Profil";
import SuperAdminProfileEdit from "@/pages/SuperAdmin/Profil/Edit";
import SuperAdminCreate from "@/pages/SuperAdmin/SuperAdmin/Create";
import AdminCreate from "@/pages/SuperAdmin/Admin/Create";
import SuperAdminEdit from "@/pages/SuperAdmin/SuperAdmin/Edit";
import AdminEdit from "@/pages/SuperAdmin/Admin/Edit";
import SuperAdminList from "@/pages/SuperAdmin/SuperAdmin/Index";
import AdminList from "@/pages/SuperAdmin/Admin/Index";
import SuperAdminView from "@/pages/SuperAdmin/SuperAdmin/Show";
import AdminView from "@/pages/SuperAdmin/Admin/Show";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CongeShow from "@/pages/SuperAdmin/Conges/Show";
import CongeList from "@/pages/SuperAdmin/Conges/Index";
import EmployeEdit from "@/pages/SuperAdmin/Employes/Edit";
import EmployeShow from "@/pages/SuperAdmin/Employes/Show";
import DepartementEmployes from "@/pages/SuperAdmin/Employes/DepartementEmployes";
import EmployeCreate from "@/pages/SuperAdmin/Employes/Create";
import EmployeList from "@/pages/SuperAdmin/Employes/Index";
import PosteEdit from "@/pages/SuperAdmin/Postes/Edit";
import PosteShow from "@/pages/SuperAdmin/Postes/Show";
import PosteCreate from "@/pages/SuperAdmin/Postes/Create";
import PosteList from "@/pages/SuperAdmin/Postes/Index";
import DepartementEdit from "@/pages/SuperAdmin/Departements/Edit";
import DepartementShow from "@/pages/SuperAdmin/Departements/Show";
import DepartementCreate from "@/pages/SuperAdmin/Departements/Create";
import DepartementList from "@/pages/SuperAdmin/Departements/Index";
import PublicRoute from "./PublicRoute";
// import PrivateRoute from "./PrivateRoute";
import NotFound from "@/pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            // <PublicRoute>

            <Login />
            // </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protégées */}

        {/* Employe */}
        <Route
          path="/employe/dashboard"
          element={
            // <PrivateRoute allowedRoles={[0]}>

            <EmployeeDashboard />
            // {/* </PrivateRoute> */}
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            // <PrivateRoute allowedRoles={[1]}>

            <AdminDashboard />
            // {/* </PrivateRoute> */}
          }
        />

        {/*Super Admin */}
        <Route
          path="/superadmin/dashboard"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminDashboard />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/profile"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminProfile />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/profile/edit"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminProfileEdit />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/super-admins"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminList />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/super-admins/create"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminCreate />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/super-admins/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminView />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/super-admins/:id/edit"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <SuperAdminEdit />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/admins"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <AdminList />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/admins/create"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <AdminCreate />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/admins/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <AdminView />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/admins/:id/edit"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <AdminEdit />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/departements"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <DepartementList />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/departements/create"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <DepartementCreate />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/departements/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <DepartementShow />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/departements/:id/edit"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <DepartementEdit />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/postes"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <PosteList />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/postes/create"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <PosteCreate />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/postes/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <PosteShow />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/postes/:id/edit"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <PosteEdit />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/employes"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <EmployeList />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/employes/create"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <EmployeCreate />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/employes/departement/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <DepartementEmployes />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/employes/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <EmployeShow />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/employes/:id/edit"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <EmployeEdit />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/superadmin/conges"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <CongeList />
            // {/* </PrivateRoute> */}
          }
        />
        <Route
          path="/superadmin/conges/:id"
          element={
            // <PrivateRoute allowedRoles={[2]}>

            <CongeShow />
            // {/* </PrivateRoute> */}
          }
        />

        <Route path="/superadmin/audit" element={<PrivateRoute allowedRoles={[2]}> <AuditList /> </PrivateRoute>} />

        {/* Catch-all pour les routes inexistantes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
