
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Loader2,
  Eye,
  X,
} from "lucide-react";

import { toast } from "react-hot-toast";

const EmployerWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  // ==========================================
  // Fetch Hired Workers
  // ==========================================
  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/applications/employer/workers"
      );

      if (response.data.success) {
        setWorkers(response.data.workers || []);
      }
    } catch (error) {
      console.error(
        "Fetch Employer Workers Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch workers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // ==========================================
  // Unique Jobs
  // ==========================================
  const jobs = useMemo(() => {
    const jobMap = new Map();

    workers.forEach((application) => {
      if (application.job?._id) {
        jobMap.set(
          application.job._id,
          application.job.title
        );
      }
    });

    return Array.from(jobMap.entries()).map(
      ([id, title]) => ({
        id,
        title,
      })
    );
  }, [workers]);

  // ==========================================
  // Filter Workers
  // ==========================================
  const filteredWorkers = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return workers.filter((application) => {
      const worker =
        application.worker || {};

      const job =
        application.job || {};

      const matchesSearch =
        !searchValue ||
        worker.fullName
          ?.toLowerCase()
          .includes(searchValue) ||
        worker.email
          ?.toLowerCase()
          .includes(searchValue) ||
        worker.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        job.title
          ?.toLowerCase()
          .includes(searchValue) ||
        job.location
          ?.toLowerCase()
          .includes(searchValue);

      const matchesJob =
        selectedJob === "all" ||
        job._id === selectedJob;

      return matchesSearch && matchesJob;
    });
  }, [workers, search, selectedJob]);

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
  // Profile Image URL
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    const baseUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000";

    return `${baseUrl}${image}`;
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
        <DashboardLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={24}
            className="animate-spin"
          />
          <span>Loading workers...</span>
        </div>
      </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ======================================
            Header
        ====================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Workers
            </h1>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              View and manage workers hired for
              your jobs.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700">
            <Users size={19} />

            <span className="text-sm font-semibold">
              {workers.length} Hired
            </span>
          </div>
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
                placeholder="Search worker, email, phone, job or location..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Job Filter */}
            <div className="relative w-full lg:w-64">
              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={selectedJob}
                onChange={(e) =>
                  setSelectedJob(e.target.value)
                }
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  All Jobs
                </option>

                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ======================================
            Results
        ====================================== */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredWorkers.length}
            </span>{" "}
            worker
            {filteredWorkers.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {/* ======================================
            Empty State
        ====================================== */}
        {filteredWorkers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Users
                size={27}
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No workers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search ||
              selectedJob !== "all"
                ? "Try changing your search or filter."
                : "Workers you accept will appear here."}
            </p>
          </div>
        ) : (
          /* ====================================
             Worker Grid
          ==================================== */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredWorkers.map(
              (application) => {
                const worker =
                  application.worker || {};

                const job =
                  application.job || {};

                const imageUrl =
                  getImageUrl(
                    worker.profileImage
                  );

                return (
                  <div
                    key={application._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-100 shadow-sm">

                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                worker.fullName ||
                                "Worker"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User
                              size={25}
                              className="text-blue-600"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold text-gray-900">
                            {worker.fullName ||
                              "Unknown Worker"}
                          </h2>

                          <p className="text-sm text-blue-600">
                            Hired Worker
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-4 p-5">

                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <Mail
                          size={18}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <span className="break-all text-sm text-gray-600">
                          {worker.email ||
                            "No email"}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <Phone
                          size={18}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-sm text-gray-600">
                          {worker.phone ||
                            "No phone"}
                        </span>
                      </div>

                      {/* Job */}
                      <div className="flex items-start gap-3">
                        <Briefcase
                          size={18}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div>
                          <p className="text-xs text-gray-400">
                            Job
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {job.title ||
                              "Unknown Job"}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={18}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div>
                          <p className="text-xs text-gray-400">
                            Location
                          </p>

                          <p className="text-sm text-gray-600">
                            {job.location ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Hired Date */}
                      <div className="flex items-center gap-3">
                        <Calendar
                          size={18}
                          className="shrink-0 text-gray-400"
                        />

                        <div>
                          <p className="text-xs text-gray-400">
                            Hired
                          </p>

                          <p className="text-sm text-gray-600">
                            {formatDate(
                              application.updatedAt
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-gray-100 bg-gray-50 p-4">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedWorker(
                            application
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        <Eye size={17} />
                        View Worker
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* ========================================
          Worker Details Modal
      ======================================== */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Worker Details
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedWorker(null)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">

              {(() => {
                const worker =
                  selectedWorker.worker ||
                  {};

                const job =
                  selectedWorker.job ||
                  {};

                const imageUrl =
                  getImageUrl(
                    worker.profileImage
                  );

                return (
                  <>
                    {/* Profile */}
                    <div className="flex flex-col items-center text-center">

                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-100">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              worker.fullName ||
                              "Worker"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User
                            size={38}
                            className="text-blue-600"
                          />
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-900">
                        {worker.fullName ||
                          "Unknown Worker"}
                      </h3>

                      <p className="mt-1 text-sm text-blue-600">
                        Hired Worker
                      </p>
                    </div>

                    {/* Information */}
                    <div className="mt-7 space-y-4">

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-700">
                          {worker.email ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {worker.phone ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Job
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {job.title ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {job.location ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Employment Type
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {job.employmentType ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Salary
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {job.salary
                            ? `₹${Number(
                                job.salary
                              ).toLocaleString(
                                "en-IN"
                              )}`
                            : "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Hired Date
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {formatDate(
                            selectedWorker.updatedAt
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Close */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedWorker(null)
                      }
                      className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
    </DashboardLayout>
  );
};

export default EmployerWorkers;
