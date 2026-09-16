import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Edit,
  IndianRupee,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobs/my");

      if (response.data.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error("Fetch My Jobs Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const formatSalary = (salary) => {
    if (salary === undefined || salary === null) {
      return "Not specified";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  const getStatusStyle = (status) => {
    if (status === "open") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "closed") {
      return "bg-red-50 text-red-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading your jobs...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Jobs
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage the jobs you have posted.
            </p>
          </div>

          <Link
            to="/employer/jobs/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Job
          </Link>
        </div>

        {/* Empty */}
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Briefcase
                size={28}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No jobs posted yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first job posting to start
              receiving applications.
            </p>

            <Link
              to="/employer/jobs/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                {/* Job Header */}
                <div className="flex justify-between gap-4">

                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Briefcase
                        size={23}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.employmentType ||
                          "Employment type not specified"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Job Details */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin size={14} />
                      Location
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-700">
                      {job.location || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <IndianRupee size={14} />
                      Salary
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-700">
                      {formatSalary(job.salary)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Users size={14} />
                      Vacancies
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-700">
                      {job.vacancies || 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-400">
                      Created
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-700">
                      {job.createdAt
                        ? new Date(
                            job.createdAt
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">

                  <Link
                    to={`/employer/jobs/${job._id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    <Edit size={16} />
                    Edit Job
                  </Link>

                  <Link
                    to={`/employer/applications?job=${job._id}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Users size={16} />
                    Applications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyJobs;