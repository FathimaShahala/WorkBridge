
import { useEffect, useState } from "react";
import axios from "../../services/api";

import {
  Users,
  Building2,
  Briefcase,
  FileText,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";

import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const LabourOfficerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Fetch Dashboard
  // ==========================================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/users/labour-officer/dashboard"
      );

      if (response.data.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error(
        "Fetch Labour Officer Dashboard Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={24}
            className="animate-spin"
          />

          <span>
            Loading Labour Officer Dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const stats = dashboard.stats || {};

  const workers = stats.workers || {};
  const employers = stats.employers || {};
  const jobs = stats.jobs || {};
  const applications =
    stats.applications || {};

  return (
    <DashboardLayout>
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* ======================================
          Header
      ====================================== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Labour Officer Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Monitor workers, employers, jobs and
          applications across WorkBridge.
        </p>
      </div>

      {/* ======================================
          Main Statistics
      ====================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Workers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Workers
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {workers.total || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {workers.active || 0} active
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Users
                size={24}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Employers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Employers
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {employers.total || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {employers.active || 0} active
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Building2
                size={24}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Jobs */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Jobs
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {jobs.total || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {jobs.open || 0} currently open
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Briefcase
                size={24}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Applications
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {applications.total || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {applications.pending || 0} pending
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <FileText
                size={24}
                className="text-orange-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          Worker / Employer Overview
      ====================================== */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Worker Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <Users
              size={21}
              className="text-blue-600"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              Worker Overview
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <UserCheck
                  size={18}
                  className="text-green-600"
                />

                <span className="text-sm text-gray-500">
                  Active
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {workers.active || 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className="text-blue-600"
                />

                <span className="text-sm text-gray-500">
                  Verified
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {workers.verified || 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <XCircle
                  size={18}
                  className="text-red-500"
                />

                <span className="text-sm text-gray-500">
                  Inactive
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {workers.inactive || 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Users
                  size={18}
                  className="text-gray-600"
                />

                <span className="text-sm text-gray-500">
                  Total
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {workers.total || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Employer Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <Building2
              size={21}
              className="text-purple-600"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              Employer Overview
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {employers.total || 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Active
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {employers.active || 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Verified
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {employers.verified || 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Unverified
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-500">
                {Math.max(
                  0,
                  (employers.total || 0) -
                    (employers.verified || 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          Jobs + Applications Overview
      ====================================== */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Jobs */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <Briefcase
              size={21}
              className="text-green-600"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              Job Overview
            </h2>
          </div>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Open Jobs
              </span>

              <span className="font-semibold text-green-600">
                {jobs.open || 0}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${
                    jobs.total
                      ? Math.min(
                          100,
                          (jobs.open /
                            jobs.total) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Closed Jobs
              </span>

              <span className="font-semibold text-gray-700">
                {jobs.closed || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Draft Jobs
              </span>

              <span className="font-semibold text-orange-600">
                {jobs.draft || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <FileText
              size={21}
              className="text-orange-600"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              Application Overview
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="rounded-lg bg-yellow-50 p-4">
              <Clock
                size={18}
                className="text-yellow-600"
              />

              <p className="mt-2 text-xs text-gray-500">
                Pending
              </p>

              <p className="text-xl font-bold text-gray-900">
                {applications.pending || 0}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <Users
                size={18}
                className="text-blue-600"
              />

              <p className="mt-2 text-xs text-gray-500">
                Shortlisted
              </p>

              <p className="text-xl font-bold text-gray-900">
                {applications.shortlisted || 0}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <CheckCircle
                size={18}
                className="text-green-600"
              />

              <p className="mt-2 text-xs text-gray-500">
                Accepted
              </p>

              <p className="text-xl font-bold text-gray-900">
                {applications.accepted || 0}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <XCircle
                size={18}
                className="text-red-600"
              />

              <p className="mt-2 text-xs text-gray-500">
                Rejected
              </p>

              <p className="text-xl font-bold text-gray-900">
                {applications.rejected || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          Recent Workers + Recent Jobs
      ====================================== */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Workers */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Workers
              </h2>

              <Users
                size={20}
                className="text-gray-400"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">

            {dashboard.recentWorkers?.length ? (
              dashboard.recentWorkers.map(
                (worker) => (
                  <div
                    key={worker._id}
                    className="flex items-center gap-4 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">

                      {worker.profileImage ? (
                        <img
                          src={
                            worker.profileImage.startsWith(
                              "http"
                            )
                              ? worker.profileImage
                              : `${
                                  import.meta.env
                                    .VITE_API_URL ||
                                  "http://localhost:5000"
                                }${
                                  worker.profileImage
                                }`
                          }
                          alt={
                            worker.fullName ||
                            "Worker"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users
                          size={18}
                          className="text-blue-600"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {worker.fullName}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {worker.email}
                      </p>
                    </div>

                    {worker.isVerified ? (
                      <ShieldCheck
                        size={18}
                        className="shrink-0 text-green-600"
                      />
                    ) : (
                      <Clock
                        size={18}
                        className="shrink-0 text-orange-500"
                      />
                    )}
                  </div>
                )
              )
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No workers found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Jobs
              </h2>

              <Briefcase
                size={20}
                className="text-gray-400"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">

            {dashboard.recentJobs?.length ? (
              dashboard.recentJobs.map(
                (job) => (
                  <div
                    key={job._id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {job.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {job.employer?.fullName ||
                            "Unknown Employer"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          job.status === "open"
                            ? "bg-green-100 text-green-700"
                            : job.status ===
                              "closed"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {job.createdAt
                          ? new Date(
                              job.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No jobs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default LabourOfficerDashboard;
