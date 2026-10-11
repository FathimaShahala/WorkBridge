

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  X,
  Briefcase,
  User,
  Building2,
  MapPin,
} from "lucide-react";

import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const PoliceCases = () => {
  const [cases, setCases] =
    useState([]);

  const [workers, setWorkers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedCase, setSelectedCase] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const emptyForm = {
    title: "",
    description: "",
    worker: "",
    category: "Other",
    priority: "Medium",
    location: "",
    incidentDate: "",
    officerRemarks: "",
  };

  const [form, setForm] =
    useState(emptyForm);

  const fetchCases = async () => {
    try {
      setLoading(true);

      const response =
        await axios.get(
          "/police/cases"
        );

      if (response.data.success) {
        setCases(
          response.data.cases
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load cases."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response =
        await axios.get(
          "/police/workers"
        );

      if (response.data.success) {
        setWorkers(
          response.data.workers
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const createCase = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description
    ) {
      toast.error(
        "Title and description are required."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await axios.post(
          "/police/cases",
          form
        );

      if (response.data.success) {
        toast.success(
          "Police case created successfully."
        );

        setCases((prev) => [
          response.data.policeCase,
          ...prev,
        ]);

        setForm(emptyForm);
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create case."
      );
    } finally {
      setSaving(false);
    }
  };

  const openCase = (policeCase) => {
    setSelectedCase(
      policeCase
    );
  };

  const updateStatus = async (
    policeCase,
    newStatus
  ) => {
    try {
      const response =
        await axios.put(
          `/police/cases/${policeCase._id}`,
          {
            status: newStatus,
          }
        );

      if (response.data.success) {
        toast.success(
          "Case status updated."
        );

        setCases((prev) =>
          prev.map((item) =>
            item._id ===
            policeCase._id
              ? response.data.policeCase
              : item
          )
        );

        if (
          selectedCase?._id ===
          policeCase._id
        ) {
          setSelectedCase(
            response.data.policeCase
          );
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update case."
      );
    }
  };

  const deleteCase = async (
    policeCase
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this case?"
      );

    if (!confirmed) return;

    try {
      const response =
        await axios.delete(
          `/police/cases/${policeCase._id}`
        );

      if (response.data.success) {
        toast.success(
          "Case deleted successfully."
        );

        setCases((prev) =>
          prev.filter(
            (item) =>
              item._id !==
              policeCase._id
          )
        );

        setSelectedCase(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete case."
      );
    }
  };

  const filteredCases =
    cases.filter((policeCase) => {
      const text =
        search.toLowerCase();

      const matchesSearch =
        policeCase.caseNumber
          ?.toLowerCase()
          .includes(text) ||
        policeCase.title
          ?.toLowerCase()
          .includes(text) ||
        policeCase.worker?.fullName
          ?.toLowerCase()
          .includes(text);

      const matchesStatus =
        statusFilter === "all" ||
        policeCase.status ===
          statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        policeCase.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Police Cases
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and manage police investigation cases.
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            New Case
          </button>

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
                placeholder="Search cases..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm"
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

              <option value="Open">
                Open
              </option>

              <option value="Investigating">
                Investigating
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="all">
                All Priority
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>

          </div>
        </div>

        {/* Cases */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            Loading cases...
          </div>
        ) : filteredCases.length ===
          0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            No police cases found.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">

            {filteredCases.map(
              (policeCase) => (
                <div
                  key={policeCase._id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Briefcase
                          size={21}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-blue-600">
                          {policeCase.caseNumber}
                        </p>

                        <h2 className="mt-1 font-semibold text-gray-900">
                          {policeCase.title}
                        </h2>
                      </div>

                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                      {policeCase.priority}
                    </span>

                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-gray-600">
                    {policeCase.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">

                    <div className="flex gap-2">
                      <User size={16} />

                      {policeCase.worker
                        ?.fullName ||
                        "No worker assigned"}
                    </div>

                    <div className="flex gap-2">
                      <MapPin size={16} />

                      {policeCase.location ||
                        "Location not specified"}
                    </div>

                  </div>

                  <div className="mt-5 flex items-center gap-3">

                    <select
                      value={
                        policeCase.status
                      }
                      onChange={(e) =>
                        updateStatus(
                          policeCase,
                          e.target.value
                        )
                      }
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="Investigating">
                        Investigating
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Closed">
                        Closed
                      </option>
                    </select>

                    <button
                      onClick={() =>
                        openCase(
                          policeCase
                        )
                      }
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      Details
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* Create modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <form
              onSubmit={createCase}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6"
            >

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  Create Police Case
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="space-y-4">

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Case title"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Case description"
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <select
                  name="worker"
                  value={form.worker}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                >
                  <option value="">
                    Select worker
                  </option>

                  {workers.map(
                    (worker) => (
                      <option
                        key={worker._id}
                        value={worker._id}
                      >
                        {worker.fullName}
                      </option>
                    )
                  )}
                </select>

                <div className="grid gap-4 sm:grid-cols-2">

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  >
                    <option value="Theft">
                      Theft
                    </option>

                    <option value="Fraud">
                      Fraud
                    </option>

                    <option value="Assault">
                      Assault
                    </option>

                    <option value="Harassment">
                      Harassment
                    </option>

                    <option value="Workplace Violence">
                      Workplace Violence
                    </option>

                    <option value="Missing Person">
                      Missing Person
                    </option>

                    <option value="Document Issue">
                      Document Issue
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>
                  </select>

                </div>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Incident location"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <input
                  type="date"
                  name="incidentDate"
                  value={form.incidentDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <textarea
                  name="officerRemarks"
                  value={form.officerRemarks}
                  onChange={handleChange}
                  placeholder="Officer remarks"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : "Create Case"}
              </button>

            </form>
          </div>
        )}

        {/* Case details */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {selectedCase.caseNumber}
                  </p>

                  <h2 className="text-xl font-bold">
                    {selectedCase.title}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setSelectedCase(
                      null
                    )
                  }
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-700">
                  {selectedCase.description}
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    Category
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedCase.category}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    Priority
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedCase.priority}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    Worker
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedCase.worker
                      ?.fullName ||
                      "Not assigned"}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedCase.location ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={
                    selectedCase.status
                  }
                  onChange={(e) =>
                    updateStatus(
                      selectedCase,
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="Investigating">
                    Investigating
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>

              </div>

              <button
                onClick={() =>
                  deleteCase(
                    selectedCase
                  )
                }
                className="mt-5 w-full rounded-xl bg-red-50 px-4 py-3 font-medium text-red-600 hover:bg-red-100"
              >
                Delete Case
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default PoliceCases;
