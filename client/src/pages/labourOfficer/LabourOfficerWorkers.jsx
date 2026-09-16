
import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";

import {
  Search,
  Users,
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Loader2,
} from "lucide-react";

import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const LabourOfficerWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  // ==========================================
  // Fetch Workers
  // ==========================================
  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/users/workers"
      );

      if (response.data.success) {
        setWorkers(response.data.workers || []);
      }
    } catch (error) {
      console.error(
        "Fetch Labour Officer Workers Error:",
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
  // Filter Workers
  // ==========================================
  const filteredWorkers = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return workers.filter((worker) => {
      const name =
        worker.fullName?.toLowerCase() || "";

      const email =
        worker.email?.toLowerCase() || "";

      const phone =
        worker.phone?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" &&
          worker.isVerified === true) ||
        (verificationFilter === "unverified" &&
          worker.isVerified === false);

      const matchesStatus =
        statusFilter === "all" ||
        worker.status === statusFilter;

      return (
        matchesSearch &&
        matchesVerification &&
        matchesStatus
      );
    });
  }, [
    workers,
    search,
    verificationFilter,
    statusFilter,
  ]);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={24}
            className="animate-spin"
          />

          <span>Loading workers...</span>
        </div>
      </div>
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
              Monitor and review registered workers
              on WorkBridge.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700">
            <Users size={19} />

            <span className="text-sm font-semibold">
              {workers.length} Workers
            </span>
          </div>
        </div>

        {/* ======================================
            Search & Filters
        ====================================== */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">

            {/* Search */}
            <div className="relative">
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
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Verification */}
            <select
              value={verificationFilter}
              onChange={(e) =>
                setVerificationFilter(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Verification
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="unverified">
                Unverified
              </option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* ======================================
            Result Count
        ====================================== */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredWorkers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {workers.length}
            </span>{" "}
            workers
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
              verificationFilter !== "all" ||
              statusFilter !== "all"
                ? "Try changing your search or filters."
                : "There are no workers registered yet."}
            </p>
          </div>
        ) : (
          /* ====================================
             Worker Cards
          ==================================== */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredWorkers.map((worker) => {
              const imageUrl = getImageUrl(
                worker.profileImage
              );

              return (
                <div
                  key={worker._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* Card Header */}
                  <div className="bg-gray-50 p-5">

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

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-lg font-semibold text-gray-900">
                            {worker.fullName ||
                              "Unknown Worker"}
                          </h2>

                          {worker.isVerified && (
                            <ShieldCheck
                              size={17}
                              className="shrink-0 text-green-600"
                            />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Worker
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

                    {/* Verification */}
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">

                      <div className="flex items-center gap-2">

                        {worker.isVerified ? (
                          <ShieldCheck
                            size={18}
                            className="text-green-600"
                          />
                        ) : (
                          <ShieldAlert
                            size={18}
                            className="text-orange-500"
                          />
                        )}

                        <span className="text-sm text-gray-600">
                          Verification
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          worker.isVerified
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {worker.isVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">

                      <div className="flex items-center gap-2">

                        {worker.status ===
                        "active" ? (
                          <CheckCircle
                            size={18}
                            className="text-green-600"
                          />
                        ) : (
                          <XCircle
                            size={18}
                            className="text-red-500"
                          />
                        )}

                        <span className="text-sm text-gray-600">
                          Account Status
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold capitalize ${
                          worker.status ===
                          "active"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {worker.status}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 bg-white p-4">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedWorker(
                          worker
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Eye size={17} />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
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
                const imageUrl =
                  getImageUrl(
                    selectedWorker.profileImage
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
                              selectedWorker.fullName ||
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
                        {selectedWorker.fullName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        WorkBridge Worker
                      </p>
                    </div>

                    {/* Details */}
                    <div className="mt-7 space-y-4">

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Full Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {selectedWorker.fullName ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-700">
                          {selectedWorker.email ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {selectedWorker.phone ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <span className="text-sm text-gray-500">
                          Verification
                        </span>

                        <span
                          className={`flex items-center gap-1.5 text-sm font-semibold ${
                            selectedWorker.isVerified
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          {selectedWorker.isVerified ? (
                            <ShieldCheck
                              size={17}
                            />
                          ) : (
                            <ShieldAlert
                              size={17}
                            />
                          )}

                          {selectedWorker.isVerified
                            ? "Verified"
                            : "Unverified"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <span className="text-sm text-gray-500">
                          Account Status
                        </span>

                        <span
                          className={`text-sm font-semibold capitalize ${
                            selectedWorker.status ===
                            "active"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {selectedWorker.status}
                        </span>
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

export default LabourOfficerWorkers;
