import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ClipboardList,
  UserCheck,
  ArrowUpRight,
  Search,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const WorkerDashboard = () => {
  // =========================
  // Jobs State
  // =========================
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState("");

  // =========================
  // Applications State
  // =========================
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] =
    useState(true);
  const [applicationError, setApplicationError] =
    useState("");

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
        console.error(
          "Fetch Jobs Error:",
          error
        );

        setJobError(
          error.response?.data?.message ||
            "Failed to load jobs."
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // =========================
  // Fetch My Applications
  // =========================
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoadingApplications(true);
        setApplicationError("");

        const response = await api.get(
          "/applications/my"
        );

        if (response.data.success) {
          setApplications(
            response.data.applications || []
          );
        } else {
          setApplicationError(
            "Unable to load applications."
          );
        }
      } catch (error) {
        console.error(
          "Fetch Applications Error:",
          error
        );

        setApplicationError(
          error.response?.data?.message ||
            "Failed to load applications."
        );
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, []);

  // =========================
  // Dashboard Stats
  // =========================
  const stats = [
    {
      title: "Available Jobs",
      value: jobs.length,
      description: "Open jobs available",
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Applications",
      value: loadingApplications
        ? "..."
        : applications.length,
      description: "Applications submitted",
      icon: ClipboardList,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Profile Status",
      value: "Active",
      description: "Your profile is active",
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  // =========================
  // Format Salary
  // =========================
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";

    return `₹${Number(salary).toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* =========================
            Page Header
        ========================= */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Worker Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Find jobs, manage applications, and
                build your career.
              </p>
            </div>

            {/* Find Jobs */}
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Search size={18} />
              Find Jobs
            </Link>

          </div>
        </div>

        {/* =========================
            Stats
        ========================= */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon
                      size={21}
                      className={stat.iconColor}
                    />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* =========================
            Quick Actions
        ========================= */}
        <div className="mb-8">

          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Find Jobs */}
            <Link
              to="/jobs"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Briefcase size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Find Jobs
                </p>

                <p className="text-xs text-slate-500">
                  Browse available jobs
                </p>
              </div>
            </Link>

            {/* My Applications */}
            <Link
              to="/worker/applications"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
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
            </Link>

            {/* Profile */}
            <Link
              to="/worker/profile"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <UserCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  My Profile
                </p>

                <p className="text-xs text-slate-500">
                  Update your profile
                </p>
              </div>
            </Link>

          </div>
        </div>

        {/* =========================
            Recommended Jobs
        ========================= */}
        <div className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recommended Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore the latest available
                opportunities.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all
              <ArrowUpRight size={16} />
            </Link>

          </div>

          {/* Loading */}
          {loadingJobs && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading jobs...
              </p>
            </div>
          )}

          {/* Error */}
          {!loadingJobs && jobError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600">
                {jobError}
              </p>
            </div>
          )}

          {/* No Jobs */}
          {!loadingJobs &&
            !jobError &&
            jobs.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <Briefcase
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No jobs available right now.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please check again later.
                </p>
              </div>
            )}

          {/* Jobs */}
          {!loadingJobs &&
            !jobError &&
            jobs.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {jobs.slice(0, 6).map((job) => (
                  <div
                    key={job._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* Job Title */}
                    <div className="mb-4 flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {job.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {job.employer?.fullName ||
                            "Employer"}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        {job.status || "open"}
                      </span>

                    </div>

                    {/* Job Details */}
                    <div className="space-y-2.5">

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin
                          size={16}
                          className="text-slate-400"
                        />

                        <span>
                          {job.location ||
                            "Location not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <DollarSign
                          size={16}
                          className="text-slate-400"
                        />

                        <span>
                          {formatSalary(job.salary)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock
                          size={16}
                          className="text-slate-400"
                        />

                        <span>
                          {job.employmentType ||
                            "Not specified"}
                        </span>
                      </div>

                    </div>

                    {/* Date */}
                    {job.createdAt && (
                      <p className="mt-4 text-xs text-slate-400">
                        Posted{" "}
                        {formatDate(job.createdAt)}
                      </p>
                    )}

                    {/* Action */}
                    <div className="mt-5">

                      <Link
                        to={`/worker/jobs/${job._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        View Job
                        <ArrowUpRight size={16} />
                      </Link>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </div>

        {/* =========================
            Application Summary
        ========================= */}
        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track the latest applications you
                submitted.
              </p>
            </div>

            <Link
              to="/worker/applications"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>

          </div>

          {/* Application Loading */}
          {loadingApplications && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading applications...
              </p>
            </div>
          )}

          {/* Application Error */}
          {!loadingApplications &&
            applicationError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm text-red-600">
                  {applicationError}
                </p>
              </div>
            )}

          {/* No Applications */}
          {!loadingApplications &&
            !applicationError &&
            applications.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  You haven't applied for any jobs
                  yet.
                </p>

                <Link
                  to="/jobs"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Search size={16} />
                  Find a Job
                </Link>
              </div>
            )}

          {/* Recent Applications */}
          {!loadingApplications &&
            !applicationError &&
            applications.length > 0 && (
              <div className="space-y-3">

                {applications
                  .slice(0, 3)
                  .map((application) => {

                    const job = application.job;

                    return (
                      <div
                        key={application._id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                          {/* Job Info */}
                          <div className="min-w-0">

                            <h3 className="truncate font-bold text-slate-900">
                              {job?.title ||
                                "Job"}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">

                              {job?.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin
                                    size={15}
                                  />
                                  {job.location}
                                </span>
                              )}

                              {job?.employmentType && (
                                <span className="flex items-center gap-1.5">
                                  <Briefcase
                                    size={15}
                                  />
                                  {job.employmentType}
                                </span>
                              )}

                              {job?.salary && (
                                <span className="flex items-center gap-1.5">
                                  <DollarSign
                                    size={15}
                                  />
                                  {formatSalary(
                                    job.salary
                                  )}
                                </span>
                              )}

                            </div>

                            {application.createdAt && (
                              <p className="mt-2 text-xs text-slate-400">
                                Applied{" "}
                                {formatDate(
                                  application.createdAt
                                )}
                              </p>
                            )}

                          </div>

                          {/* Status */}
                          <div className="flex shrink-0 items-center gap-3">

                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                                application.status ===
                                "accepted"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : application.status ===
                                    "rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {application.status ||
                                "pending"}
                            </span>

                            {job?._id && (
                              <Link
                                to={`/worker/jobs/${job._id}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                              >
                                View
                                <ArrowUpRight
                                  size={15}
                                />
                              </Link>
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  })}

              </div>
            )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;