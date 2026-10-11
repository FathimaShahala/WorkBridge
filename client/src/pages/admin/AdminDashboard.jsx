
import { useEffect, useState } from "react";
import axios from "../../services/api";

import {
  Users,
  UserRound,
  Building2,
  Briefcase,
  FileText,
  MessageSquareWarning,
  ShieldCheck,
  Shield,
  HeartPulse,
  UserCog,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/admin/dashboard");

      if (response.data.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />

          <p className="text-gray-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-gray-800">
            Unable to load dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { stats, recentUsers, recentJobs, recentApplications } =
    dashboard;

  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    iconBg,
    iconColor,
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {value ?? 0}
          </h3>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor and manage the WorkBridge platform.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* ========================================
            MAIN STATISTICS
        ======================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Users"
            value={stats.users.total}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Workers"
            value={stats.workers.total}
            icon={UserRound}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <StatCard
            title="Employers"
            value={stats.employers.total}
            icon={Building2}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <StatCard
            title="Total Jobs"
            value={stats.jobs.total}
            icon={Briefcase}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />

        </div>

        {/* ========================================
            SECONDARY STATISTICS
        ======================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Applications"
            value={stats.applications.total}
            icon={FileText}
            iconBg="bg-cyan-50"
            iconColor="text-cyan-600"
          />

          <StatCard
            title="Complaints"
            value={stats.complaints.total}
            icon={MessageSquareWarning}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

          <StatCard
            title="Labour Officers"
            value={stats.labourOfficers.total}
            icon={ShieldCheck}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <StatCard
            title="Police"
            value={stats.police.total}
            icon={Shield}
            iconBg="bg-slate-100"
            iconColor="text-slate-700"
          />

        </div>

        {/* ========================================
            USER OVERVIEW + JOB OVERVIEW
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* User Overview */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  User Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Platform user status
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Active
                </p>

                <p className="text-xl font-bold text-green-600 mt-1">
                  {stats.users.active}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Inactive
                </p>

                <p className="text-xl font-bold text-red-600 mt-1">
                  {stats.users.inactive}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Verified
                </p>

                <p className="text-xl font-bold text-blue-600 mt-1">
                  {stats.users.verified}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Unverified
                </p>

                <p className="text-xl font-bold text-orange-600 mt-1">
                  {stats.users.unverified}
                </p>
              </div>

            </div>
          </div>

          {/* Job Overview */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Job Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Current job status
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Open
                </p>

                <p className="text-xl font-bold text-green-600 mt-1">
                  {stats.jobs.open}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Closed
                </p>

                <p className="text-xl font-bold text-red-600 mt-1">
                  {stats.jobs.closed}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Draft
                </p>

                <p className="text-xl font-bold text-yellow-600 mt-1">
                  {stats.jobs.draft}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="text-xl font-bold text-blue-600 mt-1">
                  {stats.jobs.total}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================
            APPLICATION + COMPLAINT OVERVIEW
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Applications */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Application Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Application status
                </p>
              </div>
            </div>

            <div className="space-y-4">

              <StatusRow
                icon={Clock}
                title="Pending"
                value={stats.applications.pending}
                iconColor="text-yellow-600"
              />

              <StatusRow
                icon={CheckCircle}
                title="Shortlisted"
                value={stats.applications.shortlisted}
                iconColor="text-blue-600"
              />

              <StatusRow
                icon={CheckCircle}
                title="Accepted"
                value={stats.applications.accepted}
                iconColor="text-green-600"
              />

              <StatusRow
                icon={XCircle}
                title="Rejected"
                value={stats.applications.rejected}
                iconColor="text-red-600"
              />

            </div>
          </div>

          {/* Complaints */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <MessageSquareWarning className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Complaint Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Complaint status
                </p>
              </div>
            </div>

            <div className="space-y-4">

              <StatusRow
                icon={Clock}
                title="Pending"
                value={stats.complaints.pending}
                iconColor="text-yellow-600"
              />

              <StatusRow
                icon={RefreshCw}
                title="Investigating"
                value={stats.complaints.investigating}
                iconColor="text-blue-600"
              />

              <StatusRow
                icon={CheckCircle}
                title="Resolved"
                value={stats.complaints.resolved}
                iconColor="text-green-600"
              />

              <StatusRow
                icon={XCircle}
                title="Rejected"
                value={stats.complaints.rejected}
                iconColor="text-red-600"
              />

            </div>
          </div>

        </div>

        {/* ========================================
            RECENT USERS
        ======================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">

          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Recent Users
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Recently registered users
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    User
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Verification
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {recentUsers?.map((user) => (
                  <tr key={user._id}>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {user.fullName}
                      </div>

                      <div className="text-xs text-gray-400">
                        {user.phone}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-600 text-sm">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        </div>

        {/* ========================================
            RECENT JOBS
        ======================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">

          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Recent Jobs
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Recently posted jobs
            </p>
          </div>

          <div className="divide-y divide-gray-100">

            {recentJobs?.map((job) => (
              <div
                key={job._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3 className="font-medium text-gray-800">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {job.location}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Posted by{" "}
                    {job.employer?.fullName || "Unknown Employer"}
                  </p>
                </div>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === "open"
                      ? "bg-green-50 text-green-700"
                      : job.status === "closed"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* ========================================
            RECENT APPLICATIONS
        ======================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Recent Applications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest job applications
            </p>
          </div>

          <div className="divide-y divide-gray-100">

            {recentApplications?.map((application) => (
              <div
                key={application._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >

                <div>

                  <h3 className="font-medium text-gray-800">
                    {application.worker?.fullName ||
                      "Unknown Worker"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Applied for{" "}
                    {application.job?.title ||
                      "Unknown Job"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Employer:{" "}
                    {application.employer?.fullName ||
                      "Unknown Employer"}
                  </p>

                </div>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${
                    application.status === "accepted"
                      ? "bg-green-50 text-green-700"
                      : application.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : application.status === "shortlisted"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {application.status}
                </span>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
};

// ==========================================
// STATUS ROW
// ==========================================

const StatusRow = ({
  icon: Icon,
  title,
  value,
  iconColor,
}) => {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Icon className={`w-5 h-5 ${iconColor}`} />

        <span className="text-sm text-gray-600">
          {title}
        </span>

      </div>

      <span className="font-semibold text-gray-800">
        {value ?? 0}
      </span>

    </div>
    // </DashboardLayout>
  );
};

export default AdminDashboard;
