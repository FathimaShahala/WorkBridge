
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HeartPulse,
  IndianRupee,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

const InsurancePolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsurance();
  }, [id]);

  const fetchInsurance = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/insurance/${id}`);

      if (response.data.success) {
        setInsurance(response.data.insurance);
      }
    } catch (error) {
      console.error("Fetch Insurance Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch insurance policy."
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
        return <CheckCircle size={18} />;

      case "pending":
        return <Clock size={18} />;

      case "expired":
        return <XCircle size={18} />;

      case "cancelled":
        return <XCircle size={18} />;

      default:
        return <FileText size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Loading insurance policy...
          </p>
        </div>
      </div>
    );
  }

  if (!insurance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <FileText
            size={48}
            className="mx-auto text-gray-400 mb-4"
          />

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Policy Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            The insurance policy you are looking for does not exist
            or could not be loaded.
          </p>

          <button
            onClick={() => navigate("/insurance/policies")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <button
              onClick={() => navigate("/insurance/policies")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-3 transition"
            >
              <ArrowLeft size={18} />
              Back to Policies
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShieldCheck
                  size={26}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Insurance Policy Details
                </h1>

                <p className="text-gray-500 mt-1">
                  Policy #{insurance.policyNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <Link
              to={`/insurance/policies/${insurance._id}/edit`}
              className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Edit Policy
            </Link>

          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Current Status
              </p>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium capitalize ${getStatusStyle(
                  insurance.status
                )}`}
              >
                {getStatusIcon(insurance.status)}
                {insurance.status}
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500">
                Policy Number
              </p>

              <p className="text-lg font-semibold text-gray-900">
                {insurance.policyNumber}
              </p>
            </div>

          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Policy Information */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">

            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText
                    size={21}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Policy Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Insurance coverage details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Provider */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Insurance Provider
                </p>

                <p className="font-semibold text-gray-900">
                  {insurance.insuranceProvider}
                </p>
              </div>

              {/* Policy Type */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Policy Type
                </p>

                <p className="font-semibold text-gray-900">
                  {insurance.policyType}
                </p>
              </div>

              {/* Coverage */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Coverage Amount
                </p>

                <div className="flex items-center gap-2">
                  <IndianRupee
                    size={18}
                    className="text-green-600"
                  />

                  <p className="font-semibold text-gray-900">
                    {formatCurrency(insurance.coverageAmount)}
                  </p>
                </div>
              </div>

              {/* Premium */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Premium Amount
                </p>

                <div className="flex items-center gap-2">
                  <IndianRupee
                    size={18}
                    className="text-blue-600"
                  />

                  <p className="font-semibold text-gray-900">
                    {formatCurrency(insurance.premiumAmount)}
                  </p>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Start Date
                </p>

                <div className="flex items-center gap-2">
                  <Calendar
                    size={18}
                    className="text-gray-500"
                  />

                  <p className="font-semibold text-gray-900">
                    {formatDate(insurance.startDate)}
                  </p>
                </div>
              </div>

              {/* End Date */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  End Date
                </p>

                <div className="flex items-center gap-2">
                  <Calendar
                    size={18}
                    className="text-gray-500"
                  />

                  <p className="font-semibold text-gray-900">
                    {formatDate(insurance.endDate)}
                  </p>
                </div>
              </div>

            </div>

            {/* Notes */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-500 mb-2">
                  Notes
                </p>

                <p className="text-gray-700 leading-relaxed">
                  {insurance.notes || "No notes added for this policy."}
                </p>
              </div>
            </div>

          </div>

          {/* Worker Information */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-fit">

            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User
                    size={21}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Worker Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Policy holder details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">

                {insurance.worker?.profileImage ? (
                  <img
                    src={`http://localhost:5000${insurance.worker.profileImage}`}
                    alt={insurance.worker.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                    <User
                      size={26}
                      className="text-purple-600"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {insurance.worker?.fullName || "Unknown Worker"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Worker
                  </p>
                </div>

              </div>

              {/* Email */}
              <div className="mb-5">
                <p className="text-sm text-gray-500 mb-1">
                  Email
                </p>

                <p className="text-gray-800 break-all">
                  {insurance.worker?.email || "-"}
                </p>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <p className="text-sm text-gray-500 mb-1">
                  Phone
                </p>

                <p className="text-gray-800">
                  {insurance.worker?.phone || "-"}
                </p>
              </div>

              {/* Verification */}
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Verification
                </p>

                {insurance.worker?.isVerified ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    <CheckCircle size={16} />
                    Verified Worker
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                    <Clock size={16} />
                    Verification Pending
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Policy Dates */}
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <HeartPulse
                size={21}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Policy Period
              </h2>

              <p className="text-sm text-gray-500">
                Coverage validity period
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">
                Policy Starts
              </p>

              <p className="text-xl font-bold text-gray-900">
                {formatDate(insurance.startDate)}
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">
                Policy Expires
              </p>

              <p className="text-xl font-bold text-gray-900">
                {formatDate(insurance.endDate)}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default InsurancePolicyDetails;
