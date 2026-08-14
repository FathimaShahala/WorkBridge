
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CheckCircle,
  Users,
  Plus,
  MapPin,
  IndianRupee,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const EmployerDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // Fetch Jobs
  // =========================
  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/jobs");

      if (response.data.success) {
        const allJobs = response.data.jobs || [];

        // Show only jobs created by logged-in employer
        const employerJobs = allJobs.filter(
          (job) =>
            job.employer?._id === user?.id ||
            job.employer?._id === user?._id
        );

        setJobs(employerJobs);
      }
    } catch (error) {
      console.error("Fetch Jobs Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load your jobs."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // Load Jobs
  // =========================
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  // =========================
  // Statistics
  // =========================
  const totalJobs = jobs.length;

  const openJobs = jobs.filter(
    (job) => job.status === "open"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status !== "open"
  ).length;

  const totalVacancies = jobs.reduce(
    (total, job) =>
      total + Number(job.vacancies || 0),
    0
  );

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Open Jobs",
      value: openJobs,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Closed Jobs",
      value: closedJobs,
      icon: Clock,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      title: "Total Vacancies",
      value: totalVacancies,
      icon: Users,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // Format Salary
  // =========================
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* =========================
            Header
        ========================= */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Employer Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back, {user?.fullName || "Employer"} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your job postings and find the right
              workers for your business.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <Link
              to="/employer/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Post a Job
            </Link>
          </div>
        </div>

        {/* =========================
            Statistics
        ========================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon
                      size={22}
                      className={stat.iconColor}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================
            Jobs Section
        ========================= */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Job Postings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage the jobs you have posted.
              </p>
            </div>

            {!loading && jobs.length > 0 && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {jobs.length}{" "}
                {jobs.length === 1 ? "Job" : "Jobs"}
              </span>
            )}
          </div>

          {/* =========================
              Loading
          ========================= */}
          {loading && (
            <div className="grid gap-5 lg:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="h-5 w-2/3 rounded bg-slate-200" />

                  <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />

                  <div className="mt-6 h-10 w-full rounded bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {/* =========================
              Empty State
          ========================= */}
          {!loading && jobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Briefcase size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No jobs posted yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first job posting and start
                connecting with qualified workers.
              </p>

              <Link
                to="/employer/jobs/create"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Post Your First Job
              </Link>
            </div>
          )}

          {/* =========================
              Job Cards
          ========================= */}
          {!loading && jobs.length > 0 && (
            <div className="grid gap-5 lg:grid-cols-2">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900">
                        {job.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={15} />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        job.status === "open"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.status === "open"
                        ? "Open"
                        : "Closed"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                    {job.description}
                  </p>

                  {/* Job Details */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <IndianRupee size={14} />
                        Salary
                      </div>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatSalary(job.salary)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users size={14} />
                        Vacancies
                      </div>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {job.vacancies}
                      </p>
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div className="mt-4">
                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                      {job.employmentType}
                    </span>
                  </div>

                  {/* Skills */}
                  {job.requiredSkills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.requiredSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Posted{" "}
                      {formatDate(job.createdAt)}
                    </p>

                    <Link
  to={`/employer/jobs/${job._id}`}
  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
>
  View Details
  <ArrowRight size={16} />
</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
