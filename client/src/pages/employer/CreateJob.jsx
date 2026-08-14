
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  IndianRupee,
  Users,
  FileText,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    employmentType: "Full Time",
    vacancies: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Changes
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // Add Skill
  // =========================
  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  // =========================
  // Skill Enter Key
  // =========================
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // =========================
  // Remove Skill
  // =========================
  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  // =========================
  // Validate Form
  // =========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Job description is required.";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "Description should contain at least 20 characters.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required.";
    } else if (Number(formData.salary) <= 0) {
      newErrors.salary = "Enter a valid salary.";
    }

    if (!formData.vacancies) {
      newErrors.vacancies =
        "Number of vacancies is required.";
    } else if (Number(formData.vacancies) <= 0) {
      newErrors.vacancies =
        "Enter at least one vacancy.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Submit Job
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await api.post("/jobs", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
        employmentType: formData.employmentType,
        requiredSkills: skills,
        vacancies: Number(formData.vacancies),
      });

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Job created successfully."
        );

        navigate("/employer/dashboard");
      }
    } catch (error) {
      console.error("Create Job Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to create job. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        {/* =========================
            Back
        ========================= */}
        <Link
          to="/employer/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* =========================
            Header
        ========================= */}
        <div className="mb-6">
          <p className="text-sm font-medium text-blue-600">
            Employer Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Create a New Job
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Post a job opportunity and connect with
            qualified workers through WorkBridge.
          </p>
        </div>

        {/* =========================
            Form Card
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          {/* =========================
              Basic Information
          ========================= */}
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Briefcase size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Job Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Provide the basic details of the job.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">

              {/* Job Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Job Title
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Construction Worker"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.title
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Job Description
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the job responsibilities, requirements, and other important details..."
                    className={`w-full resize-none rounded-xl border bg-white py-3 pl-10 pr-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.description
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                </div>

                <div className="mt-1.5 flex justify-between gap-3">
                  {errors.description ? (
                    <p className="text-xs text-red-500">
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Minimum 20 characters.
                    </p>
                  )}

                  <p className="text-xs text-slate-400">
                    {formData.description.length}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Kochi, Kerala"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.location
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.location && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Salary + Vacancies */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Salary */}
                <div>
                  <label
                    htmlFor="salary"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Monthly Salary
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="salary"
                      name="salary"
                      type="number"
                      min="1"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="25000"
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.salary
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  {errors.salary && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.salary}
                    </p>
                  )}
                </div>

                {/* Vacancies */}
                <div>
                  <label
                    htmlFor="vacancies"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Number of Vacancies
                  </label>

                  <div className="relative">
                    <Users
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="vacancies"
                      name="vacancies"
                      type="number"
                      min="1"
                      value={formData.vacancies}
                      onChange={handleChange}
                      placeholder="5"
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.vacancies
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  {errors.vacancies && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.vacancies}
                    </p>
                  )}
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <label
                  htmlFor="employmentType"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Employment Type
                </label>

                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
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

                  <option value="Daily Wage">
                    Daily Wage
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* =========================
              Skills
          ========================= */}
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Required Skills
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add the skills workers should have for this
                position.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. Masonry"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={17} />
                Add Skill
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSkill(skill)
                      }
                      className="rounded-full transition hover:bg-blue-100"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* =========================
              Actions
          ========================= */}
          <div className="flex flex-col-reverse gap-3 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-end sm:p-7">
            <button
              type="button"
              onClick={() =>
                navigate("/employer/dashboard")
              }
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating Job...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
