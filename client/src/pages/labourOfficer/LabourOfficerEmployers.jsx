
import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";

import {
  Search,
  Filter,
  X,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

import toast from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const LabourOfficerEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedEmployer, setSelectedEmployer] =
    useState(null);

  // ==========================================
  // Fetch Employers
  // ==========================================
  const fetchEmployers = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/users/employers");

      if (response.data.success) {
        setEmployers(response.data.employers || []);
      }
    } catch (error) {
      console.error("Fetch Employers Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch employers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  // ==========================================
  // Filter Employers
  // ==========================================
  const filteredEmployers = useMemo(() => {
    return employers.filter((employer) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        employer.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        employer.email
          ?.toLowerCase()
          .includes(searchText) ||
        employer.phone
          ?.toLowerCase()
          .includes(searchText);

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" &&
          employer.isVerified === true) ||
        (verificationFilter === "unverified" &&
          employer.isVerified === false);

      const matchesStatus =
        statusFilter === "all" ||
        employer.status === statusFilter;

      return (
        matchesSearch &&
        matchesVerification &&
        matchesStatus
      );
    });
  }, [
    employers,
    search,
    verificationFilter,
    statusFilter,
  ]);

  // ==========================================
  // Format Date
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Profile Image
  // ==========================================
  const getProfileImage = (employer) => {
    if (!employer.profileImage) {
      return null;
    }

    if (employer.profileImage.startsWith("http")) {
      return employer.profileImage;
    }

    return `http://localhost:5000${employer.profileImage}`;
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
        <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-gray-200" />

            <div className="h-12 rounded-xl bg-gray-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-64 rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            Header
        ====================================== */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Employers
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage registered employers.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
              <Building2
                size={20}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-gray-700">
                {filteredEmployers.length} Employers
              </span>
            </div>
          </div>
        </div>

        {/* ======================================
            Filters
        ====================================== */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-4">

            {/* Search */}
            <div className="relative lg:col-span-2">
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
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Verification */}
            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={verificationFilter}
                onChange={(e) =>
                  setVerificationFilter(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            </div>

            {/* Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        </div>

        {/* ======================================
            Empty State
        ====================================== */}
        {filteredEmployers.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <Building2
              size={48}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold text-gray-800">
              No employers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          /* ====================================
             Employer Cards
          ==================================== */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredEmployers.map((employer) => {
              const image =
                getProfileImage(employer);

              return (
                <div
                  key={employer._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-4 p-5">
                    {image ? (
                      <img
                        src={image}
                        alt={employer.fullName}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                        {employer.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "E"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-gray-900">
                        {employer.fullName}
                      </h2>

                      <p className="truncate text-sm text-gray-500">
                        Employer
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-wrap gap-2 px-5">
                    {employer.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <ShieldCheck size={14} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                        <ShieldX size={14} />
                        Unverified
                      </span>
                    )}

                    {employer.status === "active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        <UserCheck size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                        <UserX size={14} />
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span className="truncate">
                        {employer.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        {employer.phone}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="border-t border-gray-100 p-4">
                    <button
                      onClick={() =>
                        setSelectedEmployer(employer)
                      }
                      className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================
          Employer Details Modal
      ========================================== */}
      {selectedEmployer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEmployer(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Employer Details
              </h2>

              <button
                onClick={() =>
                  setSelectedEmployer(null)
                }
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile */}
            <div className="p-6">
              <div className="mb-6 flex flex-col items-center text-center">
                {getProfileImage(selectedEmployer) ? (
                  <img
                    src={getProfileImage(
                      selectedEmployer
                    )}
                    alt={selectedEmployer.fullName}
                    className="mb-4 h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                    {selectedEmployer.fullName
                      ?.charAt(0)
                      ?.toUpperCase() || "E"}
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900">
                  {selectedEmployer.fullName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Employer
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <Mail
                    size={20}
                    className="mt-0.5 text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="break-all text-sm font-medium text-gray-800">
                      {selectedEmployer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <Phone
                    size={20}
                    className="mt-0.5 text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedEmployer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  {selectedEmployer.isVerified ? (
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 text-green-600"
                    />
                  ) : (
                    <ShieldX
                      size={20}
                      className="mt-0.5 text-yellow-600"
                    />
                  )}

                  <div>
                    <p className="text-xs text-gray-500">
                      Verification
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedEmployer.isVerified
                        ? "Verified Employer"
                        : "Unverified Employer"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  {selectedEmployer.status ===
                  "active" ? (
                    <UserCheck
                      size={20}
                      className="mt-0.5 text-blue-600"
                    />
                  ) : (
                    <UserX
                      size={20}
                      className="mt-0.5 text-red-600"
                    />
                  )}

                  <div>
                    <p className="text-xs text-gray-500">
                      Account Status
                    </p>

                    <p className="text-sm font-medium capitalize text-gray-800">
                      {selectedEmployer.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <Calendar
                    size={20}
                    className="mt-0.5 text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Registered On
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(
                        selectedEmployer.createdAt
                      )}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Close */}
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={() =>
                  setSelectedEmployer(null)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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

export default LabourOfficerEmployers;
