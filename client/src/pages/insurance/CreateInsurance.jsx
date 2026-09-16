import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const CreateInsurance = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    worker: "",
    policyNumber: "",
    insuranceProvider: "",
    policyType: "",
    coverageAmount: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
    status: "active",
    notes: "",
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/users/workers");

      if (response.data.success) {
        setWorkers(response.data.workers || []);
      }
    } catch (error) {
      console.error("Fetch Workers Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load workers."
      );
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.worker ||
      !formData.policyNumber ||
      !formData.insuranceProvider ||
      !formData.policyType ||
      !formData.coverageAmount ||
      !formData.premiumAmount ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      toast.error(
        "End date cannot be before start date."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/insurance",
        {
          ...formData,
          coverageAmount: Number(
            formData.coverageAmount
          ),
          premiumAmount: Number(
            formData.premiumAmount
          ),
        }
      );

      if (response.data.success) {
        toast.success(
          "Insurance policy created successfully."
        );

        navigate("/insurance/policies");
      }
    } catch (error) {
      console.error("Create Insurance Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create insurance policy."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-4xl">
        <Link
          to="/insurance/policies"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Policies
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add Insurance Policy
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create a new insurance policy for a worker.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Worker */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Worker Information
            </h2>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Worker <span className="text-red-500">*</span>
            </label>

            <select
              name="worker"
              value={formData.worker}
              onChange={handleChange}
              disabled={loadingWorkers}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {loadingWorkers
                  ? "Loading workers..."
                  : "Select a worker"}
              </option>

              {workers.map((worker) => (
                <option
                  key={worker._id || worker.id}
                  value={worker._id || worker.id}
                >
                  {worker.fullName} — {worker.email}
                </option>
              ))}
            </select>
          </div>

          {/* Policy Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Policy Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Policy Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Policy Number{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  placeholder="e.g. WB-INS-1001"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Provider */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Insurance Provider{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  placeholder="e.g. ABC Insurance"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Policy Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Policy Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select policy type
                  </option>

                  <option value="Health Insurance">
                    Health Insurance
                  </option>

                  <option value="Accident Insurance">
                    Accident Insurance
                  </option>

                  <option value="Life Insurance">
                    Life Insurance
                  </option>

                  <option value="Travel Insurance">
                    Travel Insurance
                  </option>

                  <option value="Worker Compensation">
                    Worker Compensation
                  </option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Financial Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Coverage */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Coverage Amount{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="coverageAmount"
                  value={formData.coverageAmount}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 500000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Premium */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Premium Amount{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="premiumAmount"
                  value={formData.premiumAmount}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 12000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Policy Period
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Start Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional information..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Link
              to="/insurance/policies"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Creating..."
                : "Create Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInsurance;