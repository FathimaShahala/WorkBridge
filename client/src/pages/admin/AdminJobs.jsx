
import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";
import { toast } from "react-hot-toast";

import {
  Search,
  RefreshCw,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Trash2,
  X,
  MapPin,
  IndianRupee,
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [employmentFilter, setEmploymentFilter] =
    useState("all");

  const [selectedJob, setSelectedJob] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/admin/jobs"
      );

      if (response.data.success) {
        setJobs(response.data.jobs || []);
      } else {
        setError(
          response.data.message ||
            "Failed to fetch jobs."
        );
      }
    } catch (err) {
      console.error("Fetch Admin Jobs Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================================
  // FILTER JOBS
  // ==========================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText) ||
        job.employer?.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        job.employer?.email
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        job.status === statusFilter;

      const matchesEmployment =
        employmentFilter === "all" ||
        job.employmentType ===
          employmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEmployment
      );
    });
  }, [
    jobs,
    search,
    statusFilter,
    employmentFilter,
  ]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalJobs = jobs.length;

  const openJobs = jobs.filter(
    (job) => job.status === "open"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "closed"
  ).length;

  const draftJobs = jobs.filter(
    (job) => job.status === "draft"
  ).length;

  const totalApplications = jobs.reduce(
    (total, job) =>
      total +
      (job.applicationStats?.total || 0),
    0
  );

  const totalVacancies = jobs.reduce(
    (total, job) =>
      total + (job.vacancies || 0),
    0
  );

  // ==========================================
  // OPEN DETAILS
  // ==========================================

  const openDetails = async (job) => {
    try {
      setSelectedJob(job);
      setShowDetails(true);
      setDetailsLoading(true);

      const response = await axios.get(
        `/admin/jobs/${job._id}`
      );

      if (response.data.success) {
        setSelectedJob(response.data.job);
      }
    } catch (err) {
      console.error(
        "Get Admin Job Details Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to load job details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (
    job,
    newStatus
  ) => {
    try {
      setActionLoading(
        `${job._id}-status`
      );

      const response = await axios.put(
        `/admin/jobs/${job._id}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setJobs((prev) =>
          prev.map((item) =>
            item._id === job._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
          )
        );

        if (
          selectedJob?._id === job._id
        ) {
          setSelectedJob((prev) => ({
            ...prev,
            status: newStatus,
          }));
        }

        toast.success(
          "Job status updated successfully."
        );
      }
    } catch (err) {
      console.error(
        "Update Job Status Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update job status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDeleteJob = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"? This will also delete all applications for this job.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `${job._id}-delete`
      );

      const response = await axios.delete(
        `/admin/jobs/${job._id}`
      );

      if (response.data.success) {
        setJobs((prev) =>
          prev.filter(
            (item) => item._id !== job._id
          )
        );

        if (
          selectedJob?._id === job._id
        ) {
          setSelectedJob(null);
          setShowDetails(false);
        }

        toast.success(
          "Job deleted successfully."
        );
      }
    } catch (err) {
      console.error(
        "Delete Job Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to delete job."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

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
  // SALARY FORMAT
  // ==========================================

  const formatSalary = (salary) => {
    if (
      salary === undefined ||
      salary === null
    ) {
      return "N/A";
    }

    return new Intl.NumberFormat("en-IN").format(
      salary
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />

          <p className="text-slate-600">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Manage Jobs
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage job postings, applications
                and job status
              </p>
            </div>

          </div>

          <button
            onClick={fetchJobs}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />

            <div>
              <p className="font-medium text-red-800">
                Unable to load jobs
              </p>

              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

          <SummaryCard
            icon={<Briefcase />}
            title="Total Jobs"
            value={totalJobs}
          />

          <SummaryCard
            icon={<CheckCircle />}
            title="Open"
            value={openJobs}
          />

          <SummaryCard
            icon={<XCircle />}
            title="Closed"
            value={closedJobs}
          />

          <SummaryCard
            icon={<FileText />}
            title="Draft"
            value={draftJobs}
          />

          <SummaryCard
            icon={<Users />}
            title="Applications"
            value={totalApplications}
          />

          <SummaryCard
            icon={<User />}
            title="Vacancies"
            value={totalVacancies}
          />

        </div>

        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

            {/* Search */}

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search job, location or employer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="open">
                Open
              </option>

              <option value="closed">
                Closed
              </option>

              <option value="draft">
                Draft
              </option>
            </select>

            {/* Employment */}

            <select
              value={employmentFilter}
              onChange={(e) =>
                setEmploymentFilter(
                  e.target.value
                )
              }
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                All Employment Types
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

            {/* Results */}

            <div className="flex items-center justify-center md:justify-start px-4 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900 mx-1">
                {filteredJobs.length}
              </span>
              of{" "}
              <span className="font-semibold text-slate-900 ml-1">
                {totalJobs}
              </span>
            </div>

          </div>
        </div>

        {/* ======================================
            DESKTOP TABLE
        ====================================== */}

        <div className="hidden lg:block bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Job
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Employer
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Salary
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Applications
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredJobs.length === 0 ? (
                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center"
                    >

                      <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                      <p className="font-medium text-slate-700">
                        No jobs found
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search
                        or filters.
                      </p>

                    </td>

                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* Job */}

                      <td className="px-5 py-4">

                        <div className="max-w-xs">

                          <p className="font-semibold text-slate-900 truncate">
                            {job.title}
                          </p>

                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">
                              {job.location}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            {job.employmentType}
                          </p>

                        </div>

                      </td>

                      {/* Employer */}

                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-slate-800">
                          {job.employer?.fullName ||
                            "N/A"}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {job.employer?.email ||
                            "N/A"}
                        </p>

                      </td>

                      {/* Salary */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">

                          <IndianRupee className="w-4 h-4" />

                          {formatSalary(
                            job.salary
                          )}

                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          {job.vacancies || 0}{" "}
                          vacancies
                        </p>

                      </td>

                      {/* Applications */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Users className="w-4 h-4 text-blue-500" />

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {job.applicationStats
                                ?.total || 0}
                            </p>

                            <p className="text-xs text-slate-500">
                              {job.applicationStats
                                ?.accepted || 0}{" "}
                              accepted
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <JobStatusBadge
                          status={job.status}
                        />

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() =>
                              openDetails(job)
                            }
                            title="View details"
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <StatusDropdown
                            job={job}
                            loading={
                              actionLoading ===
                              `${job._id}-status`
                            }
                            onChange={
                              handleStatusChange
                            }
                          />

                          <button
                            onClick={() =>
                              handleDeleteJob(
                                job
                              )
                            }
                            disabled={
                              actionLoading ===
                              `${job._id}-delete`
                            }
                            title="Delete job"
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          >
                            {actionLoading ===
                            `${job._id}-delete` ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* ======================================
            MOBILE / TABLET CARDS
        ====================================== */}

        <div className="lg:hidden space-y-4">

          {filteredJobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="font-medium text-slate-700">
                No jobs found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search
                or filters.
              </p>

            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
              >

                {/* Header */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="font-semibold text-slate-900">
                      {job.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {job.employer?.fullName ||
                        "Employer unavailable"}
                    </p>

                  </div>

                  <JobStatusBadge
                    status={job.status}
                  />

                </div>

                {/* Details */}

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <InfoItem
                    icon={<MapPin />}
                    label="Location"
                    value={job.location}
                  />

                  <InfoItem
                    icon={<IndianRupee />}
                    label="Salary"
                    value={`₹${formatSalary(
                      job.salary
                    )}`}
                  />

                  <InfoItem
                    icon={<Users />}
                    label="Applications"
                    value={
                      job.applicationStats
                        ?.total || 0
                    }
                  />

                  <InfoItem
                    icon={<User />}
                    label="Vacancies"
                    value={job.vacancies || 0}
                  />

                </div>

                {/* Employment */}

                <div className="flex flex-wrap gap-2 mt-4">

                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs">
                    {job.employmentType}
                  </span>

                  {job.deadline && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Deadline:{" "}
                      {formatDate(
                        job.deadline
                      )}
                    </span>
                  )}

                </div>

                {/* Actions */}

                <div className="grid grid-cols-3 gap-2 mt-5">

                  <button
                    onClick={() =>
                      openDetails(job)
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>

                  <StatusDropdown
                    job={job}
                    loading={
                      actionLoading ===
                      `${job._id}-status`
                    }
                    onChange={
                      handleStatusChange
                    }
                    mobile
                  />

                  <button
                    onClick={() =>
                      handleDeleteJob(job)
                    }
                    disabled={
                      actionLoading ===
                      `${job._id}-delete`
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition"
                  >
                    {actionLoading ===
                    `${job._id}-delete` ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* ======================================
            DETAILS MODAL
        ====================================== */}

        {showDetails && selectedJob && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() =>
              setShowDetails(false)
            }
          >

            <div
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* Modal Header */}

              <div className="flex items-center justify-between p-5 border-b border-slate-200">

                <div className="min-w-0">

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {selectedJob.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Job Details
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowDetails(false)
                  }
                  className="p-2 rounded-lg hover:bg-slate-100 transition flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

              </div>

              {/* Modal Content */}

              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-5">

                {detailsLoading ? (
                  <div className="py-16 text-center">

                    <RefreshCw className="w-7 h-7 text-blue-600 animate-spin mx-auto mb-3" />

                    <p className="text-sm text-slate-500">
                      Loading job details...
                    </p>

                  </div>
                ) : (
                  <>

                    {/* Job Overview */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                      <DetailItem
                        icon={<MapPin />}
                        label="Location"
                        value={
                          selectedJob.location
                        }
                      />

                      <DetailItem
                        icon={<IndianRupee />}
                        label="Salary"
                        value={`₹${formatSalary(
                          selectedJob.salary
                        )}`}
                      />

                      <DetailItem
                        icon={<Clock />}
                        label="Employment Type"
                        value={
                          selectedJob.employmentType
                        }
                      />

                      <DetailItem
                        icon={<Users />}
                        label="Vacancies"
                        value={
                          selectedJob.vacancies
                        }
                      />

                      <DetailItem
                        icon={<CalendarDays />}
                        label="Posted"
                        value={formatDate(
                          selectedJob.createdAt
                        )}
                      />

                      <DetailItem
                        icon={<CalendarDays />}
                        label="Deadline"
                        value={formatDate(
                          selectedJob.deadline
                        )}
                      />

                    </div>

                    {/* Status */}

                    <div className="flex flex-wrap items-center gap-3 mb-6">

                      <span className="text-sm font-medium text-slate-700">
                        Current Status:
                      </span>

                      <JobStatusBadge
                        status={
                          selectedJob.status
                        }
                      />

                    </div>

                    {/* Description */}

                    <div className="mb-6">

                      <h3 className="font-semibold text-slate-900 mb-2">
                        Job Description
                      </h3>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

                        <p className="text-sm text-slate-700 whitespace-pre-line leading-6">
                          {selectedJob.description ||
                            "No description provided."}
                        </p>

                      </div>

                    </div>

                    {/* Skills */}

                    <div className="mb-6">

                      <h3 className="font-semibold text-slate-900 mb-3">
                        Required Skills
                      </h3>

                      {selectedJob.requiredSkills
                        ?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">

                          {selectedJob.requiredSkills.map(
                            (skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                              >
                                {skill}
                              </span>
                            )
                          )}

                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          No specific skills listed.
                        </p>
                      )}

                    </div>

                    {/* Employer */}

                    <div className="mb-6">

                      <h3 className="font-semibold text-slate-900 mb-3">
                        Employer
                      </h3>

                      <div className="border border-slate-200 rounded-xl p-4">

                        <div className="flex items-center gap-3 mb-4">

                          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {selectedJob
                                .employer
                                ?.fullName ||
                                "N/A"}
                            </p>

                            <p className="text-xs text-slate-500">
                              Employer
                            </p>

                          </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          <InfoItem
                            icon={<Mail />}
                            label="Email"
                            value={
                              selectedJob
                                .employer
                                ?.email
                            }
                          />

                          <InfoItem
                            icon={<Phone />}
                            label="Phone"
                            value={
                              selectedJob
                                .employer
                                ?.phone
                            }
                          />

                        </div>

                      </div>

                    </div>

                    {/* Application Stats */}

                    <div className="mb-6">

                      <h3 className="font-semibold text-slate-900 mb-3">
                        Application Statistics
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

                        <MiniStat
                          label="Total"
                          value={
                            selectedJob
                              .applicationStats
                              ?.total || 0
                          }
                        />

                        <MiniStat
                          label="Pending"
                          value={
                            selectedJob
                              .applicationStats
                              ?.pending || 0
                          }
                        />

                        <MiniStat
                          label="Shortlisted"
                          value={
                            selectedJob
                              .applicationStats
                              ?.shortlisted || 0
                          }
                        />

                        <MiniStat
                          label="Accepted"
                          value={
                            selectedJob
                              .applicationStats
                              ?.accepted || 0
                          }
                        />

                        <MiniStat
                          label="Rejected"
                          value={
                            selectedJob
                              .applicationStats
                              ?.rejected || 0
                          }
                        />

                      </div>

                    </div>

                    {/* Applications */}

                    <div className="mb-6">

                      <div className="flex items-center justify-between mb-3">

                        <h3 className="font-semibold text-slate-900">
                          Applications
                        </h3>

                        <span className="text-xs text-slate-500">
                          {selectedJob
                            .applications
                            ?.length || 0}{" "}
                          applications
                        </span>

                      </div>

                      {selectedJob.applications
                        ?.length === 0 ? (
                        <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">

                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />

                          <p className="text-sm text-slate-500">
                            No applications yet.
                          </p>

                        </div>
                      ) : (
                        <div className="space-y-3">

                          {selectedJob.applications.map(
                            (application) => (
                              <div
                                key={
                                  application._id
                                }
                                className="border border-slate-200 rounded-xl p-4"
                              >

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                  <div>

                                    <p className="font-semibold text-slate-900">
                                      {application
                                        .worker
                                        ?.fullName ||
                                        "Worker unavailable"}
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                      {application
                                        .worker
                                        ?.email ||
                                        "N/A"}
                                    </p>

                                  </div>

                                  <ApplicationStatusBadge
                                    status={
                                      application.status
                                    }
                                  />

                                </div>

                                {application.coverLetter && (
                                  <div className="mt-3 bg-slate-50 rounded-lg p-3">

                                    <p className="text-xs font-medium text-slate-500 mb-1">
                                      Cover Letter
                                    </p>

                                    <p className="text-sm text-slate-700 whitespace-pre-line">
                                      {
                                        application.coverLetter
                                      }
                                    </p>

                                  </div>
                                )}

                                <p className="text-xs text-slate-400 mt-3">
                                  Applied on{" "}
                                  {formatDate(
                                    application.createdAt
                                  )}
                                </p>

                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>

                    {/* Actions */}

                    <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-200">

                      <div className="relative flex-1">

                        <select
                          value={
                            selectedJob.status
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              selectedJob,
                              e.target.value
                            )
                          }
                          disabled={
                            actionLoading ===
                            `${selectedJob._id}-status`
                          }
                          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="open">
                            Open
                          </option>

                          <option value="closed">
                            Closed
                          </option>

                          <option value="draft">
                            Draft
                          </option>
                        </select>

                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteJob(
                            selectedJob
                          )
                        }
                        disabled={
                          actionLoading ===
                          `${selectedJob._id}-delete`
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium transition"
                      >
                        {actionLoading ===
                        `${selectedJob._id}-delete` ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete Job
                          </>
                        )}
                      </button>

                    </div>

                  </>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};


// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({
  icon,
  title,
  value,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">

      <div className="flex items-center justify-between gap-2">

        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>

        <span className="text-xs text-slate-500 text-right">
          {title}
        </span>

      </div>

      <p className="text-2xl font-bold text-slate-900 mt-3">
        {value}
      </p>

    </div>
  );
};


// ==========================================
// STATUS DROPDOWN
// ==========================================

const StatusDropdown = ({
  job,
  loading,
  onChange,
  mobile = false,
}) => {
  if (mobile) {
    return (
      <div className="relative">

        <select
          value={job.status}
          onChange={(e) =>
            onChange(
              job,
              e.target.value
            )
          }
          disabled={loading}
          className="w-full appearance-none px-3 py-2 pr-7 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="open">
            Open
          </option>

          <option value="closed">
            Closed
          </option>

          <option value="draft">
            Draft
          </option>
        </select>

        {loading ? (
          <RefreshCw className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-slate-500 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        )}

      </div>
    );
  }

  return (
    <div className="relative">

      <select
        value={job.status}
        onChange={(e) =>
          onChange(
            job,
            e.target.value
          )
        }
        disabled={loading}
        title="Change job status"
        className="appearance-none w-9 h-9 pl-2 pr-6 rounded-lg bg-slate-50 text-slate-600 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="open">
          Open
        </option>

        <option value="closed">
          Closed
        </option>

        <option value="draft">
          Draft
        </option>
      </select>

      {loading ? (
        <RefreshCw className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-slate-500 pointer-events-none" />
      ) : (
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
      )}

    </div>
  );
};


// ==========================================
// JOB STATUS BADGE
// ==========================================

const JobStatusBadge = ({ status }) => {
  const styles = {
    open: "bg-green-50 text-green-700",
    closed: "bg-red-50 text-red-700",
    draft: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status
        ? status.charAt(0).toUpperCase() +
          status.slice(1)
        : "Unknown"}
    </span>
  );
};


// ==========================================
// APPLICATION STATUS
// ==========================================

const ApplicationStatusBadge = ({
  status,
}) => {
  const styles = {
    pending:
      "bg-amber-50 text-amber-700",
    shortlisted:
      "bg-blue-50 text-blue-700",
    accepted:
      "bg-green-50 text-green-700",
    rejected:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status
        ? status.charAt(0).toUpperCase() +
          status.slice(1)
        : "Unknown"}
    </span>
  );
};


// ==========================================
// INFO ITEM
// ==========================================

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-slate-50 rounded-lg p-3">

      <div className="flex items-center gap-2 text-slate-400 mb-1">

        <span className="w-4 h-4">
          {icon}
        </span>

        <span className="text-xs">
          {label}
        </span>

      </div>

      <p className="text-sm font-medium text-slate-800 truncate">
        {value || "N/A"}
      </p>

    </div>
  );
};


// ==========================================
// DETAIL ITEM
// ==========================================

const DetailItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4">

      <div className="flex items-center gap-2 text-slate-400 mb-2">

        <span className="w-4 h-4">
          {icon}
        </span>

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>

      <p className="text-sm font-medium text-slate-800 break-words">
        {value || "N/A"}
      </p>

    </div>
  );
};


// ==========================================
// MINI STAT
// ==========================================

const MiniStat = ({
  label,
  value,
}) => {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">

      <p className="text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {label}
      </p>

    </div>
  );
};


export default AdminJobs;
