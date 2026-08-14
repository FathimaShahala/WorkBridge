import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    employmentType: "",
    requiredSkills: "",
    vacancies: "",
    deadline: "",
    status: "open",
  });

  // =========================
  // Get Job
  // =========================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/jobs/${id}`);

        if (response.data.success) {
          const job = response.data.job;

          setFormData({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            salary: job.salary || "",
            employmentType: job.employmentType || "",
            requiredSkills:
              job.requiredSkills?.join(", ") || "",
            vacancies: job.vacancies || "",
            deadline: job.deadline
              ? job.deadline.split("T")[0]
              : "",
            status: job.status || "open",
          });
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

    fetchJob();
  }, [id]);

  // =========================
  // Handle Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      formData.salary === ""
    ) {
      toast.error(
        "Please fill all required fields."
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
        employmentType: formData.employmentType,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        vacancies:
          formData.vacancies === ""
            ? 0
            : Number(formData.vacancies),
        deadline: formData.deadline || undefined,
        status: formData.status,
      };

      const response = await api.put(
        `/jobs/${id}`,
        payload
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Job updated successfully."
        );

        navigate(`/employer/jobs/${id}`);
      }
    } catch (error) {
      console.error("Update Job Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update job."
      );
    } finally {
      setSaving(false);
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
              Loading job...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          to={`/employer/jobs/${id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Job Details
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Job
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update your job posting information.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Title */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Construction Worker"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the job..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location *
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kochi, Kerala"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Salary *
                </label>

                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  placeholder="25000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Employment Type
                </label>

                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select type
                  </option>

                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Temporary">
                    Temporary
                  </option>
                </select>
              </div>

              {/* Vacancies */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Vacancies
                </label>

                <input
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  min="1"
                  placeholder="10"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Required Skills
                </label>

                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Construction, Masonry, Welding"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate skills with commas.
                </p>
              </div>

              {/* Deadline */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="open">
                    Open
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to={`/employer/jobs/${id}`}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditJob;