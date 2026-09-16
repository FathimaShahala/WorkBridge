
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  FileWarning,
  User,
  Building2,
  Calendar,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const LabourOfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [updating, setUpdating] = useState(false);
  const [remarks, setRemarks] = useState("");

  // ==========================================
  // Fetch Complaints
  // ==========================================
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/complaints"
      );

      if (response.data.success) {
        setComplaints(
          response.data.complaints || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch Complaints Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ==========================================
  // Filter
  // ==========================================
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const text = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        complaint.subject
          ?.toLowerCase()
          .includes(text) ||
        complaint.worker?.fullName
          ?.toLowerCase()
          .includes(text) ||
        complaint.employer?.fullName
          ?.toLowerCase()
          .includes(text);

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
  // Open Details
  // ==========================================
  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setRemarks(
      complaint.officerRemarks || ""
    );
  };

  // ==========================================
  // Update Complaint
  // ==========================================
  const updateStatus = async (status) => {
    if (!selectedComplaint) return;

    try {
      setUpdating(true);

      const response = await axios.put(
        `/complaints/${selectedComplaint._id}`,
        {
          status,
          officerRemarks: remarks,
        }
      );

      if (response.data.success) {
        toast.success(
          "Complaint updated successfully."
        );

        setSelectedComplaint(
          response.data.complaint
        );

        setComplaints((prev) =>
          prev.map((item) =>
            item._id ===
            response.data.complaint._id
              ? response.data.complaint
              : item
          )
        );
      }
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
  const getStatusClass = (status) => {
    const styles = {
      pending:
        "bg-yellow-50 text-yellow-700",
      investigating:
        "bg-blue-50 text-blue-700",
      resolved:
        "bg-green-50 text-green-700",
      rejected:
        "bg-red-50 text-red-700",
    };

    return (
      styles[status] ||
      "bg-gray-50 text-gray-700"
    );
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-6 h-8 w-72 rounded bg-gray-200" />

          <div className="mb-6 h-14 rounded-xl bg-gray-200" />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 rounded-2xl bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Complaints
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review and manage worker complaints.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search complaints..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">
                All Status
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

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">
                All Categories
              </option>

              <option value="Wage Issue">
                Wage Issue
              </option>

              <option value="Working Conditions">
                Working Conditions
              </option>

              <option value="Workplace Safety">
                Workplace Safety
              </option>

              <option value="Harassment">
                Harassment
              </option>

              <option value="Contract Issue">
                Contract Issue
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>
        </div>

        {/* Count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredComplaints.length}
          </span>{" "}
          complaints
        </div>

        {/* Complaints */}
        {filteredComplaints.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <FileWarning
              size={50}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="font-semibold text-gray-800">
              No complaints found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredComplaints.map(
              (complaint) => (
                <div
                  key={complaint._id}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <FileWarning size={22} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Complaint
                        </p>

                        <h2 className="line-clamp-1 font-semibold text-gray-900">
                          {complaint.subject}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <div className="mb-4 space-y-2 text-sm text-gray-600">
                    <div className="flex gap-2">
                      <User
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {complaint.worker?.fullName ||
                          "Unknown worker"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Building2
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {complaint.employer?.fullName ||
                          "Employer not specified"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Calendar
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {formatDate(
                          complaint.createdAt
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {complaint.category}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      openComplaint(complaint)
                    }
                    className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View & Manage
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() =>
            setSelectedComplaint(null)
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Complaint Details
                </h2>

                <p className="text-sm text-gray-500">
                  Review complaint information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedComplaint(null)
                }
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">

              <div>
                <p className="text-xs text-gray-500">
                  Subject
                </p>

                <p className="font-semibold text-gray-900">
                  {selectedComplaint.subject}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Worker
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedComplaint.worker
                      ?.fullName ||
                      "Unknown"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedComplaint.worker
                      ?.phone || ""}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Employer
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedComplaint.employer
                      ?.fullName ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {selectedComplaint.category}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                    selectedComplaint.status
                  )}`}
                >
                  {selectedComplaint.status}
                </span>
              </div>

              {selectedComplaint.location && (
                <div className="flex gap-3 rounded-xl bg-gray-50 p-4">
                  <MapPin
                    size={19}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Location
                    </p>

                    <p className="text-sm font-medium">
                      {selectedComplaint.location}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Description
                </p>

                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedComplaint.description}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-gray-500">
                  Officer Remarks
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(e.target.value)
                  }
                  rows={4}
                  placeholder="Add investigation remarks..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-gray-500">
                  Update Status
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <button
                    disabled={updating}
                    onClick={() =>
                      updateStatus("pending")
                    }
                    className="rounded-xl bg-yellow-50 px-3 py-2.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
                  >
                    Pending
                  </button>

                  <button
                    disabled={updating}
                    onClick={() =>
                      updateStatus("investigating")
                    }
                    className="rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Investigating
                  </button>

                  <button
                    disabled={updating}
                    onClick={() =>
                      updateStatus("resolved")
                    }
                    className="rounded-xl bg-green-50 px-3 py-2.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                  >
                    Resolved
                  </button>

                  <button
                    disabled={updating}
                    onClick={() =>
                      updateStatus("rejected")
                    }
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Rejected
                  </button>

                </div>
              </div>

            </div>

            <div className="border-t p-4">
              <button
                onClick={() =>
                  setSelectedComplaint(null)
                }
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default LabourOfficerComplaints;
