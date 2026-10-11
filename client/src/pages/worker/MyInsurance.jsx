
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  IndianRupee,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const MyInsurance = () => {
  const [insurance, setInsurance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      setLoading(true);

      const response = await api.get("/insurance/my");

      if (response.data.success) {
        setInsurance(response.data.insurance || []);
      }
    } catch (error) {
      console.error("Fetch My Insurance Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your insurance policies."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <ShieldCheck size={16} />;

      case "pending":
        return <Clock size={16} />;

      case "expired":
        return <XCircle size={16} />;

      case "cancelled":
        return <XCircle size={16} />;

      default:
        return <FileText size={16} />;
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShieldCheck
                size={24}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                My Insurance
              </h1>

              <p className="text-gray-500 mt-1">
                View your insurance policies and coverage details
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading your insurance policies...
            </p>
          </div>
        ) : insurance.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 md:p-16 text-center">

            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck
                size={40}
                className="text-blue-500"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Insurance Policies
            </h2>

            <p className="text-gray-500 max-w-md mx-auto">
              You don't have any insurance policies assigned to your
              account yet. Please contact your employer or insurance
              officer for more information.
            </p>
          </div>

        ) : (

          /* Policy Cards */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {insurance.map((policy) => (
              <div
                key={policy._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
              >

                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <ShieldCheck
                          size={25}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Policy Number
                        </p>

                        <h2 className="font-bold text-gray-900">
                          {policy.policyNumber}
                        </h2>
                      </div>

                    </div>

                    {/* Status */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        policy.status
                      )}`}
                    >
                      {getStatusIcon(policy.status)}
                      {policy.status}
                    </div>

                  </div>
                </div>

                {/* Policy Details */}
                <div className="p-6">

                  <div className="grid grid-cols-2 gap-5 mb-6">

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Provider
                      </p>

                      <p className="font-semibold text-gray-900">
                        {policy.insuranceProvider}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Policy Type
                      </p>

                      <p className="font-semibold text-gray-900">
                        {policy.policyType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Coverage
                      </p>

                      <div className="flex items-center gap-1 text-gray-900">
                        <IndianRupee size={15} />

                        <p className="font-semibold">
                          {formatCurrency(policy.coverageAmount)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Premium
                      </p>

                      <div className="flex items-center gap-1 text-gray-900">
                        <IndianRupee size={15} />

                        <p className="font-semibold">
                          {formatCurrency(policy.premiumAmount)}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Policy Period */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5">

                    <div className="flex items-center gap-2 mb-3">
                      <Calendar
                        size={17}
                        className="text-gray-500"
                      />

                      <p className="text-sm font-semibold text-gray-700">
                        Policy Period
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="text-xs text-gray-500">
                          Start Date
                        </p>

                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(policy.startDate)}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-gray-400"
                      />

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          End Date
                        </p>

                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(policy.endDate)}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    to={`/worker/insurance/${policy._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    View Policy Details
                    <ChevronRight size={18} />
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default MyInsurance;