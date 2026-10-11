
import { useEffect, useState } from "react";
import axios from "../../services/api";

import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Trash2,
  X,
  Mail,
  Phone,
  Shield,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminUsers = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] =
    useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/admin/users");

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      user.fullName?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.phone?.toLowerCase().includes(searchValue);

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      user.status === statusFilter;

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" &&
        user.isVerified === true) ||
      (verificationFilter === "unverified" &&
        user.isVerified === false);

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus &&
      matchesVerification
    );
  });

  // ==========================================
  // VERIFY / UNVERIFY
  // ==========================================

  const handleVerification = async (user) => {
    try {
      setActionLoading(user._id);

      const newVerificationStatus =
        !user.isVerified;

      const response = await axios.put(
        `/admin/users/${user._id}/verification`,
        {
          isVerified: newVerificationStatus,
        }
      );

      if (response.data.success) {
        setUsers((previousUsers) =>
          previousUsers.map((item) =>
            item._id === user._id
              ? {
                  ...item,
                  isVerified:
                    newVerificationStatus,
                }
              : item
          )
        );

        setSelectedUser((previous) =>
          previous?._id === user._id
            ? {
                ...previous,
                isVerified:
                  newVerificationStatus,
              }
            : previous
        );

        toast.success(
          newVerificationStatus
            ? "User verified successfully."
            : "User verification removed."
        );
      }
    } catch (error) {
      console.error(
        "Verification Update Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update verification."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const handleStatusChange = async (user) => {
    const newStatus =
      user.status === "active"
        ? "inactive"
        : "active";

    const action =
      newStatus === "active"
        ? "activate"
        : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user._id);

      const response = await axios.put(
        `/admin/users/${user._id}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setUsers((previousUsers) =>
          previousUsers.map((item) =>
            item._id === user._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
          )
        );

        setSelectedUser((previous) =>
          previous?._id === user._id
            ? {
                ...previous,
                status: newStatus,
              }
            : previous
        );

        toast.success(
          newStatus === "active"
            ? "User activated successfully."
            : "User deactivated successfully."
        );
      }
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user._id);

      const response = await axios.delete(
        `/admin/users/${user._id}`
      );

      if (response.data.success) {
        setUsers((previousUsers) =>
          previousUsers.filter(
            (item) => item._id !== user._id
          )
        );

        if (selectedUser?._id === user._id) {
          setSelectedUser(null);
        }

        toast.success(
          "User deleted successfully."
        );
      }
    } catch (error) {
      console.error("Delete User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // ROLE LABEL
  // ==========================================

  const getRoleLabel = (role) => {
    const roles = {
      admin: "Admin",
      worker: "Worker",
      employer: "Employer",
      labourOfficer: "Labour Officer",
      police: "Police",
      insurance: "Insurance",
    };

    return roles[role] || role;
  };

  // ==========================================
  // ROLE STYLE
  // ==========================================

  const getRoleStyle = (role) => {
    const styles = {
      admin: "bg-purple-50 text-purple-700",
      worker: "bg-green-50 text-green-700",
      employer: "bg-blue-50 text-blue-700",
      labourOfficer:
        "bg-indigo-50 text-indigo-700",
      police: "bg-slate-100 text-slate-700",
      insurance:
        "bg-orange-50 text-orange-700",
    };

    return (
      styles[role] ||
      "bg-gray-100 text-gray-700"
    );
  };

  // ==========================================
  // FORMAT DATE
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />

          <p className="text-gray-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Manage Users
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                  Manage all WorkBridge platform users.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">

          <SummaryCard
            title="Total"
            value={users.length}
            icon={Users}
            iconStyle="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            title="Active"
            value={
              users.filter(
                (user) =>
                  user.status === "active"
              ).length
            }
            icon={UserCheck}
            iconStyle="bg-green-50 text-green-600"
          />

          <SummaryCard
            title="Inactive"
            value={
              users.filter(
                (user) =>
                  user.status === "inactive"
              ).length
            }
            icon={UserX}
            iconStyle="bg-red-50 text-red-600"
          />

          <SummaryCard
            title="Verified"
            value={
              users.filter(
                (user) => user.isVerified
              ).length
            }
            icon={Shield}
            iconStyle="bg-purple-50 text-purple-600"
          />

        </div>

        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">

          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />

            <h2 className="font-semibold text-gray-800">
              Search & Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Search */}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search name, email or phone..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                All Roles
              </option>

              <option value="worker">
                Worker
              </option>

              <option value="employer">
                Employer
              </option>

              <option value="labourOfficer">
                Labour Officer
              </option>

              <option value="police">
                Police
              </option>

              <option value="insurance">
                Insurance
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

        </div>

        {/* ======================================
            RESULT COUNT
        ====================================== */}

        <div className="flex items-center justify-between mb-4">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {users.length}
            </span>{" "}
            users
          </p>

          {(search ||
            roleFilter !== "all" ||
            statusFilter !== "all" ||
            verificationFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter("all");
                setVerificationFilter("all");
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}

        </div>

        {/* ======================================
            DESKTOP TABLE
        ====================================== */}

        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Contact
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Verification
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                      <p className="text-gray-500">
                        No users found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* User */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <UserAvatar user={user} />

                          <div>
                            <p className="font-medium text-gray-800">
                              {user.fullName}
                            </p>

                            <p className="text-xs text-gray-400">
                              Joined{" "}
                              {formatDate(
                                user.createdAt
                              )}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Contact */}

                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-600">
                          {user.email}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {user.phone}
                        </p>

                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(
                            user.role
                          )}
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status ===
                            "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>

                      </td>

                      {/* Verification */}

                      <td className="px-6 py-4">

                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-orange-600 text-sm">
                            <XCircle className="w-4 h-4" />
                            Unverified
                          </span>
                        )}

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <ActionButton
                            title="View Details"
                            onClick={() =>
                              setSelectedUser(
                                user
                              )
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </ActionButton>

                          <ActionButton
                            title={
                              user.isVerified
                                ? "Unverify"
                                : "Verify"
                            }
                            onClick={() =>
                              handleVerification(
                                user
                              )
                            }
                            disabled={
                              actionLoading ===
                              user._id
                            }
                          >
                            {actionLoading ===
                            user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : user.isVerified ? (
                              <XCircle className="w-4 h-4 text-orange-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </ActionButton>

                          <ActionButton
                            title={
                              user.status ===
                              "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() =>
                              handleStatusChange(
                                user
                              )
                            }
                            disabled={
                              actionLoading ===
                              user._id
                            }
                          >
                            {user.status ===
                            "active" ? (
                              <UserX className="w-4 h-4 text-red-500" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-green-600" />
                            )}
                          </ActionButton>

                          <ActionButton
                            title="Delete"
                            onClick={() =>
                              handleDelete(user)
                            }
                            disabled={
                              actionLoading ===
                              user._id
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </ActionButton>

                        </div>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ======================================
            MOBILE / TABLET CARDS
        ====================================== */}

        <div className="lg:hidden space-y-4">

          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />

              <p className="text-gray-500">
                No users found.
              </p>

            </div>
          ) : (
            filteredUsers.map((user) => (

              <div
                key={user._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >

                {/* User header */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <UserAvatar user={user} />

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {user.fullName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleStyle(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(
                      user.role
                    )}
                  </span>

                </div>

                {/* User information */}

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-sm">

                    <Phone className="w-4 h-4 text-gray-400" />

                    <span className="text-gray-600">
                      {user.phone}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-sm">

                    <CalendarDays className="w-4 h-4 text-gray-400" />

                    <span className="text-gray-600">
                      Joined{" "}
                      {formatDate(
                        user.createdAt
                      )}
                    </span>

                  </div>

                </div>

                {/* Badges */}

                <div className="flex flex-wrap gap-2 mt-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>

                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      Unverified
                    </span>
                  )}

                </div>

                {/* Actions */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">

                  <button
                    onClick={() =>
                      setSelectedUser(user)
                    }
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleVerification(user)
                    }
                    disabled={
                      actionLoading === user._id
                    }
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm transition disabled:opacity-50"
                  >
                    {user.isVerified ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(user)
                    }
                    disabled={
                      actionLoading === user._id
                    }
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition disabled:opacity-50 ${
                      user.status === "active"
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {user.status === "active" ? (
                      <>
                        <UserX className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(user)
                    }
                    disabled={
                      actionLoading === user._id
                    }
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

      {/* ========================================
          USER DETAILS MODAL
      ======================================== */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal header */}

            <div className="flex items-center justify-between p-5 border-b border-gray-100">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  User Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Complete user information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

            </div>

            {/* Profile */}

            <div className="p-6">

              <div className="flex flex-col items-center text-center">

                <UserAvatar
                  user={selectedUser}
                  large
                />

                <h3 className="text-xl font-bold text-gray-800 mt-4">
                  {selectedUser.fullName}
                </h3>

                <span
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleStyle(
                    selectedUser.role
                  )}`}
                >
                  {getRoleLabel(
                    selectedUser.role
                  )}
                </span>

              </div>

              {/* Details */}

              <div className="mt-7 space-y-4">

                <DetailRow
                  icon={Mail}
                  label="Email"
                  value={selectedUser.email}
                />

                <DetailRow
                  icon={Phone}
                  label="Phone"
                  value={selectedUser.phone}
                />

                <DetailRow
                  icon={Shield}
                  label="Role"
                  value={getRoleLabel(
                    selectedUser.role
                  )}
                />

                <DetailRow
                  icon={CalendarDays}
                  label="Joined"
                  value={formatDate(
                    selectedUser.createdAt
                  )}
                />

                <div className="flex items-center justify-between py-3 border-b border-gray-100">

                  <span className="text-sm text-gray-500">
                    Account Status
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.status ===
                      "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {selectedUser.status}
                  </span>

                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">

                  <span className="text-sm text-gray-500">
                    Verification
                  </span>

                  {selectedUser.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      Unverified
                    </span>
                  )}

                </div>

              </div>

              {/* Modal actions */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">

                <button
                  onClick={() =>
                    handleVerification(
                      selectedUser
                    )
                  }
                  disabled={
                    actionLoading ===
                    selectedUser._id
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {selectedUser.isVerified
                    ? "Unverify"
                    : "Verify"}
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(
                      selectedUser
                    )
                  }
                  disabled={
                    actionLoading ===
                    selectedUser._id
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition disabled:opacity-50 ${
                    selectedUser.status ===
                    "active"
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {selectedUser.status ===
                  "active"
                    ? "Deactivate"
                    : "Activate"}
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      selectedUser
                    )
                  }
                  disabled={
                    actionLoading ===
                    selectedUser._id
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
    </DashboardLayout>
  );
};


// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  iconStyle,
}) => {
  return (
    
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs sm:text-sm text-gray-500">
            {title}
          </p>

          <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
            {value}
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconStyle}`}
        >
          <Icon className="w-5 h-5" />
        </div>

      </div>

    </div>
  );
};


// ==========================================
// USER AVATAR
// ==========================================

const UserAvatar = ({
  user,
  large = false,
}) => {
  const imageUrl = user.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `http://localhost:5000${user.profileImage}`
    : null;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user.fullName}
        className={`rounded-full object-cover ${
          large
            ? "w-24 h-24"
            : "w-11 h-11"
        }`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold ${
        large
          ? "w-24 h-24 text-3xl"
          : "w-11 h-11 text-lg"
      }`}
    >
      {user.fullName
        ?.charAt(0)
        ?.toUpperCase() || "U"}
    </div>
  );
};


// ==========================================
// ACTION BUTTON
// ==========================================

const ActionButton = ({
  children,
  title,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-50"
    >
      {children}
    </button>
  );
};


// ==========================================
// DETAIL ROW
// ==========================================

const DetailRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100">

      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>

      <div className="min-w-0">

        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="text-sm text-gray-700 break-all mt-0.5">
          {value || "N/A"}
        </p>

      </div>

    </div>
  );
};

export default AdminUsers;
