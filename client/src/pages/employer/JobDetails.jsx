import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Edit,
  IndianRupee,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // =========================
  // Fetch Job
  // =========================
  const fetchJob = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/jobs/${id}`);

      if (response.data.success) {
        setJob(response.data.job);
      }
    } catch (error) {
      console.error("Fetch Job Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load job."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // =========================
  // Delete Job
  // =========================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await api.delete(`/jobs/${id}`);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/employer/dashboard");
      }
    } catch (error) {
      console.error("Delete Job Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading job details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // Job Not Found
  // =========================
  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Briefcase
                size={28}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Job not found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This job may have been deleted or no longer exists.
            </p>

            <Link
              to="/employer/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // Ownership Check
  // =========================
  const isOwner =
    job.employer?._id === user?.id ||
    job.employer?._id === user?._id;

  // =========================
  // Helpers
  // =========================
  const formatSalary = (salary) => {
    if (salary === undefined || salary === null) {
      return "Not specified";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">

        {/* =========================
            Back
        ========================= */}
        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* =========================
            Header
        ========================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
                  <Briefcase
                    size={26}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {job.title}
                  </h1>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={15} />
                    {job.location}
                  </div>
                </div>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
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

          {/* Actions */}
          {isOwner && (
            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <Link
                to={`/employer/jobs/${job._id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Edit size={17} />
                Edit Job
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={17} />

                {deleting
                  ? "Deleting..."
                  : "Delete Job"}
              </button>
            </div>
          )}
        </div>

        {/* =========================
            Job Information
        ========================= */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main Details */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Job Description
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.description}
              </p>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Required Skills
              </h2>

              {job.requiredSkills?.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No specific skills listed.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Job Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Job Details
              </h2>

              <div className="mt-5 space-y-5">

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <IndianRupee
                      size={18}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatSalary(job.salary)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Briefcase
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Employment Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {job.employmentType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2">
                    <Users
                      size={18}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Vacancies
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {job.vacancies || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Calendar
                      size={18}
                      className="text-slate-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Posted On
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>

                {job.deadline && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-orange-50 p-2">
                      <Calendar
                        size={18}
                        className="text-orange-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Application Deadline
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Employer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Posted By
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {job.employer?.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || "E"}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {job.employer?.fullName ||
                      "Employer"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {job.employer?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle
                  size={20}
                  className="mt-0.5 text-emerald-600"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    {job.status === "open"
                      ? "This job is currently open"
                      : "This job is currently closed"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    {job.status === "open"
                      ? "Workers can currently view this job posting."
                      : "This job is no longer accepting applications."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;