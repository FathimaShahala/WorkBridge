
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

const InsuranceClaimDetails = () => {
  const { id } = useParams();

  const [claim, setClaim] = useState(null);
  const [status, setStatus] = useState("");
  const [approvedAmount, setApprovedAmount] =
    useState("");
  const [officerNotes, setOfficerNotes] =
    useState("");

  const fetchClaim = async () => {
    try {
      const response = await axios.get(
        `/insurance/claims/${id}`
      );

      const data = response.data.claim;

      setClaim(data);
      setStatus(data.status);
      setApprovedAmount(
        data.approvedAmount || ""
      );
      setOfficerNotes(
        data.officerNotes || ""
      );
    } catch (error) {
      console.error(
        "Fetch Claim Error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const updateClaim = async () => {
    try {
      await axios.put(
        `/insurance/claims/${id}`,
        {
          status,
          approvedAmount:
            Number(approvedAmount) || 0,
          officerNotes,
        }
      );

      toast.success(
        "Claim updated successfully."
      );

      fetchClaim();
    } catch (error) {
      console.error(
        "Update Claim Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update claim."
      );
    }
  };

  if (!claim) {
    return (
      <div className="p-6">
        Loading claim...
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="p-4 md:p-6">
      <Link
        to="/insurance/claims"
        className="inline-flex items-center gap-2 text-blue-600 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Claims
      </Link>

      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Claim Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-gray-500">
              Claim Number
            </p>

            <p className="font-semibold">
              {claim.claimNumber}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Worker
            </p>

            <p className="font-semibold">
              {claim.worker?.fullName}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Policy Number
            </p>

            <p className="font-semibold">
              {claim.insurance?.policyNumber}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Claim Type
            </p>

            <p className="font-semibold">
              {claim.claimType}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Claim Amount
            </p>

            <p className="font-semibold">
              ₹
              {Number(
                claim.claimAmount
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Incident Date
            </p>

            <p className="font-semibold">
              {new Date(
                claim.incidentDate
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 mb-2">
            Description
          </p>

          <p className="bg-gray-50 p-4 rounded-lg">
            {claim.description}
          </p>
        </div>

        <hr className="my-6" />

        {/* Update */}
        <h2 className="text-lg font-semibold mb-4">
          Review Claim
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            >
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

          <div>
            <label className="block mb-2 font-medium">
              Approved Amount
            </label>

            <input
              type="number"
              value={approvedAmount}
              onChange={(e) =>
                setApprovedAmount(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Officer Notes
            </label>

            <textarea
              rows="4"
              value={officerNotes}
              onChange={(e) =>
                setOfficerNotes(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
              placeholder="Add review notes..."
            />
          </div>

          <button
            onClick={updateClaim}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Claim
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default InsuranceClaimDetails;
