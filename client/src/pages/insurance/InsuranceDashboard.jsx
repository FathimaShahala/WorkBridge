import { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileText,
  Users,
  AlertCircle,
  Plus,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import api from "../../services/api";

const InsuranceDashboard = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/insurance");

      if (response.data.success) {
        setPolicies(response.data.insurance || []);
      }
    } catch (error) {
      console.error("Failed to fetch insurance policies:", error);
    } finally {
      setLoading(false);
    }
  };

  const activePolicies = policies.filter(
    (policy) => policy.status === "active"
  ).length;

  const pendingPolicies = policies.filter(
    (policy) => policy.status === "pending"
  ).length;

  const expiredPolicies = policies.filter(
    (policy) => policy.status === "expired"
  ).length;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Insurance Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage worker insurance policies and coverage.
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Policies
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {loading ? "..." : policies.length}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Policies
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {loading ? "..." : activePolicies}
              </h2>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                {loading ? "..." : pendingPolicies}
              </h2>
            </div>

            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Expired */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Expired
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {loading ? "..." : expiredPolicies}
              </h2>
            </div>

            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Policies */}
      <div className="mt-8 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Insurance Policies
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recently created worker insurance policies.
            </p>
          </div>

          <Link
            to="/insurance/policies"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading policies...
          </div>
        ) : policies.length === 0 ? (
          <div className="p-10 text-center">
            <FileText
              size={40}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-gray-500">
              No insurance policies found.
            </p>

            <Link
              to="/insurance/policies/create"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Create First Policy
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Policy Number
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Worker
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Provider
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Coverage
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {policies.slice(0, 5).map((policy) => (
                  <tr
                    key={policy._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {policy.policyNumber}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {policy.worker?.fullName || "Unknown"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {policy.insuranceProvider}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      ₹{Number(
                        policy.coverageAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          policy.status === "active"
                            ? "bg-green-100 text-green-700"
                            : policy.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : policy.status === "expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default InsuranceDashboard;