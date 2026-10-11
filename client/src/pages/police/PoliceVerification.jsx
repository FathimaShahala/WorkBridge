

import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const PoliceVerification = () => {
  const [workers, setWorkers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/police/verification"
      );

      if (response.data.success) {
        setWorkers(
          response.data.workers
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load verification."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleVerification = async (
    workerId,
    value
  ) => {
    try {
      setUpdating(workerId);

      const response =
        await axios.put(
          `/police/verification/${workerId}`,
          {
            isVerified: value,
          }
        );

      if (response.data.success) {
        toast.success(
          response.data.message
        );

        setWorkers((prev) =>
          prev.map((worker) =>
            worker._id === workerId
              ? {
                  ...worker,
                  isVerified: value,
                }
              : worker
          )
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update verification."
      );
    } finally {
      setUpdating(null);
    }
  };

  const filteredWorkers =
    workers.filter((worker) => {
      const text =
        search.toLowerCase();

      const matchesSearch =
        worker.fullName
          ?.toLowerCase()
          .includes(text) ||
        worker.email
          ?.toLowerCase()
          .includes(text) ||
        worker.phone
          ?.toLowerCase()
          .includes(text);

      const matchesFilter =
        filter === "all" ||
        (filter === "verified" &&
          worker.isVerified) ||
        (filter === "unverified" &&
          !worker.isVerified);

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  const verifiedCount =
    workers.filter(
      (worker) => worker.isVerified
    ).length;

  const unverifiedCount =
    workers.filter(
      (worker) => !worker.isVerified
    ).length;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Police Verification
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Verify worker identity and registration status.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck
                className="text-green-600"
                size={24}
              />

              <div>
                <p className="text-sm text-gray-500">
                  Verified
                </p>

                <p className="text-2xl font-bold">
                  {verifiedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldAlert
                className="text-yellow-600"
                size={24}
              />

              <div>
                <p className="text-sm text-gray-500">
                  Unverified
                </p>

                <p className="text-2xl font-bold">
                  {unverifiedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle
                className="text-blue-600"
                size={24}
              />

              <div>
                <p className="text-sm text-gray-500">
                  Total Workers
                </p>

                <p className="text-2xl font-bold">
                  {workers.length}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search worker..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none"
              />
            </div>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="all">
                All Workers
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="unverified">
                Unverified
              </option>
            </select>

          </div>
        </div>

        {/* Workers */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            Loading verification records...
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            No workers found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredWorkers.map(
              (worker) => (
                <div
                  key={worker._id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >

                  <div className="flex items-center gap-4">

                    {worker.profileImage ? (
                      <img
                        src={`http://localhost:5000${worker.profileImage}`}
                        alt={worker.fullName}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                        {worker.fullName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h2 className="font-semibold">
                        {worker.fullName}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {worker.email}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex items-center gap-2">

                    {worker.isVerified ? (
                      <>
                        <ShieldCheck
                          size={18}
                          className="text-green-600"
                        />

                        <span className="font-medium text-green-600">
                          Verified Worker
                        </span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert
                          size={18}
                          className="text-yellow-600"
                        />

                        <span className="font-medium text-yellow-600">
                          Verification Pending
                        </span>
                      </>
                    )}

                  </div>

                  <div className="mt-5 flex gap-3">

                    {!worker.isVerified ? (
                      <button
                        disabled={
                          updating ===
                          worker._id
                        }
                        onClick={() =>
                          handleVerification(
                            worker._id,
                            true
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle
                          size={17}
                        />

                        Verify
                      </button>
                    ) : (
                      <button
                        disabled={
                          updating ===
                          worker._id
                        }
                        onClick={() =>
                          handleVerification(
                            worker._id,
                            false
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        <XCircle
                          size={17}
                        />

                        Remove Verification
                      </button>
                    )}

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default PoliceVerification;
