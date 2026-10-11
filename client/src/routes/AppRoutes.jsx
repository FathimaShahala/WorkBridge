import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminEmployers from "../pages/admin/AdminEmployers";
import AdminWorkers from "../pages/admin/AdminWorkers";
import AdminJobs from "../pages/admin/AdminJobs";
import AdminComplaints from "../pages/admin/AdminComplaints";
import AdminReports from "../pages/admin/AdminReports";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminNotifications from "../pages/admin/AdminNotifications";
import AdminProfile from "../pages/admin/AdminProfile";

// Worker pages
import WorkerDashboard from "../pages/worker/WorkerDashboard";
import MyInsurance from "../pages/worker/MyInsurance";
import WorkerInsuranceDetails from "../pages/worker/WorkerInsuranceDetails";
import Jobs from "../pages/worker/Jobs";
import WorkerJobDetails from "../pages/worker/WorkerJobDetails";
import MyApplications from "../pages/worker/MyApplications";
import WorkerAttendance from "../pages/worker/Worker Attendance";
import EmployerWorkers from "../pages/employer/EmployerWorkers";
import WorkerNotifications from "../pages/worker/WorkerNotification";
import WorkerSettings from "../pages/worker/WorkerSettings";
import WorkerProfile from "../pages/worker/Profile";

// Employer pages
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import CreateJob from "../pages/employer/CreateJob";
import JobDetails from "../pages/employer/JobDetails";
import EditJob from "../pages/employer/EditJob";
import EmployerApplications from "../pages/employer/EmployerApplications";
import MyJobs from "../pages/employer/MyJobs";
import EmployerProfile from "../pages/employer/EmployerProfile";
import EmployerNotifications from "../pages/employer/EmployerNotifications";
import EmployerSettings from "../pages/employer/EmployerSettings";  

// Labor Officer pages
import LabourOfficerDashboard from "../pages/labourOfficer/LabourOfficerDashboard";
import LabourOfficerWorkers from "../pages/labourOfficer/LabourOfficerWorkers";
import LabourOfficerEmployers from "../pages/labourOfficer/LabourOfficerEmployers";
import LabourOfficerComplaints from "../pages/labourOfficer/LabourOfficerComplaints";
import LabourOfficerInspections from "../pages/labourOfficer/LabourOfficerInspections";
import LabourOfficerNotifications from "../pages/labourOfficer/LabourOfficerNotifications";
import LabourOfficerSettings from "../pages/labourOfficer/LabourOfficerSettings";
import LabourProfile from "../pages/labourOfficer/LabourProfile";

// Police pages
import PoliceDashboard from "../pages/police/PoliceDashboard";
import PoliceWorkers from "../pages/police/PoliceWorkers"; 
import PoliceComplaints from "../pages/police/PoliceComplaints"; 
import PoliceCases from "../pages/police/PoliceCases"; 
import PoliceVerification from "../pages/police/PoliceVerification";
import PoliceNotifications from "../pages/police/PoliceNotifications";
import PoliceSettings from "../pages/police/PoliceSettings";
import PoliceProfile from "../pages/police/PoliceProfile";

// Insurance pages
import InsuranceDashboard from "../pages/insurance/InsuranceDashboard";
import InsurancePolicies from "../pages/insurance/InsurancePolicies";
import CreateInsurance from "../pages/insurance/CreateInsurance";
import InsurancePolicyDetails from "../pages/insurance/InsurancePolicyDetails";
import InsuranceProfile from "../pages/insurance/profile";
import InsuranceWorkers from "../pages/insurance/InsuranceWorkers";
import InsuranceWorkerDetails from "../pages/insurance/InsuranceWorkerDetails";
import InsuranceClaims from "../pages/insurance/InsuranceClaims";
import InsuranceClaimDetails from "../pages/insurance/InsuranceClaimDetails";
import InsuranceNotifications from "../pages/insurance/InsuranceNotifications";
import InsuranceSettings from "../pages/insurance/InsuranceSettings";
import InsuranceReports from "../pages/insurance/InsuranceReports";


