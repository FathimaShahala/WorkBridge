
import { useEffect, useMemo, useState } from "react";

import {
  Search,
  X,
  ClipboardCheck,
  Calendar,
  MapPin,
  Building2,
  User,
  Plus,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const LabourOfficerInspections = () => {
  const [inspections, setInspections] =
    useState([]);

  const [employers, setEmployers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedInspection, setSelectedInspection] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    employer: "",
    workplace: "",
    location: "",
    inspectionDate: "",
    type: "Routine",
    findings: "",
    remarks: "",
    violationsFound: false,
  });

  // ==========================================
  // Fetch Data
  // ==========================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        inspectionsResponse,
        employersResponse,
      ] = await Promise.all([
        axios.get("/inspections"),
        axios.get("/users/employers"),
      ]);

      if (
        inspectionsResponse.data.success
      ) {
        setInspections(
          inspectionsResponse.data
            .inspections || []
        );
      }

      if (employersResponse.data.success) {
        setEmployers(
          employersResponse.data.employers || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch Inspection Data Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch inspection data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // Filter
  // ==========================================
  const filteredInspections = useMemo(() => {
    return inspections.filter(
      (inspection) => {
        const text =
          search.toLowerCase().trim();

        const matchesSearch =
          inspection.workplace
            ?.toLowerCase()
            .includes(text) ||
          inspection.location
            ?.toLowerCase()
            .includes(text) ||
          inspection.employer?.fullName
            ?.toLowerCase()
            .includes(text);

        const matchesStatus =
          statusFilter === "all" ||
          inspection.status === statusFilter;

        const matchesType =
          typeFilter === "all" ||
          inspection.type === typeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType
        );
      }
    );
  }, [
    inspections,
    search,
    statusFilter,
    typeFilter,
  ]);

  // ==========================================
  // Form Change
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // Create Inspection
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.employer ||
      !form.workplace ||
      !form.location ||
      !form.inspectionDate
    ) {
      toast.error(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        "/inspections",
        form
      );

      if (response.data.success) {
        toast.success(
          "Inspection created successfully."
        );

        setInspections((prev) => [
          response.data.inspection,
          ...prev,
        ]);

        setForm({
          employer: "",
          workplace: "",
          location: "",
          inspectionDate: "",
          type: "Routine",
          findings: "",
          remarks: "",
          violationsFound: false,
        });

        setShowForm(false);
      }
    } catch (error) {
      console.error(
        "Create Inspection Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create inspection."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Update Status
  // ==========================================
  const updateStatus = async (status) => {
    if (!selectedInspection) return;

    try {
      const response = await axios.put(
        `/inspections/${selectedInspection._id}`,
        {
          status,
        }
      );

      if (response.data.success) {
        toast.success(
          "Inspection updated."
        );

        setSelectedInspection(
          response.data.inspection
        );

        setInspections((prev) =>
          prev.map((item) =>
            item._id ===
            response.data.inspection._id
              ? response.data.inspection
              : item
          )
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update inspection."
      );
    }
  };

  // ==========================================
  // Delete
  // ==========================================
  const deleteInspection = async (
    id
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inspection?"
    );

    if (!confirmed) return;

    try {
      const response =
        await axios.delete(
          `/inspections/${id}`
        );

      if (response.data.success) {
        toast.success(
          "Inspection deleted."
        );

        setInspections((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );

        setSelectedInspection(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete inspection."
      );
    }
  };

  // ==========================================
  // Date
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
  // Status Class
  // ==========================================
  const getStatusClass = (status) => {
    const styles = {
      scheduled:
        "bg-yellow-50 text-yellow-700",
      "in-progress":
        "bg-blue-50 text-blue-700",
      completed:
        "bg-green-50 text-green-700",
      cancelled:
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Inspections
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Schedule and manage workplace inspections.
            </p>
          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            New Inspection
          </button>
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
                placeholder="Search workplace, location..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="all">
                All Status
              </option>

              <option value="scheduled">
                Scheduled
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="all">
                All Types
              </option>

              <option value="Routine">
                Routine
              </option>

              <option value="Complaint Based">
                Complaint Based
              </option>

              <option value="Safety">
                Safety
              </option>

              <option value="Follow Up">
                Follow Up
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>
        </div>

        {/* Cards */}
        {filteredInspections.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <ClipboardCheck
              size={50}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="font-semibold text-gray-800">
              No inspections found
            </h3>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {filteredInspections.map(
              (inspection) => (
                <div
                  key={inspection._id}
                  className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <ClipboardCheck
                          size={22}
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Workplace
                        </p>

                        <h2 className="font-semibold text-gray-900">
                          {inspection.workplace}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                        inspection.status
                      )}`}
                    >
                      {inspection.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">

                    <div className="flex gap-2">
                      <Building2
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {inspection.employer
                          ?.fullName ||
                          "Unknown employer"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <MapPin
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {inspection.location}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Calendar
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {formatDate(
                          inspection.inspectionDate
                        )}
                      </span>
                    </div>

                  </div>

                  <div className="my-4 flex items-center justify-between">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {inspection.type}
                    </span>

                    {inspection.violationsFound && (
                      <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                        Violation Found
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setSelectedInspection(
                        inspection
                      )
                    }
                    className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* ==========================================
          Create Modal
      ========================================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-bold text-gray-900">
                  New Inspection
                </h2>

                <p className="text-sm text-gray-500">
                  Schedule a workplace inspection.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Employer *
                </label>

                <select
                  name="employer"
                  value={form.employer}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                >
                  <option value="">
                    Select employer
                  </option>

                  {employers.map(
                    (employer) => (
                      <option
                        key={employer._id}
                        value={employer._id}
                      >
                        {employer.fullName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Workplace *
                </label>

                <input
                  name="workplace"
                  value={form.workplace}
                  onChange={handleChange}
                  placeholder="e.g. ABC Construction Site"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location *
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Kochi"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Inspection Date *
                  </label>

                  <input
                    type="date"
                    name="inspectionDate"
                    value={
                      form.inspectionDate
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Inspection Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  >
                    <option value="Routine">
                      Routine
                    </option>

                    <option value="Complaint Based">
                      Complaint Based
                    </option>

                    <option value="Safety">
                      Safety
                    </option>

                    <option value="Follow Up">
                      Follow Up
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Findings
                </label>

                <textarea
                  name="findings"
                  value={form.findings}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Inspection findings..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Additional remarks..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm"
                />
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <input
                  type="checkbox"
                  name="violationsFound"
                  checked={
                    form.violationsFound
                  }
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-gray-700">
                  Violations found
                </span>
              </label>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Inspection"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          Details Modal
      ========================================== */}
      {selectedInspection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() =>
            setSelectedInspection(null)
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
                <h2 className="font-bold text-gray-900">
                  Inspection Details
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedInspection.workplace}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedInspection(null)
                }
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Employer
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedInspection.employer
                      ?.fullName ||
                      "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Officer
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedInspection.officer
                      ?.fullName ||
                      "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(
                      selectedInspection.inspectionDate
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Type
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedInspection.type}
                  </p>
                </div>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Location
                </p>

                <p className="mt-1 text-sm">
                  {selectedInspection.location}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Findings
                </p>

                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6">
                  {selectedInspection.findings ||
                    "No findings recorded."}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Remarks
                </p>

                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6">
                  {selectedInspection.remarks ||
                    "No remarks."}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Status
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                  <button
                    onClick={() =>
                      updateStatus(
                        "scheduled"
                      )
                    }
                    className="rounded-xl bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700"
                  >
                    Scheduled
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        "in-progress"
                      )
                    }
                    className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        "completed"
                      )
                    }
                    className="rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
                  >
                    Completed
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        "cancelled"
                      )
                    }
                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                  >
                    Cancelled
                  </button>

                </div>
              </div>

              <button
                onClick={() =>
                  deleteInspection(
                    selectedInspection._id
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 size={17} />
                Delete Inspection
              </button>

            </div>

            <div className="border-t p-4">
              <button
                onClick={() =>
                  setSelectedInspection(null)
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

export default LabourOfficerInspections;
