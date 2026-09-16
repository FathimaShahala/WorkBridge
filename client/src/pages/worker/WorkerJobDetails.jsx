import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  IndianRupee,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const WorkerJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");

  // ==========================================
  // Fetch Job
  // ==========================================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/jobs/${id}`);

        if (response.data.success) {
          setJob(response.data.job);
        }
      } catch (error) {
        console.error("Fetch Job Details Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================================
  // Format Salary
  // ==========================================
  const formatSalary = (salary) => {
    if (salary === undefined || salary === null) {
      return "Not specified";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // Format Deadline
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "No deadline specified";

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
  // Check Deadline
  // ==========================================
  const isDeadlinePassed =
    job?.deadline &&
    new Date(job.deadline) < new Date();

  // ==========================================
  // Apply for Job
  // ==========================================
  const handleApply = async (e) => {
    e.preventDefault();

    if (!job) return;

    if (job.status !== "open") {
      toast.error(
        "This job is no longer accepting applications."
      );

      return;
    }

    if (isDeadlinePassed) {
      toast.error(
        "The application deadline has passed."
      );

      return;
    }

    try {
      setApplying(true);

      const response = await api.post(
        "/applications",
        {
          jobId: job._id,
          coverLetter: coverLetter.trim(),
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Application submitted successfully."
        );

        navigate("/worker/applications");
      }
    } catch (error) {
      console.error("Apply Job Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setApplying(false);
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
              Loading job details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // Job Not Found
  // ==========================================
  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Job not found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This job may have been removed.
            </p>

            <Link
              to="/worker/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Jobs
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const canApply =
    job.status === "open" && !isDeadlinePassed;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">

        {/* ======================================
            Back
        ====================================== */}
        <Link
          to="/worker/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </Link>

        {/* ======================================
            Job Header
        ====================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row">

            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                <Briefcase
                  size={27}
                  className="text-blue-600"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {job.title}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      job.status === "open"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {job.status === "open"
                      ? "Open"
                      : "Closed"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Posted by{" "}
                  <span className="font-semibold text-slate-700">
                    {job.employer?.fullName ||
                      "Employer"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ======================================
              Job Information
          ====================================== */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin size={15} />
                Location
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {job.location}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <IndianRupee size={15} />
                Salary
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {formatSalary(job.salary)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Briefcase size={15} />
                Employment
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {job.employmentType ||
                  "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users size={15} />
                Vacancies
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {job.vacancies || 0}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================
            Main Content
        ====================================== */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ====================================
              Job Description
          ==================================== */}
          <div className="space-y-6 lg:col-span-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Job Description
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Required Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.requiredSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Employer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                About the Employer
              </h2>

              <div className="mt-4">
                <p className="font-semibold text-slate-800">
                  {job.employer?.fullName ||
                    "Employer"}
                </p>

                {job.employer?.email && (
                  <p className="mt-1 text-sm text-slate-500">
                    {job.employer.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ====================================
              Apply Section
          ==================================== */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Apply for this Job
              </h2>

              {/* Deadline */}
              <div className="mt-5 flex items-start gap-3">
                <CalendarDays
                  size={18}
                  className="mt-0.5 text-slate-400"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Application Deadline
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {formatDate(job.deadline)}
                  </p>
                </div>
              </div>

              {!canApply ? (
                <div className="mt-6 rounded-xl bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-600">
                    {job.status !== "open"
                      ? "Applications are closed."
                      : "The application deadline has passed."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleApply}
                  className="mt-6"
                >
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Cover Letter
                  </label>

                  <textarea
                    value={coverLetter}
                    onChange={(e) =>
                      setCoverLetter(e.target.value)
                    }
                    rows={7}
                    placeholder="Tell the employer why you are suitable for this job..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="submit"
                    disabled={applying}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={17} />

                    {applying
                      ? "Submitting..."
                      : "Apply Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerJobDetails;