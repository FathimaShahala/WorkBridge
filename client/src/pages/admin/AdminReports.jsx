import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/reports");
      setReport(response.data);
    } catch (error) {
      console.error("Fetch Admin Reports Error:", error);
      toast.error(error.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);
  const formatMonth = (year, month) => {
    return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };
  const buildLast12Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: date.toLocaleDateString("en-IN", { month: "short" }),
      });
    }
    return months;
  };
  const months = useMemo(() => buildLast12Months(), []);
  const getTrendValue = (data = [], year, month) => {
    const item = data.find(
      (entry) => entry._id?.year === year && entry._id?.month === month,
    );
    return item?.count || 0;
  };
  const StatCard = ({ title, value, icon: Icon, iconClass, iconBg }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <p className="text-sm font-medium text-gray-500"> {title} </p>{" "}
          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {" "}
            {value ?? 0}{" "}
          </h3>{" "}
        </div>{" "}
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          {" "}
          <Icon className={`h-5 w-5 ${iconClass}`} />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
  const TrendChart = ({ title, data, icon: Icon, iconClass }) => {
    const values = months.map((item) =>
      getTrendValue(data, item.year, item.month),
    );
    const maxValue = Math.max(...values, 1);
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {" "}
        <div className="mb-5 flex items-center gap-3">
          {" "}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            {" "}
            <Icon className={`h-5 w-5 ${iconClass}`} />{" "}
          </div>{" "}
          <div>
            {" "}
            <h3 className="font-semibold text-gray-900"> {title} </h3>{" "}
            <p className="text-xs text-gray-500"> Last 12 months </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex h-56 items-end gap-1 sm:gap-2">
          {" "}
          {values.map((value, index) => {
            const height =
              value === 0 ? 3 : Math.max((value / maxValue) * 100, 5);
            return (
              <div
                key={`${months[index].year}-${months[index].month}`}
                className="group flex h-full flex-1 flex-col items-center justify-end"
              >
                {" "}
                <div className="relative flex w-full flex-1 items-end justify-center">
                  {" "}
                  <div
                    className="w-full max-w-[34px] rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`${value}`}
                  >
                    {" "}
                    <span className="pointer-events-none absolute -translate-y-6 whitespace-nowrap rounded bg-gray-900 px-1.5 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                      {" "}
                      {value}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <span className="mt-2 text-[10px] text-gray-400 sm:text-xs">
                  {" "}
                  {months[index].label}{" "}
                </span>{" "}
              </div>
            );
          })}{" "}
        </div>{" "}
      </div>
    );
  };
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        {" "}
        <div className="text-center">
          {" "}
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />{" "}
          <p className="mt-3 text-sm text-gray-500">
            {" "}
            Generating reports...{" "}
          </p>{" "}
        </div>{" "}
      </div>
    );
  }
  if (!report) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        {" "}
        <div className="text-center">
          {" "}
          <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />{" "}
          <p className="mt-3 text-gray-600"> Unable to load reports. </p>{" "}
          <button
            onClick={fetchReports}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            {" "}
            Try Again{" "}
          </button>{" "}
        </div>{" "}
      </div>
    );
  }
  const { users, jobs, applications, complaints, trends } = report;
  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {" "}
      <div className="mx-auto max-w-7xl">
        {" "}
        {/* HEADER */}{" "}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {" "}
          <div>
            {" "}
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {" "}
              Reports{" "}
            </h1>{" "}
            <p className="mt-1 text-sm text-gray-500">
              {" "}
              Overview of WorkBridge platform activity.{" "}
            </p>{" "}
          </div>{" "}
          <button
            onClick={fetchReports}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {" "}
            <RefreshCw className="h-4 w-4" /> Refresh{" "}
          </button>{" "}
        </div>{" "}
        {/* USER REPORT */}{" "}
        <section className="mb-6">
          {" "}
          <div className="mb-4 flex items-center gap-2">
            {" "}
            <Users className="h-5 w-5 text-blue-600" />{" "}
            <h2 className="text-lg font-bold text-gray-900">
              {" "}
              User Overview{" "}
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {" "}
            <StatCard
              title="Total Users"
              value={users.total}
              icon={Users}
              iconClass="text-blue-600"
              iconBg="bg-blue-100"
            />{" "}
            <StatCard
              title="Active Users"
              value={users.active}
              icon={UserCheck}
              iconClass="text-green-600"
              iconBg="bg-green-100"
            />{" "}
            <StatCard
              title="Inactive Users"
              value={users.inactive}
              icon={UserX}
              iconClass="text-red-600"
              iconBg="bg-red-100"
            />{" "}
            <StatCard
              title="Verified Users"
              value={users.verified}
              icon={ShieldCheck}
              iconClass="text-purple-600"
              iconBg="bg-purple-100"
            />{" "}
          </div>{" "}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {" "}
            {[
              ["Workers", users.workers],
              ["Employers", users.employers],
              ["Labour Officers", users.labourOfficers],
              ["Police", users.police],
              ["Insurance", users.insurance],
              ["Admins", users.admins],
              ["Unverified", users.unverified],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                {" "}
                <p className="text-xs text-gray-500"> {label} </p>{" "}
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {" "}
                  {value}{" "}
                </p>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </section>{" "}
        {/* JOBS */}{" "}
        <section className="mb-6">
          {" "}
          <div className="mb-4 flex items-center gap-2">
            {" "}
            <Briefcase className="h-5 w-5 text-indigo-600" />{" "}
            <h2 className="text-lg font-bold text-gray-900"> Jobs </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {" "}
            <StatCard
              title="Total Jobs"
              value={jobs.total}
              icon={Briefcase}
              iconClass="text-indigo-600"
              iconBg="bg-indigo-100"
            />{" "}
            <StatCard
              title="Open"
              value={jobs.open}
              icon={Activity}
              iconClass="text-green-600"
              iconBg="bg-green-100"
            />{" "}
            <StatCard
              title="Closed"
              value={jobs.closed}
              icon={XCircle}
              iconClass="text-red-600"
              iconBg="bg-red-100"
            />{" "}
            <StatCard
              title="Draft"
              value={jobs.draft}
              icon={FileText}
              iconClass="text-gray-600"
              iconBg="bg-gray-100"
            />{" "}
          </div>{" "}
        </section>{" "}
        {/* APPLICATIONS */}{" "}
        <section className="mb-6">
          {" "}
          <div className="mb-4 flex items-center gap-2">
            {" "}
            <FileText className="h-5 w-5 text-blue-600" />{" "}
            <h2 className="text-lg font-bold text-gray-900">
              {" "}
              Applications{" "}
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {" "}
            <StatCard
              title="Total"
              value={applications.total}
              icon={FileText}
              iconClass="text-blue-600"
              iconBg="bg-blue-100"
            />{" "}
            <StatCard
              title="Pending"
              value={applications.pending}
              icon={Clock}
              iconClass="text-yellow-600"
              iconBg="bg-yellow-100"
            />{" "}
            <StatCard
              title="Shortlisted"
              value={applications.shortlisted}
              icon={TrendingUp}
              iconClass="text-purple-600"
              iconBg="bg-purple-100"
            />{" "}
            <StatCard
              title="Accepted"
              value={applications.accepted}
              icon={CheckCircle}
              iconClass="text-green-600"
              iconBg="bg-green-100"
            />{" "}
            <StatCard
              title="Rejected"
              value={applications.rejected}
              icon={XCircle}
              iconClass="text-red-600"
              iconBg="bg-red-100"
            />{" "}
          </div>{" "}
        </section>{" "}
        {/* COMPLAINTS */}{" "}
        <section className="mb-8">
          {" "}
          <div className="mb-4 flex items-center gap-2">
            {" "}
            <AlertTriangle className="h-5 w-5 text-orange-600" />{" "}
            <h2 className="text-lg font-bold text-gray-900">
              {" "}
              Complaints{" "}
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {" "}
            <StatCard
              title="Total"
              value={complaints.total}
              icon={AlertTriangle}
              iconClass="text-orange-600"
              iconBg="bg-orange-100"
            />{" "}
            <StatCard
              title="Pending"
              value={complaints.pending}
              icon={Clock}
              iconClass="text-yellow-600"
              iconBg="bg-yellow-100"
            />{" "}
            <StatCard
              title="Investigating"
              value={complaints.investigating}
              icon={Activity}
              iconClass="text-blue-600"
              iconBg="bg-blue-100"
            />{" "}
            <StatCard
              title="Resolved"
              value={complaints.resolved}
              icon={CheckCircle}
              iconClass="text-green-600"
              iconBg="bg-green-100"
            />{" "}
            <StatCard
              title="Rejected"
              value={complaints.rejected}
              icon={XCircle}
              iconClass="text-red-600"
              iconBg="bg-red-100"
            />{" "}
          </div>{" "}
        </section>{" "}
        {/* TRENDS */}{" "}
        <section>
          {" "}
          <div className="mb-4 flex items-center gap-2">
            {" "}
            <TrendingUp className="h-5 w-5 text-blue-600" />{" "}
            <h2 className="text-lg font-bold text-gray-900">
              {" "}
              Monthly Trends{" "}
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {" "}
            <TrendChart
              title="User Registrations"
              data={trends.users}
              icon={Users}
              iconClass="text-blue-600"
            />{" "}
            <TrendChart
              title="Jobs Created"
              data={trends.jobs}
              icon={Briefcase}
              iconClass="text-indigo-600"
            />{" "}
            <TrendChart
              title="Applications Submitted"
              data={trends.applications}
              icon={FileText}
              iconClass="text-green-600"
            />{" "}
            <TrendChart
              title="Complaints Submitted"
              data={trends.complaints}
              icon={AlertTriangle}
              iconClass="text-orange-600"
            />{" "}
          </div>{" "}
        </section>{" "}
      </div>{" "}
    </div>
    </DashboardLayout>
  );
};
export default AdminReports;
