
import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";
import { toast } from "react-hot-toast";

import {
  Search,
  RefreshCw,
  Users,
  Building2,
  Briefcase,
  CheckCircle,
  XCircle,
  Eye,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  X,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  IndianRupee,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] =
    useState("all");

  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ==========================================
  // FETCH EMPLOYERS
  // ==========================================

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/admin/employers");

      if (response.data.success) {
        setEmployers(response.data.employers || []);
      } else {
        setError(
          response.data.message || "Failed to fetch employers."
        );
      }
    } catch (err) {
      console.error("Fetch Employers Error:", err);

      setError(
        err.response?.data?.message ||
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
  // FILTER EMPLOYERS
  // ==========================================

  const filteredEmployers = useMemo(() => {
    return employers.filter((employer) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        employer.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        employer.email
          ?.toLowerCase()
          .includes(searchText) ||
        employer.phone
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        employer.status === statusFilter;

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" &&
          employer.isVerified === true) ||
        (verificationFilter === "unverified" &&
          employer.isVerified === false);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification
      );
    });
  }, [
    employers,
    search,
    statusFilter,
    verificationFilter,
  ]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalEmployers = employers.length;

  const activeEmployers = employers.filter(
    (employer) => employer.status === "active"
  ).length;

  const inactiveEmployers = employers.filter(
    (employer) => employer.status === "inactive"
  ).length;

  const verifiedEmployers = employers.filter(
    (employer) => employer.isVerified
  ).length;

  const totalJobs = employers.reduce(
    (total, employer) =>
      total + (employer.jobStats?.total || 0),
    0
  );

  const openJobs = employers.reduce(
    (total, employer) =>
      total + (employer.jobStats?.open || 0),
    0
  );

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (employer) => {
    if (!employer?.profileImage) {
      return null;
    }

    return employer.profileImage.startsWith("http")
      ? employer.profileImage
      : `http://localhost:5000${employer.profileImage}`;
  };

  // ==========================================
  // VERIFY / UNVERIFY
  // ==========================================

  const handleVerification = async (employer) => {
    try {
      setActionLoading(`${employer._id}-verification`);

      const newVerificationStatus = !employer.isVerified;

      const response = await axios.put(
        `/admin/employers/${employer._id}/verification`,
        {
          isVerified: newVerificationStatus,
        }
      );

      if (response.data.success) {
        setEmployers((prev) =>
          prev.map((item) =>
            item._id === employer._id
              ? {
                  ...item,
                  isVerified: newVerificationStatus,
                }
              : item
          )
        );

        if (
          selectedEmployer?._id === employer._id
        ) {
          setSelectedEmployer((prev) => ({
            ...prev,
            isVerified: newVerificationStatus,
          }));
        }

        toast.success(
          newVerificationStatus
            ? "Employer verified successfully."
            : "Employer verification removed."
        );
      }
    } catch (err) {
      console.error(
        "Employer Verification Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update verification."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const handleStatusChange = async (employer) => {
    try {
      setActionLoading(`${employer._id}-status`);

      const newStatus =
        employer.status === "active"
          ? "inactive"
          : "active";

      const response = await axios.put(
        `/admin/employers/${employer._id}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setEmployers((prev) =>
          prev.map((item) =>
            item._id === employer._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
          )
        );

        if (
          selectedEmployer?._id === employer._id
        ) {
          setSelectedEmployer((prev) => ({
            ...prev,
            status: newStatus,
          }));
        }

        toast.success(
          newStatus === "active"
            ? "Employer activated successfully."
            : "Employer deactivated successfully."
        );
      }
    } catch (err) {
      console.error(
        "Employer Status Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update employer status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // OPEN DETAILS
  // ==========================================

  const openDetails = async (employer) => {
    try {
      setSelectedEmployer(employer);
      setShowDetails(true);

      const response = await axios.get(
        `/admin/employers/${employer._id}`
      );

      if (response.data.success) {
        setSelectedEmployer(response.data.employer);
      }
    } catch (err) {
      console.error(
        "Employer Details Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to load employer details."
      );
    }
  };

  // ==========================================
  // DATE FORMAT
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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />

          <p className="text-slate-600">
            Loading employers...
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

          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Manage Employers
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Manage employer accounts, verification
                  and job activity
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchEmployers}
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
                Unable to load employers
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
            icon={<Building2 />}
            title="Total"
            value={totalEmployers}
          />

          <SummaryCard
            icon={<UserCheck />}
            title="Active"
            value={activeEmployers}
          />

          <SummaryCard
            icon={<UserX />}
            title="Inactive"
            value={inactiveEmployers}
          />

          <SummaryCard
            icon={<ShieldCheck />}
            title="Verified"
            value={verifiedEmployers}
          />

          <SummaryCard
            icon={<Briefcase />}
            title="Total Jobs"
            value={totalJobs}
          />

          <SummaryCard
            icon={<CheckCircle />}
            title="Open Jobs"
            value={openJobs}
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
                placeholder="Search employer..."
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

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

            {/* Verification */}

            <select
              value={verificationFilter}
              onChange={(e) =>
                setVerificationFilter(
                  e.target.value
                )
              }
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Result count */}

            <div className="flex items-center justify-center md:justify-start px-4 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900 mx-1">
                {filteredEmployers.length}
              </span>
              of{" "}
              <span className="font-semibold text-slate-900 ml-1">
                {totalEmployers}
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
                    Employer
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Contact
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Jobs
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Verification
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

                {filteredEmployers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center"
                    >
                      <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                      <p className="font-medium text-slate-700">
                        No employers found
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployers.map(
                    (employer) => (
                      <tr
                        key={employer._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* Employer */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <ProfileAvatar
                              employer={employer}
                              getImageUrl={getImageUrl}
                            />

                            <div>
                              <p className="font-semibold text-slate-900">
                                {employer.fullName}
                              </p>

                              <p className="text-xs text-slate-500">
                                Joined{" "}
                                {formatDate(
                                  employer.createdAt
                                )}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-slate-700">
                            {employer.email}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {employer.phone}
                          </p>

                        </td>

                        {/* Jobs */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-500" />

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {employer.jobStats?.total ||
                                  0}
                              </p>

                              <p className="text-xs text-slate-500">
                                {employer.jobStats?.open ||
                                  0}{" "}
                                open
                              </p>
                            </div>
                          </div>

                        </td>

                        {/* Verification */}

                        <td className="px-5 py-4">

                          {employer.isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                              <XCircle className="w-3.5 h-3.5" />
                              Unverified
                            </span>
                          )}

                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={employer.status}
                          />

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              onClick={() =>
                                openDetails(
                                  employer
                                )
                              }
                              title="View details"
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleVerification(
                                  employer
                                )
                              }
                              disabled={
                                actionLoading ===
                                `${employer._id}-verification`
                              }
                              title={
                                employer.isVerified
                                  ? "Remove verification"
                                  : "Verify employer"
                              }
                              className={`p-2 rounded-lg transition ${
                                employer.isVerified
                                  ? "text-amber-600 hover:bg-amber-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {actionLoading ===
                              `${employer._id}-verification` ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : employer.isVerified ? (
                                <ShieldX className="w-4 h-4" />
                              ) : (
                                <ShieldCheck className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  employer
                                )
                              }
                              disabled={
                                actionLoading ===
                                `${employer._id}-status`
                              }
                              title={
                                employer.status ===
                                "active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              className={`p-2 rounded-lg transition ${
                                employer.status ===
                                "active"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {actionLoading ===
                              `${employer._id}-status` ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : employer.status ===
                                "active" ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* ======================================
            MOBILE / TABLET CARDS
        ====================================== */}

        <div className="lg:hidden space-y-4">

          {filteredEmployers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="font-medium text-slate-700">
                No employers found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search or filters.
              </p>

            </div>
          ) : (
            filteredEmployers.map(
              (employer) => (
                <div
                  key={employer._id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
                >

                  {/* Card Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <ProfileAvatar
                        employer={employer}
                        getImageUrl={getImageUrl}
                      />

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {employer.fullName}
                        </h3>

                        <p className="text-xs text-slate-500 truncate">
                          {employer.email}
                        </p>
                      </div>

                    </div>

                    <StatusBadge
                      status={employer.status}
                    />

                  </div>

                  {/* Details */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <InfoItem
                      icon={<Phone />}
                      label="Phone"
                      value={employer.phone}
                    />

                    <InfoItem
                      icon={<Briefcase />}
                      label="Jobs"
                      value={`${employer.jobStats?.total || 0} total`}
                    />

                    <InfoItem
                      icon={<CheckCircle />}
                      label="Open Jobs"
                      value={
                        employer.jobStats?.open || 0
                      }
                    />

                    <InfoItem
                      icon={<CalendarDays />}
                      label="Joined"
                      value={formatDate(
                        employer.createdAt
                      )}
                    />

                  </div>

                  {/* Verification */}

                  <div className="mt-4">

                    {employer.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Employer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                        <ShieldX className="w-3.5 h-3.5" />
                        Verification Pending
                      </span>
                    )}

                  </div>

                  {/* Actions */}

                  <div className="grid grid-cols-3 gap-2 mt-5">

                    <button
                      onClick={() =>
                        openDetails(employer)
                      }
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleVerification(
                          employer
                        )
                      }
                      disabled={
                        actionLoading ===
                        `${employer._id}-verification`
                      }
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        employer.isVerified
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {actionLoading ===
                      `${employer._id}-verification` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : employer.isVerified ? (
                        <>
                          <ShieldX className="w-4 h-4" />
                          Unverify
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Verify
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          employer
                        )
                      }
                      disabled={
                        actionLoading ===
                        `${employer._id}-status`
                      }
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        employer.status === "active"
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {actionLoading ===
                      `${employer._id}-status` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : employer.status === "active" ? (
                        <>
                          <UserX className="w-4 h-4" />
                          Disable
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Enable
                        </>
                      )}
                    </button>

                  </div>

                </div>
              )
            )
          )}

        </div>

        {/* ======================================
            DETAILS MODAL
        ====================================== */}

        {showDetails && selectedEmployer && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >

            <div
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Modal Header */}

              <div className="flex items-center justify-between p-5 border-b border-slate-200">

                <div className="flex items-center gap-3">

                  <ProfileAvatar
                    employer={selectedEmployer}
                    getImageUrl={getImageUrl}
                  />

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {selectedEmployer.fullName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Employer Details
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    setShowDetails(false)
                  }
                  className="p-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

              </div>

              {/* Modal Content */}

              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-5">

                {/* Employer Info */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                  <DetailItem
                    icon={<Mail />}
                    label="Email"
                    value={
                      selectedEmployer.email
                    }
                  />

                  <DetailItem
                    icon={<Phone />}
                    label="Phone"
                    value={
                      selectedEmployer.phone
                    }
                  />

                  <DetailItem
                    icon={<CalendarDays />}
                    label="Joined"
                    value={formatDate(
                      selectedEmployer.createdAt
                    )}
                  />

                  <DetailItem
                    icon={
                      selectedEmployer.status ===
                      "active" ? (
                        <UserCheck />
                      ) : (
                        <UserX />
                      )
                    }
                    label="Account Status"
                    value={
                      selectedEmployer.status
                    }
                  />

                </div>

                {/* Verification */}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>
                      <p className="font-semibold text-slate-800">
                        Employer Verification
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Current verification status
                      </p>
                    </div>

                    {selectedEmployer.isVerified ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                        <ShieldX className="w-4 h-4" />
                        Unverified
                      </span>
                    )}

                  </div>

                </div>

                {/* Job Statistics */}

                <div className="mb-6">

                  <h3 className="font-semibold text-slate-900 mb-3">
                    Job Statistics
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                    <MiniStat
                      label="Total"
                      value={
                        selectedEmployer
                          .jobStats?.total || 0
                      }
                    />

                    <MiniStat
                      label="Open"
                      value={
                        selectedEmployer
                          .jobStats?.open || 0
                      }
                    />

                    <MiniStat
                      label="Closed"
                      value={
                        selectedEmployer
                          .jobStats?.closed || 0
                      }
                    />

                    <MiniStat
                      label="Draft"
                      value={
                        selectedEmployer
                          .jobStats?.draft || 0
                      }
                    />

                  </div>

                </div>

                {/* Jobs */}

                <div>

                  <div className="flex items-center justify-between mb-3">

                    <h3 className="font-semibold text-slate-900">
                      Employer Jobs
                    </h3>

                    <span className="text-xs text-slate-500">
                      {selectedEmployer.jobs
                        ?.length || 0}{" "}
                      jobs
                    </span>

                  </div>

                  {selectedEmployer.jobs?.length ===
                  0 ? (
                    <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">

                      <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />

                      <p className="text-sm text-slate-500">
                        No jobs posted yet.
                      </p>

                    </div>
                  ) : (
                    <div className="space-y-3">

                      {selectedEmployer.jobs.map(
                        (job) => (
                          <div
                            key={job._id}
                            className="border border-slate-200 rounded-xl p-4"
                          >

                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {job.title}
                                </h4>

                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">

                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {job.location}
                                  </span>

                                  <span className="inline-flex items-center gap-1">
                                    <IndianRupee className="w-3.5 h-3.5" />
                                    {job.salary}
                                  </span>

                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {job.employmentType}
                                  </span>

                                </div>
                              </div>

                              <JobStatusBadge
                                status={job.status}
                              />

                            </div>

                            <div className="flex flex-wrap gap-2 mt-3 text-xs">

                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                                Vacancies:{" "}
                                {job.vacancies}
                              </span>

                              {job.deadline && (
                                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                                  Deadline:{" "}
                                  {formatDate(
                                    job.deadline
                                  )}
                                </span>
                              )}

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* Modal Actions */}

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-slate-200">

                  <button
                    onClick={() =>
                      handleVerification(
                        selectedEmployer
                      )
                    }
                    disabled={
                      actionLoading ===
                      `${selectedEmployer._id}-verification`
                    }
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedEmployer.isVerified
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {selectedEmployer.isVerified ? (
                      <>
                        <ShieldX className="w-4 h-4" />
                        Remove Verification
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify Employer
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedEmployer
                      )
                    }
                    disabled={
                      actionLoading ===
                      `${selectedEmployer._id}-status`
                    }
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedEmployer.status ===
                      "active"
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {selectedEmployer.status ===
                    "active" ? (
                      <>
                        <UserX className="w-4 h-4" />
                        Deactivate Employer
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Activate Employer
                      </>
                    )}
                  </button>

                </div>

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
// PROFILE AVATAR
// ==========================================

const ProfileAvatar = ({
  employer,
  getImageUrl,
}) => {
  const imageUrl = getImageUrl(employer);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={employer.fullName}
        className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Building2 className="w-5 h-5 text-blue-600" />
    </div>
  );
};


// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({ status }) => {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {isActive ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}

      {isActive ? "Active" : "Inactive"}
    </span>
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

      <p className="text-sm font-medium text-slate-800 break-all">
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


export default AdminEmployers;
