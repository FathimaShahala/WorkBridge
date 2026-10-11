
import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import axios from "../../services/api";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/admin/complaints");

      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Fetch Admin Complaints Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to fetch complaints.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH STATS
  // ==========================================

  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      const response = await axios.get(
        "/admin/complaints/stats"
      );

      setStats(response.data.stats || null);
    } catch (error) {
      console.error(
        "Fetch Complaint Stats Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch complaint statistics."
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await Promise.all([
      fetchComplaints(),
      fetchStats(),
    ]);
  };

  // ==========================================
  // FILTER COMPLAINTS
  // ==========================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const workerName =
        complaint.worker?.fullName || "";

      const workerEmail =
        complaint.worker?.email || "";

      const employerName =
        complaint.employer?.fullName || "";

      const employerEmail =
        complaint.employer?.email || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.subject
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.description
          ?.toLowerCase()
          .includes(searchText) ||
        workerName
          .toLowerCase()
          .includes(searchText) ||
        workerEmail
          .toLowerCase()
          .includes(searchText) ||
        employerName
          .toLowerCase()
          .includes(searchText) ||
        employerEmail
          .toLowerCase()
          .includes(searchText) ||
        complaint.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        complaint.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    categoryFilter,
  ]);

  // ==========================================
  // VIEW COMPLAINT
  // ==========================================

  const handleViewComplaint = async (id) => {
    try {
      setDetailsLoading(true);

      const response = await axios.get(
        `/admin/complaints/${id}`
      );

      const complaint = response.data.complaint;

      setSelectedComplaint(complaint);

      setEditStatus(complaint.status || "pending");
      setEditRemarks(complaint.officerRemarks || "");
    } catch (error) {
      console.error(
        "Get Complaint Details Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch complaint details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (updating || deleting) return;

    setSelectedComplaint(null);
    setEditStatus("");
    setEditRemarks("");
  };

  // ==========================================
  // UPDATE COMPLAINT
  // ==========================================

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      setUpdating(true);

      const response = await axios.put(
        `/admin/complaints/${selectedComplaint._id}/status`,
        {
          status: editStatus,
          officerRemarks: editRemarks,
        }
      );

      toast.success(
        response.data.message ||
          "Complaint updated successfully."
      );

      const updatedComplaint =
        response.data.complaint;

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === selectedComplaint._id
            ? {
                ...complaint,
                status: updatedComplaint.status,
                officerRemarks:
                  updatedComplaint.officerRemarks,
                resolvedAt:
                  updatedComplaint.resolvedAt,
              }
            : complaint
        )
      );

      setSelectedComplaint((previous) =>
        previous
          ? {
              ...previous,
              status: updatedComplaint.status,
              officerRemarks:
                updatedComplaint.officerRemarks,
              resolvedAt:
                updatedComplaint.resolvedAt,
            }
          : previous
      );

      await fetchStats();
    } catch (error) {
      console.error(
        "Update Complaint Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE COMPLAINT
  // ==========================================

  const handleDeleteComplaint = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await axios.delete(
        `/admin/complaints/${id}`
      );

      toast.success(
        response.data.message ||
          "Complaint deleted successfully."
      );

      setComplaints((previous) =>
        previous.filter(
          (complaint) => complaint._id !== id
        )
      );

      if (selectedComplaint?._id === id) {
        setSelectedComplaint(null);
      }

      await fetchStats();
    } catch (error) {
      console.error(
        "Delete Complaint Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete complaint."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // STATUS HELPERS
  // ==========================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: Clock,
        };

      case "investigating":
        return {
          label: "Investigating",
          className:
            "bg-blue-100 text-blue-700 border-blue-200",
          icon: ShieldAlert,
        };

      case "resolved":
        return {
          label: "Resolved",
          className:
            "bg-green-100 text-green-700 border-green-200",
          icon: CheckCircle,
        };

      case "rejected":
        return {
          label: "Rejected",
          className:
            "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
        };

      default:
        return {
          label: status || "Unknown",
          className:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: AlertTriangle,
        };
    }
  };

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

  const categories = [
    "Wage Issue",
    "Working Conditions",
    "Workplace Safety",
    "Harassment",
    "Contract Issue",
    "Other",
  ];

  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    bg,
    iconBg,
  }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          {statsLoading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {value ?? 0}
            </h3>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${bg}`} />
        </div>
      </div>
    </div>
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading complaints...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Complaints
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor worker complaints.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* STATISTICS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total"
            value={stats?.total}
            icon={AlertTriangle}
            bg="text-gray-600"
            iconBg="bg-gray-100"
          />

          <StatCard
            title="Pending"
            value={stats?.pending}
            icon={Clock}
            bg="text-yellow-600"
            iconBg="bg-yellow-100"
          />

          <StatCard
            title="Investigating"
            value={stats?.investigating}
            icon={ShieldAlert}
            bg="text-blue-600"
            iconBg="bg-blue-100"
          />

          <StatCard
            title="Resolved"
            value={stats?.resolved}
            icon={CheckCircle}
            bg="text-green-600"
            iconBg="bg-green-100"
          />

          <StatCard
            title="Rejected"
            value={stats?.rejected}
            icon={XCircle}
            bg="text-red-600"
            iconBg="bg-red-100"
          />
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* SEARCH */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search complaints, workers, employers..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* STATUS */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="investigating">
                  Investigating
                </option>
                <option value="resolved">
                  Resolved
                </option>
                <option value="rejected">
                  Rejected
                </option>
              </select>
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredComplaints.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {complaints.length}
            </span>{" "}
            complaints
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredComplaints.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No complaints found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-4">
                        Complaint
                      </th>

                      <th className="px-5 py-4">
                        Worker
                      </th>

                      <th className="px-5 py-4">
                        Employer
                      </th>

                      <th className="px-5 py-4">
                        Category
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredComplaints.map(
                      (complaint) => {
                        const status =
                          getStatusConfig(
                            complaint.status
                          );

                        const StatusIcon =
                          status.icon;

                        return (
                          <tr
                            key={complaint._id}
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div className="max-w-[250px]">
                                <p className="truncate font-semibold text-gray-900">
                                  {complaint.subject}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-500">
                                  {complaint.location ||
                                    "Location not provided"}
                                </p>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800">
                                {complaint.worker
                                  ?.fullName ||
                                  "Unknown"}
                              </p>

                              <p className="text-xs text-gray-500">
                                {complaint.worker
                                  ?.email ||
                                  "No email"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800">
                                {complaint.employer
                                  ?.fullName ||
                                  "Not specified"}
                              </p>

                              <p className="text-xs text-gray-500">
                                {complaint.employer
                                  ?.email || "N/A"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                {complaint.category}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-500">
                              {formatDate(
                                complaint.createdAt
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() =>
                                    handleViewComplaint(
                                      complaint._id
                                    )
                                  }
                                  className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteComplaint(
                                      complaint._id
                                    )
                                  }
                                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE / TABLET CARDS */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {filteredComplaints.map(
                (complaint) => {
                  const status =
                    getStatusConfig(
                      complaint.status
                    );

                  const StatusIcon =
                    status.icon;

                  return (
                    <div
                      key={complaint._id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-900">
                            {complaint.subject}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(
                              complaint.createdAt
                            )}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Category
                          </p>

                          <p className="text-sm text-gray-700">
                            {complaint.category}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Worker
                          </p>

                          <p className="text-sm font-medium text-gray-800">
                            {complaint.worker
                              ?.fullName ||
                              "Unknown"}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {complaint.worker
                              ?.email || "No email"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Employer
                          </p>

                          <p className="text-sm font-medium text-gray-800">
                            {complaint.employer
                              ?.fullName ||
                              "Not specified"}
                          </p>
                        </div>

                        {complaint.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 shrink-0" />

                            <span className="truncate">
                              {complaint.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                        <button
                          onClick={() =>
                            handleViewComplaint(
                              complaint._id
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteComplaint(
                              complaint._id
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>

      {/* DETAILS MODAL */}
      {(selectedComplaint || detailsLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                  Complaint Details
                </h2>

                {selectedComplaint && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    ID: {selectedComplaint._id}
                  </p>
                )}
              </div>

              <button
                onClick={closeModal}
                disabled={updating || deleting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* LOADING DETAILS */}
            {detailsLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

                  <p className="mt-3 text-sm text-gray-500">
                    Loading complaint...
                  </p>
                </div>
              </div>
            ) : (
              selectedComplaint && (
                <div className="overflow-y-auto p-5 sm:p-6">
                  {/* SUBJECT / STATUS */}
                  <div className="mb-6 rounded-xl bg-gray-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Subject
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-gray-900">
                          {selectedComplaint.subject}
                        </h3>
                      </div>

                      {(() => {
                        const status =
                          getStatusConfig(
                            selectedComplaint.status
                          );

                        const StatusIcon =
                          status.icon;

                        return (
                          <span
                            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* WORKER / EMPLOYER */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* WORKER */}
                    <div className="rounded-xl border border-gray-200 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />

                        <h3 className="font-semibold text-gray-900">
                          Worker
                        </h3>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-gray-800">
                          {selectedComplaint.worker
                            ?.fullName ||
                            "Unknown"}
                        </p>

                        {selectedComplaint.worker
                          ?.email && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="h-4 w-4" />
                            <span className="break-all">
                              {
                                selectedComplaint
                                  .worker.email
                              }
                            </span>
                          </div>
                        )}

                        {selectedComplaint.worker
                          ?.phone && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone className="h-4 w-4" />
                            <span>
                              {
                                selectedComplaint
                                  .worker.phone
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* EMPLOYER */}
                    <div className="rounded-xl border border-gray-200 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-600" />

                        <h3 className="font-semibold text-gray-900">
                          Employer
                        </h3>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-gray-800">
                          {selectedComplaint.employer
                            ?.fullName ||
                            "Not specified"}
                        </p>

                        {selectedComplaint.employer
                          ?.email && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="h-4 w-4" />

                            <span className="break-all">
                              {
                                selectedComplaint
                                  .employer.email
                              }
                            </span>
                          </div>
                        )}

                        {selectedComplaint.employer
                          ?.phone && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone className="h-4 w-4" />

                            <span>
                              {
                                selectedComplaint
                                  .employer.phone
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* COMPLAINT INFORMATION */}
                  <div className="mt-6">
                    <h3 className="mb-3 text-base font-semibold text-gray-900">
                      Complaint Information
                    </h3>

                    <div className="rounded-xl border border-gray-200 p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Category
                          </p>

                          <p className="mt-1 text-sm text-gray-800">
                            {selectedComplaint.category}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Location
                          </p>

                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-800">
                            <MapPin className="h-4 w-4 text-gray-400" />

                            <span>
                              {selectedComplaint.location ||
                                "Not provided"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Submitted
                          </p>

                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-800">
                            <Calendar className="h-4 w-4 text-gray-400" />

                            <span>
                              {formatDate(
                                selectedComplaint.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Resolved
                          </p>

                          <p className="mt-1 text-sm text-gray-800">
                            {selectedComplaint.resolvedAt
                              ? formatDate(
                                  selectedComplaint.resolvedAt
                                )
                              : "Not resolved"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <p className="text-xs font-medium text-gray-400">
                          Description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                          {selectedComplaint.description ||
                            "No description provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ADMIN UPDATE */}
                  <div className="mt-6">
                    <h3 className="mb-3 text-base font-semibold text-gray-900">
                      Update Complaint
                    </h3>

                    <div className="rounded-xl border border-gray-200 p-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Status
                        </label>

                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(
                              e.target.value
                            )
                          }
                          disabled={updating}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="investigating">
                            Investigating
                          </option>

                          <option value="resolved">
                            Resolved
                          </option>

                          <option value="rejected">
                            Rejected
                          </option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Officer/Admin Remarks
                        </label>

                        <textarea
                          rows={4}
                          value={editRemarks}
                          onChange={(e) =>
                            setEditRemarks(
                              e.target.value
                            )
                          }
                          disabled={updating}
                          placeholder="Enter remarks..."
                          className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <button
                          onClick={handleUpdateComplaint}
                          disabled={updating}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Update Complaint
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteComplaint(
                              selectedComplaint._id
                            )
                          }
                          disabled={
                            updating || deleting
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminComplaints;