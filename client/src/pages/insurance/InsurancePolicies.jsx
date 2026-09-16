import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const InsurancePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      setFilteredPolicies(policies);
      return;
    }

    const filtered = policies.filter((policy) => {
      return (
        policy.policyNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        policy.insuranceProvider
          ?.toLowerCase()
          .includes(searchValue) ||
        policy.policyType
          ?.toLowerCase()
          .includes(searchValue) ||
        policy.worker?.fullName
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

    setFilteredPolicies(filtered);
  }, [search, policies]);

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/insurance");

      if (response.data.success) {
        setPolicies(response.data.insurance || []);
      }
    } catch (error) {
      console.error("Fetch Insurance Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load insurance policies."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this insurance policy?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await api.delete(
        `/insurance/${id}`
      );

      if (response.data.success) {
        toast.success(
          "Insurance policy deleted successfully."
        );

        setPolicies((prev) =>
          prev.filter((policy) => policy._id !== id)
        );
      }
    } catch (error) {
      console.error("Delete Insurance Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete insurance policy."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "expired":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Insurance Policies
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all worker insurance policies.
          </p>
        </div>

        <Link
          to="/insurance/policies/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Policy
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search policy, worker or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Policies */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading insurance policies...
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="p-12 text-center">
            <FileText
              size={45}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 font-semibold text-gray-800">
              No insurance policies found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try a different search."
                : "Create your first insurance policy."}
            </p>

            {!search && (
              <Link
                to="/insurance/policies/create"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Add Policy
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-medium">
                    Policy Number
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Worker
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Provider
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Policy Type
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Coverage
                  </th>

                  <th className="px-5 py-4 font-medium">
                    End Date
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPolicies.map((policy) => (
                  <tr
                    key={policy._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Policy Number */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        {policy.policyNumber}
                      </span>
                    </td>

                    {/* Worker */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {policy.worker?.fullName ||
                            "Unknown Worker"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {policy.worker?.email || "-"}
                        </p>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-5 py-4 text-gray-600">
                      {policy.insuranceProvider}
                    </td>

                    {/* Policy Type */}
                    <td className="px-5 py-4 text-gray-600">
                      {policy.policyType}
                    </td>

                    {/* Coverage */}
                    <td className="px-5 py-4 font-medium text-gray-700">
                      ₹
                      {Number(
                        policy.coverageAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* End Date */}
                    <td className="px-5 py-4 text-gray-600">
                      {policy.endDate
                        ? new Date(
                            policy.endDate
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          policy.status
                        )}`}
                      >
                        {policy.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/insurance/policies/${policy._id}`}
                          title="View Policy"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/insurance/policies/${policy._id}/edit`}
                          title="Edit Policy"
                          className="rounded-lg p-2 text-yellow-600 transition hover:bg-yellow-50"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          type="button"
                          title="Delete Policy"
                          onClick={() =>
                            handleDelete(policy._id)
                          }
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Count */}
      {!loading && filteredPolicies.length > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredPolicies.length} of{" "}
          {policies.length} policies
        </p>
      )}
    </div>
    </DashboardLayout>
  );
};

export default InsurancePolicies;