const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =========================
          AUTHENTICATED ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>
        {/* =========================
            WORKER
        ========================= */}

        <Route element={<RoleRoute allowedRoles={["worker"]} />}>
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/jobs" element={<Jobs />} />
          <Route path="/worker/jobs/:id" element={<WorkerJobDetails />} />
          <Route path="/worker/applications" element={<MyApplications />} />
          <Route path="/worker/attendance" element={<WorkerAttendance />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
          <Route path="/worker/insurance" element={<MyInsurance />} />
          <Route path="/worker/notifications" element={<WorkerNotifications />} />
          <Route path="/worker/settings" element={<WorkerSettings />} />
          <Route path="/worker/insurance/:id"element={<WorkerInsuranceDetails />}/>
        </Route>

        {/* =========================
            EMPLOYER
        ========================= */}

        <Route element={<RoleRoute allowedRoles={["employer"]} />}>
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/jobs/create" element={<CreateJob />} />
          <Route path="/employer/jobs/:id" element={<JobDetails />} />
          <Route path="/employer/jobs/:id/edit" element={<EditJob />} />
          <Route path="/employer/applications" element={<EmployerApplications />} />
          <Route path="/employer/jobs" element={<MyJobs />} />
          <Route path="/employer/workers" element={<EmployerWorkers />} />
          <Route path="/employer/notifications" element={<EmployerNotifications />} />
          <Route path="/employer/settings" element={<EmployerSettings />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />
        </Route>

        {/* =========================
            LABOUR OFFICER
        ========================= */}

        <Route element={<RoleRoute allowedRoles={["labourOfficer"]} />}>
          <Route path="/labour/dashboard" element={<LabourOfficerDashboard />} />
          <Route path="/labour/workers" element={<LabourOfficerWorkers />} />
          <Route path="/labour/employers" element={<LabourOfficerEmployers />} />
          <Route path="/labour/complaints" element={<LabourOfficerComplaints />} />
          <Route path="/labour/inspections" element={<LabourOfficerInspections />} />
          <Route path="/labourofficer/notifications" element={<LabourOfficerNotifications />} />
          <Route path="/labourofficer/settings" element={<LabourOfficerSettings />} />
          <Route path="/labour/profile" element={<LabourProfile />} />
        </Route>

        {/* =========================
            POLICE
        ========================= */}

        <Route element={<RoleRoute allowedRoles={["police"]} />}>
          <Route path="/police/dashboard" element={<PoliceDashboard />} />
          <Route path="/police/workers" element={ <PoliceWorkers />} /> 
          <Route path="/police/complaints" element={ <PoliceComplaints /> } /> 
          <Route path="/police/cases" element={ <PoliceCases /> } /> 
          <Route path="/police/verification" element={ <PoliceVerification /> } />
          <Route path="/police/notifications" element={ <PoliceNotifications /> } />
          <Route path="/police/profile" element={ <PoliceProfile /> } />
          <Route path="/police/settings" element={ <PoliceSettings /> } />
        </Route>

        {/* =========================
            INSURANCE
        ========================= */}

        <Route element={<RoleRoute allowedRoles={["insurance"]} />}>
          <Route path="/insurance/dashboard" element={<InsuranceDashboard />} />
          <Route path="/insurance/policies" element={<InsurancePolicies />} />
          <Route path="/insurance/policies/create" element={<CreateInsurance />} />
          <Route path="/insurance/policies/:id" element={<InsurancePolicyDetails />} />
          <Route path="/insurance/workers" element={<InsuranceWorkers />} />
          <Route path="/insurance/workers/:id" element={<InsuranceWorkerDetails />} />
          <Route path="/insurance/claims" element={<InsuranceClaims />} />
          <Route path="/insurance/claims/:id" element={<InsuranceClaimDetails />} />
          <Route path="/insurance/reports" element={<InsuranceReports />} />
          <Route path="/insurance/notifications" element={<InsuranceNotifications />} />
          <Route path="/insurance/settings" element={<InsuranceSettings />} />
          <Route path="/insurance/profile" element={<InsuranceProfile />} />
        </Route>

        {/* =========================
            ADMIN
        ========================= */}

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/employers" element={<AdminEmployers />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />  
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
