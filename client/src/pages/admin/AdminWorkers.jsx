
import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";
import { toast } from "react-hot-toast";

import {
  Search,
  RefreshCw,
  Users,
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
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] =
    useState("all");

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ==========================================
  // FETCH WORKERS
  // ==========================================

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/admin/workers");

      if (response.data.success) {
        setWorkers(response.data.workers || []);
      } else {
        setError(
          response.data.message ||
            "Failed to fetch workers."
        );
      }
    } catch (err) {
      console.error("Fetch Workers Error:", err);

      setError(
        err.response?.data?.message ||
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
  // FILTER WORKERS
  // ==========================================

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        worker.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        worker.email
          ?.toLowerCase()
          .includes(searchText) ||
        worker.phone
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        worker.status === statusFilter;

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" &&
          worker.isVerified === true) ||
        (verificationFilter === "unverified" &&
          worker.isVerified === false);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification
      );
    });
  }, [
    workers,
    search,
    statusFilter,
    verificationFilter,
  ]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalWorkers = workers.length;

  const activeWorkers = workers.filter(
    (worker) => worker.status === "active"
  ).length;

  const inactiveWorkers = workers.filter(
    (worker) => worker.status === "inactive"
  ).length;

  const verifiedWorkers = workers.filter(
    (worker) => worker.isVerified
  ).length;

  const totalApplications = workers.reduce(
    (total, worker) =>
      total +
      (worker.applicationStats?.total || 0),
    0
  );

  const acceptedApplications = workers.reduce(
    (total, worker) =>
      total +
      (worker.applicationStats?.accepted || 0),
    0
  );

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (worker) => {
    if (!worker?.profileImage) {
      return null;
    }

    return worker.profileImage.startsWith("http")
      ? worker.profileImage
      : `http://localhost:5000${worker.profileImage}`;
  };

  // ==========================================
  // VERIFY / UNVERIFY
  // ==========================================

  const handleVerification = async (worker) => {
    try {
      setActionLoading(
        `${worker._id}-verification`
      );

      const newVerificationStatus =
        !worker.isVerified;

      const response = await axios.put(
        `/admin/workers/${worker._id}/verification`,
        {
          isVerified: newVerificationStatus,
        }
      );

      if (response.data.success) {
        setWorkers((prev) =>
          prev.map((item) =>
            item._id === worker._id
              ? {
                  ...item,
                  isVerified:
                    newVerificationStatus,
                }
              : item
          )
        );

        if (
          selectedWorker?._id === worker._id
        ) {
          setSelectedWorker((prev) => ({
            ...prev,
            isVerified:
              newVerificationStatus,
          }));
        }

        toast.success(
          newVerificationStatus
            ? "Worker verified successfully."
            : "Worker verification removed."
        );
      }
    } catch (err) {
      console.error(
        "Worker Verification Error:",
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

  const handleStatusChange = async (worker) => {
    try {
      setActionLoading(
        `${worker._id}-status`
      );

      const newStatus =
        worker.status === "active"
          ? "inactive"
          : "active";

      const response = await axios.put(
        `/admin/workers/${worker._id}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setWorkers((prev) =>
          prev.map((item) =>
            item._id === worker._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
          )
        );

        if (
          selectedWorker?._id === worker._id
        ) {
          setSelectedWorker((prev) => ({
            ...prev,
            status: newStatus,
          }));
        }

        toast.success(
          newStatus === "active"
            ? "Worker activated successfully."
            : "Worker deactivated successfully."
        );
      }
    } catch (err) {
      console.error(
        "Worker Status Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update worker status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // OPEN DETAILS
  // ==========================================

  const openDetails = async (worker) => {
    try {
      setSelectedWorker(worker);
      setShowDetails(true);
      setDetailsLoading(true);

      const response = await axios.get(
        `/admin/workers/${worker._id}`
      );

      if (response.data.success) {
        setSelectedWorker(
          response.data.worker
        );
      }
    } catch (err) {
      console.error(
        "Worker Details Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to load worker details."
      );
    } finally {
      setDetailsLoading(false);
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
            Loading workers...
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

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Manage Workers
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage worker accounts, verification
                and applications
              </p>
            </div>
          </div>

          <button
            onClick={fetchWorkers}
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
                Unable to load workers
              </p>

              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

          <SummaryCard
            icon={<Users />}
            title="Total"
            value={totalWorkers}
          />

          <SummaryCard
            icon={<UserCheck />}
            title="Active"
            value={activeWorkers}
          />

          <SummaryCard
            icon={<UserX />}
            title="Inactive"
            value={inactiveWorkers}
          />

          <SummaryCard
            icon={<ShieldCheck />}
            title="Verified"
            value={verifiedWorkers}
          />

          <SummaryCard
            icon={<Briefcase />}
            title="Applications"
            value={totalApplications}
          />

          <SummaryCard
            icon={<CheckCircle />}
            title="Accepted"
            value={acceptedApplications}
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
                placeholder="Search worker..."
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

            {/* Result */}

            <div className="flex items-center justify-center md:justify-start px-4 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900 mx-1">
                {filteredWorkers.length}
              </span>
              of{" "}
              <span className="font-semibold text-slate-900 ml-1">
                {totalWorkers}
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
                    Worker
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Contact
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Applications
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

                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center"
                    >
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                      <p className="font-medium text-slate-700">
                        No workers found
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search
                        or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map(
                    (worker) => (
                      <tr
                        key={worker._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* Worker */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <ProfileAvatar
                              worker={worker}
                              getImageUrl={
                                getImageUrl
                              }
                            />

                            <div>
                              <p className="font-semibold text-slate-900">
                                {worker.fullName}
                              </p>

                              <p className="text-xs text-slate-500">
                                Joined{" "}
                                {formatDate(
                                  worker.createdAt
                                )}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-slate-700">
                            {worker.email}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {worker.phone}
                          </p>

                        </td>

                        {/* Applications */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <Briefcase className="w-4 h-4 text-blue-500" />

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {worker
                                  .applicationStats
                                  ?.total || 0}
                              </p>

                              <p className="text-xs text-slate-500">
                                {worker
                                  .applicationStats
                                  ?.accepted || 0}{" "}
                                accepted
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Verification */}

                        <td className="px-5 py-4">

                          {worker.isVerified ? (
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
                            status={worker.status}
                          />
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              onClick={() =>
                                openDetails(
                                  worker
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
                                  worker
                                )
                              }
                              disabled={
                                actionLoading ===
                                `${worker._id}-verification`
                              }
                              title={
                                worker.isVerified
                                  ? "Remove verification"
                                  : "Verify worker"
                              }
                              className={`p-2 rounded-lg transition ${
                                worker.isVerified
                                  ? "text-amber-600 hover:bg-amber-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {actionLoading ===
                              `${worker._id}-verification` ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : worker.isVerified ? (
                                <ShieldX className="w-4 h-4" />
                              ) : (
                                <ShieldCheck className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  worker
                                )
                              }
                              disabled={
                                actionLoading ===
                                `${worker._id}-status`
                              }
                              title={
                                worker.status ===
                                "active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              className={`p-2 rounded-lg transition ${
                                worker.status ===
                                "active"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {actionLoading ===
                              `${worker._id}-status` ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : worker.status ===
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
            MOBILE / TABLET
        ====================================== */}

        <div className="lg:hidden space-y-4">

          {filteredWorkers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="font-medium text-slate-700">
                No workers found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search or filters.
              </p>

            </div>
          ) : (
            filteredWorkers.map(
              (worker) => (
                <div
                  key={worker._id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
                >

                  {/* Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <ProfileAvatar
                        worker={worker}
                        getImageUrl={
                          getImageUrl
                        }
                      />

                      <div className="min-w-0">

                        <h3 className="font-semibold text-slate-900 truncate">
                          {worker.fullName}
                        </h3>

                        <p className="text-xs text-slate-500 truncate">
                          {worker.email}
                        </p>

                      </div>

                    </div>

                    <StatusBadge
                      status={worker.status}
                    />

                  </div>

                  {/* Details */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <InfoItem
                      icon={<Phone />}
                      label="Phone"
                      value={worker.phone}
                    />

                    <InfoItem
                      icon={<Briefcase />}
                      label="Applications"
                      value={
                        worker.applicationStats
                          ?.total || 0
                      }
                    />

                    <InfoItem
                      icon={<CheckCircle />}
                      label="Accepted"
                      value={
                        worker.applicationStats
                          ?.accepted || 0
                      }
                    />

                    <InfoItem
                      icon={<CalendarDays />}
                      label="Joined"
                      value={formatDate(
                        worker.createdAt
                      )}
                    />

                  </div>

                  {/* Verification */}

                  <div className="mt-4">

                    {worker.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Worker
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
                        openDetails(worker)
                      }
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleVerification(
                          worker
                        )
                      }
                      disabled={
                        actionLoading ===
                        `${worker._id}-verification`
                      }
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        worker.isVerified
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {actionLoading ===
                      `${worker._id}-verification` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : worker.isVerified ? (
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
                          worker
                        )
                      }
                      disabled={
                        actionLoading ===
                        `${worker._id}-status`
                      }
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        worker.status === "active"
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {actionLoading ===
                      `${worker._id}-status` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : worker.status === "active" ? (
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

        {showDetails && selectedWorker && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() =>
              setShowDetails(false)
            }
          >

            <div
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* Modal Header */}

              <div className="flex items-center justify-between p-5 border-b border-slate-200">

                <div className="flex items-center gap-3 min-w-0">

                  <ProfileAvatar
                    worker={selectedWorker}
                    getImageUrl={getImageUrl}
                  />

                  <div className="min-w-0">

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {selectedWorker.fullName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Worker Details
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

                {detailsLoading ? (
                  <div className="py-16 text-center">

                    <RefreshCw className="w-7 h-7 text-blue-600 animate-spin mx-auto mb-3" />

                    <p className="text-sm text-slate-500">
                      Loading worker details...
                    </p>

                  </div>
                ) : (
                  <>
                    {/* Worker Information */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                      <DetailItem
                        icon={<Mail />}
                        label="Email"
                        value={
                          selectedWorker.email
                        }
                      />

                      <DetailItem
                        icon={<Phone />}
                        label="Phone"
                        value={
                          selectedWorker.phone
                        }
                      />

                      <DetailItem
                        icon={<CalendarDays />}
                        label="Joined"
                        value={formatDate(
                          selectedWorker.createdAt
                        )}
                      />

                      <DetailItem
                        icon={
                          selectedWorker.status ===
                          "active" ? (
                            <UserCheck />
                          ) : (
                            <UserX />
                          )
                        }
                        label="Account Status"
                        value={
                          selectedWorker.status
                        }
                      />

                    </div>

                    {/* Verification */}

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                          <p className="font-semibold text-slate-800">
                            Worker Verification
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            Current verification status
                          </p>
                        </div>

                        {selectedWorker.isVerified ? (
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

                    {/* Application Statistics */}

                    <div className="mb-6">

                      <h3 className="font-semibold text-slate-900 mb-3">
                        Application Statistics
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                        <MiniStat
                          label="Total"
                          value={
                            selectedWorker
                              .applicationStats
                              ?.total || 0
                          }
                        />

                        <MiniStat
                          label="Pending"
                          value={
                            selectedWorker
                              .applicationStats
                              ?.pending || 0
                          }
                        />

                        <MiniStat
                          label="Accepted"
                          value={
                            selectedWorker
                              .applicationStats
                              ?.accepted || 0
                          }
                        />

                      </div>

                    </div>

                    {/* Applications */}

                    <div>

                      <div className="flex items-center justify-between mb-3">

                        <h3 className="font-semibold text-slate-900">
                          Applications
                        </h3>

                        <span className="text-xs text-slate-500">
                          {selectedWorker
                            .applications
                            ?.length || 0}{" "}
                          applications
                        </span>

                      </div>

                      {selectedWorker.applications
                        ?.length === 0 ? (
                        <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">

                          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />

                          <p className="text-sm text-slate-500">
                            No applications yet.
                          </p>

                        </div>
                      ) : (
                        <div className="space-y-3">

                          {selectedWorker.applications.map(
                            (application) => (
                              <div
                                key={
                                  application._id
                                }
                                className="border border-slate-200 rounded-xl p-4"
                              >

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                  <div className="min-w-0">

                                    <h4 className="font-semibold text-slate-900">
                                      {application
                                        .job
                                        ?.title ||
                                        "Job unavailable"}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">

                                      <span>
                                        Employer:{" "}
                                        {application
                                          .employer
                                          ?.fullName ||
                                          "N/A"}
                                      </span>

                                      <span>
                                        {application
                                          .job
                                          ?.location ||
                                          "Location N/A"}
                                      </span>

                                    </div>

                                  </div>

                                  <ApplicationStatusBadge
                                    status={
                                      application.status
                                    }
                                  />

                                </div>

                                <div className="flex flex-wrap gap-2 mt-3 text-xs">

                                  {application.job
                                    ?.salary !==
                                    undefined && (
                                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                                      Salary: ₹
                                      {
                                        application
                                          .job
                                          .salary
                                      }
                                    </span>
                                  )}

                                  {application
                                    .job
                                    ?.employmentType && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                                      <Clock className="w-3.5 h-3.5" />
                                      {
                                        application
                                          .job
                                          .employmentType
                                      }
                                    </span>
                                  )}

                                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                                    Applied:{" "}
                                    {formatDate(
                                      application.createdAt
                                    )}
                                  </span>

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>

                    {/* Actions */}

                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-slate-200">

                      <button
                        onClick={() =>
                          handleVerification(
                            selectedWorker
                          )
                        }
                        disabled={
                          actionLoading ===
                          `${selectedWorker._id}-verification`
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                          selectedWorker.isVerified
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {selectedWorker.isVerified ? (
                          <>
                            <ShieldX className="w-4 h-4" />
                            Remove Verification
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Verify Worker
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(
                            selectedWorker
                          )
                        }
                        disabled={
                          actionLoading ===
                          `${selectedWorker._id}-status`
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                          selectedWorker.status ===
                          "active"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {selectedWorker.status ===
                        "active" ? (
                          <>
                            <UserX className="w-4 h-4" />
                            Deactivate Worker
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Activate Worker
                          </>
                        )}
                      </button>

                    </div>
                  </>
                )}

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
  worker,
  getImageUrl,
}) => {
  const imageUrl = getImageUrl(worker);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={worker.fullName}
        className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Users className="w-5 h-5 text-blue-600" />
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
// APPLICATION STATUS BADGE
// ==========================================

const ApplicationStatusBadge = ({
  status,
}) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    shortlisted:
      "bg-blue-50 text-blue-700",
    accepted:
      "bg-green-50 text-green-700",
    rejected:
      "bg-red-50 text-red-700",
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


export default AdminWorkers;
