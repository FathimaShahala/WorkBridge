
import { useEffect, useState } from "react";
import {
  Briefcase,
  ClipboardList,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const WorkerDashboard = () => {
  const { user } = useAuth();

  // =========================
  // Jobs State
  // =========================
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState("");

  // =========================
  // Fetch Jobs
  // =========================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        setJobError("");

        const response = await api.get("/jobs");

        if (response.data.success) {
          setJobs(response.data.jobs || []);
        } else {
          setJobError("Unable to load jobs.");
        }
      } catch (error) {
        console.error("Fetch Jobs Error:", error);

        setJobError(
          error.response?.data?.message ||
            "Failed to load available jobs."
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // =========================
  // Statistics
  // =========================
  const stats = [
    {
      title: "Available Jobs",
      value: jobs.length,
      description: "Jobs currently available",
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Applications",
      value: "08",
      description: "Applications submitted",
      icon: ClipboardList,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Completed Jobs",
      value: "12",
      description: "Successfully completed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Insurance",
      value: "Active",
      description: "Your insurance coverage",
      icon: ShieldCheck,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =========================
            Welcome Section
        ========================= */}
        <section>
          <p className="text-sm font-medium text-blue-600">
            Worker Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome, {user?.fullName || "Worker"}!
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your jobs, applications, attendance, and
            insurance from your WorkBridge dashboard.
          </p>
        </section>

        {/* =========================
            Statistics
        ========================= */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon
                      size={21}
                      className={stat.iconColor}
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* =========================
            Main Content
        ========================= */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* =========================
              Recommended Jobs
          ========================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recommended Jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Jobs that match your profile and skills.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 self-start text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Jobs */}
            <div className="divide-y divide-slate-100">

              {/* Loading */}
              {loadingJobs && (
                <div className="p-8 text-center">
                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                  <p className="mt-3 text-sm text-slate-500">
                    Loading available jobs...
                  </p>
                </div>
              )}

              {/* Error */}
              {!loadingJobs && jobError && (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-red-500">
                    {jobError}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loadingJobs &&
                !jobError &&
                jobs.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Briefcase
                        size={22}
                        className="text-slate-400"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-800">
                      No jobs available
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      There are currently no open jobs.
                    </p>
                  </div>
                )}

              {/* Jobs List */}
              {!loadingJobs &&
                !jobError &&
                jobs.length > 0 &&
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Job Information */}
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.employer?.fullName || "Employer"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {job.location}
                      </p>

                      {job.employmentType && (
                        <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                          {job.employmentType}
                        </span>
                      )}
                    </div>

                    {/* Salary + Apply */}
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="whitespace-nowrap text-sm font-semibold text-emerald-600">
                        ₹{Number(job.salary || 0).toLocaleString("en-IN")}
                        /month
                      </p>

                      <button
                        type="button"
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* =========================
              Quick Actions
          ========================= */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Frequently used options.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-1">

              {/* Find Job */}
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Briefcase size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Find a Job
                  </p>

                  <p className="text-xs text-slate-500">
                    Browse available jobs
                  </p>
                </div>
              </button>

              {/* Applications */}
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <ClipboardList size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    My Applications
                  </p>

                  <p className="text-xs text-slate-500">
                    Track your applications
                  </p>
                </div>
              </button>

              {/* Attendance */}
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Attendance
                  </p>

                  <p className="text-xs text-slate-500">
                    View your attendance
                  </p>
                </div>
              </button>

              {/* Insurance */}
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Insurance
                  </p>

                  <p className="text-xs text-slate-500">
                    Check your coverage
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* =========================
            Recent Activity
        ========================= */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest WorkBridge activity.
            </p>
          </div>

          <div className="divide-y divide-slate-100">

            <div className="flex items-start gap-4 p-5">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Application submitted for Construction Worker.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  2 hours ago
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Your insurance status was updated.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Yesterday
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Your worker profile was successfully verified.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  3 days ago
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
