import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  IndianRupee,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Fetch My Applications
  // ==========================================
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/applications/my"
        );

        if (response.data.success) {
          setApplications(
            response.data.applications || []
          );
        }
      } catch (error) {
        console.error(
          "Fetch Applications Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ==========================================
  // Format Salary
  // ==========================================
  const formatSalary = (salary) => {
    if (
      salary === undefined ||
      salary === null
    ) {
      return "Not specified";
    }

    return `₹${Number(salary).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==========================================
  // Format Date
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
  // Status Style
  // ==========================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600";

      case "shortlisted":
        return "bg-blue-50 text-blue-600";

      case "accepted":
        return "bg-emerald-50 text-emerald-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ==========================================
  // Status Label
  // ==========================================
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "shortlisted":
        return "Shortlisted";

      case "accepted":
        return "Accepted";

      case "rejected":
        return "Rejected";

      default:
        return status || "Unknown";
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading your applications...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">

        {/* ======================================
            Header
        ====================================== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track the jobs you have applied for and
            check your application status.
          </p>
        </div>

        {/* ======================================
            Empty State
        ====================================== */}
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Briefcase
                size={28}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't applied for any jobs yet.
              Explore available jobs and find the right
              opportunity for you.
            </p>

            <Link
              to="/worker/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Find Jobs
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          /* ======================================
             Applications List
          ====================================== */
          <div className="space-y-5">
            {applications.map((application) => {
              const job = application.job;

              return (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row">

                    {/* Job Information */}
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Briefcase
                          size={23}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-bold text-slate-900">
                            {job?.title ||
                              "Job unavailable"}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              application.status
                            )}`}
                          >
                            {getStatusLabel(
                              application.status
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {application.employer
                            ?.fullName ||
                            "Employer"}
                        </p>
                      </div>
                    </div>

                    {/* View Job */}
                    {job?._id && (
                      <Link
                        to={`/worker/jobs/${job._id}`}
                        className="inline-flex h-fit items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        View Job
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>

                  {/* ==================================
                      Job Details
                  ================================== */}
                  {job && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                      {/* Location */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin size={14} />
                          Location
                        </div>

                        <p className="mt-1.5 text-sm font-semibold text-slate-700">
                          {job.location ||
                            "Not specified"}
                        </p>
                      </div>

                      {/* Salary */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <IndianRupee size={14} />
                          Salary
                        </div>

                        <p className="mt-1.5 text-sm font-semibold text-slate-700">
                          {formatSalary(
                            job.salary
                          )}
                        </p>
                      </div>

                      {/* Employment */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Briefcase size={14} />
                          Employment
                        </div>

                        <p className="mt-1.5 text-sm font-semibold text-slate-700">
                          {job.employmentType ||
                            "Not specified"}
                        </p>
                      </div>

                      {/* Applied Date */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays size={14} />
                          Applied On
                        </div>

                        <p className="mt-1.5 text-sm font-semibold text-slate-700">
                          {formatDate(
                            application.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ==================================
                      Cover Letter
                  ================================== */}
                  {application.coverLetter && (
                    <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Cover Letter
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* ==================================
                      Application Status Message
                  ================================== */}
                  <div
                    className={`mt-5 rounded-xl p-4 ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    <p className="text-sm font-semibold">
                      {application.status ===
                        "pending" &&
                        "Your application is under review."}

                      {application.status ===
                        "shortlisted" &&
                        "Congratulations! You have been shortlisted by the employer."}

                      {application.status ===
                        "accepted" &&
                        "Congratulations! Your application has been accepted."}

                      {application.status ===
                        "rejected" &&
                        "Unfortunately, your application was not selected."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;