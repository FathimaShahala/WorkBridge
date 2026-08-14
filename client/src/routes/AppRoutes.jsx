
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

import WorkerDashboard from "../pages/worker/WorkerDashboard";
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import LabourOfficerDashboard from "../pages/labourOfficer/LabourOfficerDashboard";
import PoliceDashboard from "../pages/police/PoliceDashboard";
import InsuranceDashboard from "../pages/insurance/InsuranceDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Employer pages
import CreateJob from "../pages/employer/CreateJob";
import JobDetails from "../pages/employer/JobDetails";
import EditJob from "../pages/employer/EditJob";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* =========================
          AUTHENTICATED ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>

        {/* =========================
            WORKER
        ========================= */}

        <Route
          element={
            <RoleRoute allowedRoles={["worker"]} />
          }
        >
          <Route
            path="/worker/dashboard"
            element={<WorkerDashboard />}
          />
        </Route>


        {/* =========================
            EMPLOYER
        ========================= */}

        <Route
          element={
            <RoleRoute allowedRoles={["employer"]} />
          }
        >
          <Route
            path="/employer/dashboard"
            element={<EmployerDashboard />}
          />

          <Route
            path="/employer/jobs/create"
            element={<CreateJob />}
          />

          <Route
  path="/employer/jobs/:id"
  element={<JobDetails />}
/>

<Route
    path="/employer/jobs/:id/edit"
    element={<EditJob />}
  />
        </Route>


        {/* =========================
            LABOUR OFFICER
        ========================= */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["labourOfficer"]}
            />
          }
        >
          <Route
            path="/labour/dashboard"
            element={<LabourOfficerDashboard />}
          />
        </Route>


        {/* =========================
            POLICE
        ========================= */}

        <Route
          element={
            <RoleRoute allowedRoles={["police"]} />
          }
        >
          <Route
            path="/police/dashboard"
            element={<PoliceDashboard />}
          />
        </Route>


        {/* =========================
            INSURANCE
        ========================= */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["insurance"]}
            />
          }
        >
          <Route
            path="/insurance/dashboard"
            element={<InsuranceDashboard />}
          />
        </Route>


        {/* =========================
            ADMIN
        ========================= */}

        <Route
          element={
            <RoleRoute allowedRoles={["admin"]} />
          }
        >
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;
