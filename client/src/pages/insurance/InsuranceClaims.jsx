
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


import {
  Search,
  FileText,
  Eye,
  X,
} from "lucide-react";

const InsuranceClaims = () => {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/insurance/claims"
      );

      setClaims(response.data.claims || []);
    } catch (error) {
      console.error(
        "Fetch Claims Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load claims."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filteredClaims = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return claims.filter((claim) => {
      const matchesSearch =
        !searchValue ||
        claim.claimNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        claim.claimType
          ?.toLowerCase()
          .includes(searchValue) ||
        claim.worker?.fullName
          ?.toLowerCase()
          .includes(searchValue) ||
        claim.worker?.email
          ?.toLowerCase()
          .includes(searchValue) ||
        claim.insurance?.policyNumber
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, search, statusFilter]);

  const clearSearch = () => {
    setSearch("");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "under_review":
        return "bg-yellow-100 text-yellow-700";

      case "settled":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    return status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  return (
    <DashboardLayout>
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Insurance Claims
        </h1>

        <p className="text-gray-500 mt-1">
          Review and manage insurance claims
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
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
            placeholder="Search claim, worker or policy..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="px-4 py-3 border border-gray-300 rounded-xl outline-none"
        >
          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

          <option value="settled">
            Settled
          </option>
        </select>
      </div>

      {(search || statusFilter !== "all") && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredClaims.length} of{" "}
          {claims.length} claims
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          Loading claims...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-5">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredClaims.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <FileText
              size={40}
              className="mx-auto mb-3 text-gray-400"
            />

            <h3 className="font-semibold text-lg">
              {search ||
              statusFilter !== "all"
                ? "No matching claims"
                : "No claims found"}
            </h3>

            <p className="text-gray-500 mt-1">
              Try changing your search or filter.
            </p>
          </div>
        )}

      {/* Claims */}
      {!loading &&
        !error &&
        filteredClaims.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">
                    Claim
                  </th>

                  <th className="p-4 text-left">
                    Worker
                  </th>

                  <th className="p-4 text-left">
                    Policy
                  </th>

                  <th className="p-4 text-left">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Incident Date
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredClaims.map((claim) => (
                  <tr
                    key={claim._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText size={18} />

                        <div>
                          <p className="font-medium">
                            {claim.claimNumber}
                          </p>

                          <p className="text-sm text-gray-500">
                            {claim.claimType}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {claim.worker?.fullName ||
                            "-"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {claim.worker?.email ||
                            ""}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      {claim.insurance
                        ?.policyNumber || "-"}
                    </td>

                    <td className="p-4 font-medium">
                      ₹
                      {Number(
                        claim.claimAmount || 0
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {claim.incidentDate
                        ? new Date(
                            claim.incidentDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                          claim.status
                        )}`}
                      >
                        {formatStatus(
                          claim.status
                        )}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        to={`/insurance/claims/${claim._id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
    </DashboardLayout>
  );
};

export default InsuranceClaims;
