import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Users,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Jobs
  // =========================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await api.get("/jobs");

        if (response.data.success) {
          setJobs(response.data.jobs || []);
        }
      } catch (error) {
        console.error("Fetch Jobs Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =========================
  // Format Salary
  // =========================
  const formatSalary = (salary) => {
    if (salary === undefined || salary === null) {
      return "Not specified";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}`;
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
              Loading available jobs...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">

        {/* =========================
            Header
        ========================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Find Jobs
          </h1>

          <p className="mt-2 text-slate-500">
            Explore available job opportunities and find
            the right one for you.
          </p>
        </div>

        {/* =========================
            No Jobs
        ========================= */}
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Briefcase
                size={28}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No jobs available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no open job opportunities.
            </p>
          </div>
        ) : (
          /* =========================
             Job Grid
          ========================= */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                      <Briefcase
                        size={23}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {job.employer?.fullName ||
                          "Employer"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Open
                  </span>
                </div>

                {/* Location */}
                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />
                  {job.location}
                </div>

                {/* Job Information */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <IndianRupee size={13} />
                      Salary
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatSalary(job.salary)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users size={13} />
                      Vacancies
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {job.vacancies || 0}
                    </p>
                  </div>

                </div>

                {/* Employment Type */}
                <div className="mt-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                    {job.employmentType ||
                      "Employment type not specified"}
                  </span>
                </div>

                {/* Skills */}
                {job.requiredSkills?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.requiredSkills
                      .slice(0, 3)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}

                    {job.requiredSkills.length > 3 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        +{job.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* View Details */}
                <Link
                  to={`/worker/jobs/${job._id}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Details
                  <ArrowRight size={17} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;