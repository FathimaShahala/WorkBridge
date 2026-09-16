
import { useEffect, useState } from "react";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


import {
  ShieldCheck,
  FileText,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

const InsuranceReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/insurance/reports"
      );

      console.log(
        "Insurance Reports:",
        response.data
      );

      setData(response.data);
    } catch (error) {
      console.error(
        "Fetch Insurance Reports Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load insurance reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-xl shadow p-10 text-center">
          Loading insurance reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 text-red-600 rounded-xl p-6">
          <p className="font-semibold mb-2">
            Unable to load reports
          </p>

          <p>{error}</p>

          <button
            onClick={fetchReports}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const policyStats = data?.policyStats || {};
  const claimStats = data?.claimStats || {};
  const financialStats =
    data?.financialStats || {};

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
            Insurance Reports
          </h1>

          <p className="text-gray-500 mt-1">
            Overview of insurance policies, claims
            and financial information
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ==========================================
          POLICY STATISTICS
      ========================================== */}

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Policy Statistics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Policies"
            value={policyStats.total || 0}
            icon={<ShieldCheck size={22} />}
          />

          <StatCard
            title="Active"
            value={policyStats.active || 0}
            icon={<ShieldCheck size={22} />}
          />

          <StatCard
            title="Pending"
            value={policyStats.pending || 0}
            icon={<ShieldCheck size={22} />}
          />

          <StatCard
            title="Expired"
            value={policyStats.expired || 0}
            icon={<ShieldCheck size={22} />}
          />

          <StatCard
            title="Cancelled"
            value={policyStats.cancelled || 0}
            icon={<ShieldCheck size={22} />}
          />
        </div>
      </section>

      {/* ==========================================
          CLAIM STATISTICS
      ========================================== */}

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Claim Statistics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Claims"
            value={claimStats.total || 0}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Pending"
            value={claimStats.pending || 0}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Under Review"
            value={
              claimStats.underReview || 0
            }
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Approved"
            value={claimStats.approved || 0}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Rejected"
            value={claimStats.rejected || 0}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Settled"
            value={claimStats.settled || 0}
            icon={<FileText size={22} />}
          />
        </div>
      </section>

      {/* ==========================================
          FINANCIAL OVERVIEW
      ========================================== */}

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Financial Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Coverage"
            value={`₹${Number(
              financialStats.totalCoverage || 0
            ).toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
          />

          <StatCard
            title="Total Premium"
            value={`₹${Number(
              financialStats.totalPremium || 0
            ).toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
          />

          <StatCard
            title="Total Claimed"
            value={`₹${Number(
              financialStats.totalClaimedAmount ||
                0
            ).toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
          />

          <StatCard
            title="Total Approved"
            value={`₹${Number(
              financialStats.totalApprovedAmount ||
                0
            ).toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
          />
        </div>
      </section>
    </div>
    </DashboardLayout>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <DashboardLayout>
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold mt-2">
            {value}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default InsuranceReports;