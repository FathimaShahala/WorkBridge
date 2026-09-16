
import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  FileWarning,
  ClipboardCheck,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";

import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const PoliceDashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // Fetch Dashboard
  // ==========================================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/users/police/dashboard"
      );

      if (response.data.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error(
        "Police Dashboard Error:",
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
  // Date Formatter
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-8 w-72 rounded bg-gray-200" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { stats } = dashboard;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            Header
        ====================================== */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Police Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor workers, employers, complaints,
            inspections and workplace activity.
          </p>
        </div>

        {/* ======================================
            Main Statistics
        ====================================== */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Workers */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={22} />
              </div>

              <span className="text-xs text-gray-400">
                Workers
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {stats.workers.total}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Registered workers
            </p>

            <div className="mt-4 flex gap-3 text-xs">
              <span className="text-green-600">
                {stats.workers.active} active
              </span>

              <span className="text-gray-400">
                {stats.workers.inactive} inactive
              </span>
            </div>
          </div>

          {/* Employers */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Building2 size={22} />
              </div>

              <span className="text-xs text-gray-400">
                Employers
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {stats.employers.total}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Registered employers
            </p>

            <div className="mt-4 flex gap-3 text-xs">
              <span className="text-green-600">
                {stats.employers.active} active
              </span>

              <span className="text-gray-400">
                {stats.employers.inactive} inactive
              </span>
            </div>
          </div>

          {/* Complaints */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FileWarning size={22} />
              </div>

              <span className="text-xs text-gray-400">
                Complaints
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {stats.complaints.total}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Total complaints
            </p>

            <div className="mt-4 flex gap-3 text-xs">
              <span className="text-yellow-600">
                {stats.complaints.pending} pending
              </span>

              <span className="text-blue-600">
                {stats.complaints.investigating} investigating
              </span>
            </div>
          </div>

          {/* Inspections */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <ClipboardCheck size={22} />
              </div>

              <span className="text-xs text-gray-400">
                Inspections
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {stats.inspections.total}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Total inspections
            </p>

            <div className="mt-4 flex gap-3 text-xs">
              <span className="text-blue-600">
                {stats.inspections.scheduled} scheduled
              </span>

              <span className="text-red-600">
                {stats.inspections.violations} violations
              </span>
            </div>
          </div>

        </div>

        {/* ======================================
            Secondary Statistics
        ====================================== */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Verified Workers */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={20}
                className="text-green-600"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Verified Workers
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {stats.workers.verified}
                </p>
              </div>
            </div>
          </div>

          {/* Unverified Workers */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldAlert
                size={20}
                className="text-yellow-600"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Unverified Workers
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {stats.workers.unverified}
                </p>
              </div>
            </div>
          </div>

          {/* Resolved Complaints */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle
                size={20}
                className="text-green-600"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Resolved Complaints
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {stats.complaints.resolved}
                </p>
              </div>
            </div>
          </div>

          {/* Open Jobs */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Briefcase
                size={20}
                className="text-blue-600"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Open Jobs
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {stats.jobs.open}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================
            Recent Activity
        ====================================== */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Recent Complaints */}
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Recent Complaints
                </h2>

                <p className="text-xs text-gray-500">
                  Latest reported complaints
                </p>
              </div>

              <FileWarning
                size={20}
                className="text-red-500"
              />
            </div>

            <div className="divide-y">
              {dashboard.recentComplaints
                ?.length > 0 ? (
                dashboard.recentComplaints.map(
                  (complaint) => (
                    <div
                      key={complaint._id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {complaint.subject}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {complaint.worker
                              ?.fullName ||
                              "Unknown worker"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(
                              complaint.createdAt
                            )}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-600">
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  No complaints found.
                </div>
              )}
            </div>
          </div>

          {/* Recent Inspections */}
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Recent Inspections
                </h2>

                <p className="text-xs text-gray-500">
                  Latest workplace inspections
                </p>
              </div>

              <ClipboardCheck
                size={20}
                className="text-green-600"
              />
            </div>

            <div className="divide-y">
              {dashboard.recentInspections
                ?.length > 0 ? (
                dashboard.recentInspections.map(
                  (inspection) => (
                    <div
                      key={inspection._id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {inspection.workplace}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {inspection.employer
                              ?.fullName ||
                              "Unknown employer"}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                            <CalendarIcon />

                            {formatDate(
                              inspection.inspectionDate
                            )}
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-600">
                          {inspection.status}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  No inspections found.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ======================================
            Worker Verification Summary
        ====================================== */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck
              size={22}
              className="text-blue-600"
            />

            <div>
              <h2 className="font-semibold text-gray-900">
                Worker Verification
              </h2>

              <p className="text-xs text-gray-500">
                Current worker verification status
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Total Workers
              </p>

              <p className="mt-1 text-2xl font-bold">
                {stats.workers.total}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs text-green-600">
                Verified
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {stats.workers.verified}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <p className="text-xs text-yellow-600">
                Unverified
              </p>

              <p className="mt-1 text-2xl font-bold text-yellow-700">
                {stats.workers.unverified}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
};

// ==========================================
// Small Calendar Icon
// ==========================================
const CalendarIcon = () => (
  <Clock size={14} />
);

export default PoliceDashboard;
