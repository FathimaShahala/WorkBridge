
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  Users,
} from "lucide-react";

import { toast } from "react-hot-toast";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // Fetch Employer Applications
  // ==========================================
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/applications/employer");

      if (response.data.success) {
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      console.error("Fetch Employer Applications Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================================
  // Update Application Status
  // ==========================================
  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      const response = await axios.put(
        `/applications/${applicationId}/status`,
        {
          status,
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Application status updated."
        );

        // Update application locally
        setApplications((prev) =>
          prev.map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status:
                    response.data.application?.status ||
                    status,
                }
              : application
          )
        );
      }
    } catch (error) {
      console.error(
        "Update Application Status Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // Filter Applications
  // ==========================================
  const filteredApplications = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return applications.filter((application) => {
      const workerName =
        application.worker?.fullName?.toLowerCase() || "";

      const workerEmail =
        application.worker?.email?.toLowerCase() || "";

      const workerPhone =
        application.worker?.phone?.toLowerCase() || "";

      const jobTitle =
        application.job?.title?.toLowerCase() || "";

      const jobLocation =
        application.job?.location?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        workerName.includes(searchValue) ||
        workerEmail.includes(searchValue) ||
        workerPhone.includes(searchValue) ||
        jobTitle.includes(searchValue) ||
        jobLocation.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // ==========================================
  // Status Badge
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <CheckCircle size={14} />
            Accepted
          </span>
        );

      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <XCircle size={14} />
            Rejected
          </span>
        );

      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <Users size={14} />
            Shortlisted
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            <Clock size={14} />
            Pending
          </span>
        );
    }
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
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={24}
            className="animate-spin"
          />
          <span>Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* ======================================
          Header
      ====================================== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Applications
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Review and manage applications received
          for your jobs.
        </p>
      </div>

      {/* ======================================
          Search + Filter
      ====================================== */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by worker, job, email or location..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status */}
          <div className="relative w-full lg:w-56">
            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="shortlisted">
                Shortlisted
              </option>

              <option value="accepted">
                Accepted
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================
          Results Count
      ====================================== */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredApplications.length}
          </span>{" "}
          application
          {filteredApplications.length !== 1
            ? "s"
            : ""}
        </p>
      </div>

      {/* ======================================
          Empty State
      ====================================== */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Briefcase
              size={26}
              className="text-gray-400"
            />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No applications found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {search || statusFilter !== "all"
              ? "Try changing your search or filter."
              : "You have not received any applications yet."}
          </p>
        </div>
      ) : (
        /* ======================================
           Applications
        ====================================== */
        <div className="grid gap-5">

          {filteredApplications.map(
            (application) => {
              const worker =
                application.worker || {};

              const job =
                application.job || {};

              const isUpdating =
                updatingId ===
                application._id;

              return (
                <div
                  key={application._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* =================================
                      Card Header
                  ================================= */}
                  <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      {/* Profile Image */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">

                        {worker.profileImage ? (
                          <img
                            src={
                              worker.profileImage.startsWith(
                                "http"
                              )
                                ? worker.profileImage
                                : `${
                                    import.meta.env
                                      .VITE_API_URL ||
                                    "http://localhost:5000"
                                  }${worker.profileImage}`
                            }
                            alt={
                              worker.fullName ||
                              "Worker"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User
                            size={22}
                            className="text-blue-600"
                          />
                        )}
                      </div>

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {worker.fullName ||
                            "Unknown Worker"}
                        </h2>

                        <p className="text-sm text-gray-500">
                          Applied for{" "}
                          <span className="font-medium text-gray-700">
                            {job.title ||
                              "Unknown Job"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {getStatusBadge(
                      application.status
                    )}
                  </div>

                  {/* =================================
                      Card Body
                  ================================= */}
                  <div className="grid gap-6 p-5 lg:grid-cols-3">

                    {/* Worker Information */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Worker Information
                      </h3>

                      <div className="space-y-3">

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Mail
                            size={17}
                            className="text-gray-400"
                          />
                          <span className="break-all">
                            {worker.email ||
                              "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Phone
                            size={17}
                            className="text-gray-400"
                          />
                          <span>
                            {worker.phone ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Job Information */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Job Information
                      </h3>

                      <div className="space-y-3">

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Briefcase
                            size={17}
                            className="text-gray-400"
                          />

                          <span>
                            {job.title ||
                              "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <MapPin
                            size={17}
                            className="text-gray-400"
                          />

                          <span>
                            {job.location ||
                              "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Calendar
                            size={17}
                            className="text-gray-400"
                          />

                          <span>
                            Applied{" "}
                            {formatDate(
                              application.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Cover Letter
                      </h3>

                      {application.coverLetter ? (
                        <p className="line-clamp-4 text-sm leading-6 text-gray-600">
                          {
                            application.coverLetter
                          }
                        </p>
                      ) : (
                        <p className="text-sm italic text-gray-400">
                          No cover letter provided.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =================================
                      Actions
                  ================================= */}
                  <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* View */}
                    <Link
                      to={`/employer/applications/${application._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      <Eye size={17} />
                      View Details
                    </Link>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">

                      {application.status !==
                        "shortlisted" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "shortlisted"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Users size={16} />
                          )}

                          Shortlist
                        </button>
                      )}

                      {application.status !==
                        "accepted" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "accepted"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle
                              size={16}
                            />
                          )}

                          Accept
                        </button>
                      )}

                      {application.status !==
                        "rejected" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "rejected"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <XCircle size={16} />
                          )}

                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default EmployerApplications;
