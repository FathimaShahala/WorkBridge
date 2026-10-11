

import { useEffect, useState } from "react";
import {
  Search,
  FileWarning,
  X,
  User,
  Building2,
} from "lucide-react";

import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const PoliceComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [remarks, setRemarks] =
    useState("");

  const [status, setStatus] =
    useState("pending");

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response =
        await axios.get(
          "/police/complaints"
        );

      if (response.data.success) {
        setComplaints(
          response.data.complaints
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openComplaint = (complaint) => {
    setSelectedComplaint(
      complaint
    );

    setStatus(
      complaint.status
    );

    setRemarks(
      complaint.officerRemarks ||
        ""
    );
  };

  const updateComplaint = async () => {
    try {
      setUpdating(true);

      const response =
        await axios.put(
          `/police/complaints/${selectedComplaint._id}`,
          {
            status,
            officerRemarks: remarks,
          }
        );

      if (response.data.success) {
        toast.success(
          "Complaint updated successfully."
        );

        setComplaints((prev) =>
          prev.map((item) =>
            item._id ===
            selectedComplaint._id
              ? response.data.complaint
              : item
          )
        );

        setSelectedComplaint(null);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint."
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredComplaints =
    complaints.filter(
      (complaint) => {
        const text =
          search.toLowerCase();

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
          complaint.status ===
            statusFilter;

        const matchesCategory =
          categoryFilter ===
            "all" ||
          complaint.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Police Complaints
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review complaints that may require police attention.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
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
                setCategoryFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
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

        {/* Complaints */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            Loading complaints...
          </div>
        ) : filteredComplaints.length ===
          0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            No complaints found.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">

            {filteredComplaints.map(
              (complaint) => (
                <div
                  key={complaint._id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <FileWarning
                          size={21}
                        />
                      </div>

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {complaint.subject}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                          {complaint.category}
                        </p>
                      </div>

                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-600">
                      {complaint.status}
                    </span>

                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-gray-600">
                    {complaint.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">

                    <div className="flex items-center gap-2">
                      <User size={16} />

                      Worker:{" "}
                      {complaint.worker
                        ?.fullName ||
                        "Unknown"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2
                        size={16}
                      />

                      Employer:{" "}
                      {complaint.employer
                        ?.fullName ||
                        "Not specified"}
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      openComplaint(
                        complaint
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Review Complaint
                  </button>

                </div>
              )
            )}

          </div>
        )}

        {/* Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  Complaint Details
                </h2>

                <button
                  onClick={() =>
                    setSelectedComplaint(
                      null
                    )
                  }
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>

              </div>

              <h3 className="text-lg font-semibold">
                {selectedComplaint.subject}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Category:{" "}
                {selectedComplaint.category}
              </p>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-700">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border p-4">
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

                <div className="rounded-xl border p-4">
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

              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
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

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium">
                  Police Remarks
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Enter investigation remarks..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />

              </div>

              <button
                disabled={updating}
                onClick={
                  updateComplaint
                }
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Update Complaint"}
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default PoliceComplaints;

