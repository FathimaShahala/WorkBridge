
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


import {
  ArrowLeft,
  User,
  ShieldCheck,
  Calendar,
  FileText,
} from "lucide-react";

const InsuranceWorkerDetails = () => {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorker = async () => {
    try {
      const response = await axios.get(
        `/insurance/workers/${id}`
      );

      setWorker(response.data.worker);
      setPolicies(response.data.policies || []);
    } catch (error) {
      console.error(
        "Fetch Worker Insurance Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorker();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        Loading worker...
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-6">
        Worker not found.
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="p-4 md:p-6">
      <Link
        to="/insurance/workers"
        className="inline-flex items-center gap-2 text-blue-600 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Workers
      </Link>

      {/* Worker Card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {worker.profileImage ? (
            <img
              src={worker.profileImage}
              alt={worker.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={35} />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold">
              {worker.fullName}
            </h1>

            <p className="text-gray-500">
              {worker.email}
            </p>

            <p className="text-gray-500">
              {worker.phone}
            </p>

            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              {worker.status}
            </span>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Insurance Policies
        </h2>

        {policies.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No insurance policies found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {policies.map((policy) => (
              <div
                key={policy._id}
                className="bg-white rounded-xl shadow p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Policy Number
                    </p>

                    <h3 className="font-bold text-lg">
                      {policy.policyNumber}
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    {policy.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="flex gap-2">
                    <ShieldCheck size={18} />
                    {policy.insuranceProvider}
                  </p>

                  <p className="flex gap-2">
                    <FileText size={18} />
                    {policy.policyType}
                  </p>

                  <p>
                    Coverage: ₹
                    {Number(
                      policy.coverageAmount
                    ).toLocaleString()}
                  </p>

                  <p>
                    Premium: ₹
                    {Number(
                      policy.premiumAmount
                    ).toLocaleString()}
                  </p>

                  <p className="flex gap-2">
                    <Calendar size={18} />
                    {new Date(
                      policy.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      policy.endDate
                    ).toLocaleDateString()}
                  </p>
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

export default InsuranceWorkerDetails;
