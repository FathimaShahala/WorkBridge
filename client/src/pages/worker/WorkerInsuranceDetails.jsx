
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

const WorkerInsuranceDetails = () => {
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

      const response = await api.get(`/insurance/my/${id}`);

      if (response.data.success) {
        setInsurance(response.data.insurance);
      }
    } catch (error) {
      console.error("Fetch Insurance Details Error:", error);

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
    if (amount === undefined || amount === null) {
      return "-";
    }

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-500">
            Loading insurance policy...
          </p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!insurance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">

          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck
              size={32}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Policy Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            This insurance policy could not be found or does not
            belong to your account.
          </p>

          <button
            onClick={() => navigate("/worker/insurance")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to My Insurance
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">

          <button
            onClick={() => navigate("/worker/insurance")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-4"
          >
            <ArrowLeft size={18} />
            Back to My Insurance
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShieldCheck
                  size={27}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Insurance Policy
                </h1>

                <p className="text-gray-500 mt-1">
                  Policy #{insurance.policyNumber}
                </p>
              </div>

            </div>

            {/* Status */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium capitalize ${getStatusStyle(
                insurance.status
              )}`}
            >
              {getStatusIcon(insurance.status)}
              {insurance.status}
            </div>

          </div>
        </div>

        {/* Policy Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

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

              <div className="flex items-center gap-1">
                <IndianRupee
                  size={17}
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

              <div className="flex items-center gap-1">
                <IndianRupee
                  size={17}
                  className="text-blue-600"
                />

                <p className="font-semibold text-gray-900">
                  {formatCurrency(insurance.premiumAmount)}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Policy Details */}
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
                    Policy Details
                  </h2>

                  <p className="text-sm text-gray-500">
                    Complete insurance information
                  </p>
                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Policy Number */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Policy Number
                  </p>

                  <p className="font-semibold text-gray-900">
                    {insurance.policyNumber}
                  </p>
                </div>

                {/* Provider */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Provider
                  </p>

                  <p className="font-semibold text-gray-900">
                    {insurance.insuranceProvider}
                  </p>
                </div>

                {/* Type */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Policy Type
                  </p>

                  <p className="font-semibold text-gray-900">
                    {insurance.policyType}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusStyle(
                      insurance.status
                    )}`}
                  >
                    {getStatusIcon(insurance.status)}
                    {insurance.status}
                  </span>
                </div>

                {/* Coverage */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Coverage Amount
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(insurance.coverageAmount)}
                  </p>
                </div>

                {/* Premium */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Premium Amount
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(insurance.premiumAmount)}
                  </p>
                </div>

              </div>

              {/* Policy Period */}
              <div className="mt-8">

                <h3 className="font-semibold text-gray-900 mb-4">
                  Policy Period
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="border border-gray-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-2">
                      <Calendar
                        size={18}
                        className="text-green-600"
                      />

                      <p className="text-sm text-gray-500">
                        Start Date
                      </p>
                    </div>

                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(insurance.startDate)}
                    </p>

                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-2">
                      <Calendar
                        size={18}
                        className="text-red-500"
                      />

                      <p className="text-sm text-gray-500">
                        Expiry Date
                      </p>
                    </div>

                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(insurance.endDate)}
                    </p>

                  </div>

                </div>

              </div>

              {/* Notes */}
              <div className="mt-8">

                <h3 className="font-semibold text-gray-900 mb-3">
                  Notes
                </h3>

                <div className="bg-gray-50 rounded-xl p-5">

                  <p className="text-gray-700 leading-relaxed">
                    {insurance.notes ||
                      "No additional notes are available for this policy."}
                  </p>

                </div>

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
                    Policy Holder
                  </h2>

                  <p className="text-sm text-gray-500">
                    Worker information
                  </p>
                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <User
                    size={27}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    My Insurance
                  </h3>

                  <p className="text-sm text-gray-500">
                    Policy Holder
                  </p>
                </div>

              </div>

              <div className="space-y-5">

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Policy Status
                  </p>

                  <p className="text-gray-800 capitalize">
                    {insurance.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Coverage
                  </p>

                  <p className="font-semibold text-gray-900">
                    {formatCurrency(insurance.coverageAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Valid Until
                  </p>

                  <p className="text-gray-800">
                    {formatDate(insurance.endDate)}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Bottom Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">

          <div className="flex items-start gap-3">

            <HeartPulse
              size={21}
              className="text-blue-600 mt-0.5 shrink-0"
            />

            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Insurance Information
              </h3>

              <p className="text-sm text-blue-800 leading-relaxed">
                Keep your insurance policy details safe. If you
                have questions about your coverage, premium, or
                policy status, please contact your insurance
                officer.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default WorkerInsuranceDetails;
