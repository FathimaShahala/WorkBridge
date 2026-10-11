

import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const PoliceWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [verificationFilter, setVerificationFilter] =
    useState("all");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/police/workers"
      );

      if (response.data.success) {
        setWorkers(response.data.workers);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load workers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filteredWorkers =
    workers.filter((worker) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        worker.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        worker.email
          ?.toLowerCase()
          .includes(searchText) ||
        worker.phone
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        worker.status === statusFilter;

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" &&
          worker.isVerified) ||
        (verificationFilter ===
          "unverified" &&
          !worker.isVerified);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification
      );
    });

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Police Workers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and monitor registered workers.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

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
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">
                All Status
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) =>
                setVerificationFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">
                All Verification
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

        {/* Worker count */}
        <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <Users size={18} />

          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredWorkers.length}
          </span>{" "}
          workers
        </div>

        {/* Workers */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-gray-200"
                />
              )
            )}
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">
            No workers found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredWorkers.map(
              (worker) => (
                <div
                  key={worker._id}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
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

                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-gray-900">
                        {worker.fullName}
                      </h2>

                      <p className="truncate text-sm text-gray-500">
                        {worker.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      {worker.phone}
                    </div>

                    <div className="flex items-center gap-2">
                      {worker.isVerified ? (
                        <>
                          <ShieldCheck
                            size={17}
                            className="text-green-600"
                          />

                          <span className="text-green-600">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert
                            size={17}
                            className="text-yellow-600"
                          />

                          <span className="text-yellow-600">
                            Unverified
                          </span>
                        </>
                      )}
                    </div>

                  </div>

                  <div className="mt-5 flex items-center justify-between">

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        worker.status ===
                        "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {worker.status}
                    </span>

                    <button
                      onClick={() =>
                        setSelectedWorker(
                          worker
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View Details
                    </button>

                  </div>
                </div>
              )
            )}

          </div>
        )}

        {/* Details modal */}
        {selectedWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6">

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  Worker Details
                </h2>

                <button
                  onClick={() =>
                    setSelectedWorker(
                      null
                    )
                  }
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="flex flex-col items-center">

                {selectedWorker.profileImage ? (
                  <img
                    src={`http://localhost:5000${selectedWorker.profileImage}`}
                    alt={selectedWorker.fullName}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600">
                    {selectedWorker.fullName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <h3 className="mt-4 text-xl font-bold">
                  {selectedWorker.fullName}
                </h3>

                <p className="text-sm text-gray-500">
                  Worker
                </p>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex gap-3">
                  <Mail size={18} />
                  <span>
                    {selectedWorker.email}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Phone size={18} />
                  <span>
                    {selectedWorker.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Status</span>

                  <span className="font-medium capitalize">
                    {selectedWorker.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Verification</span>

                  <span
                    className={
                      selectedWorker.isVerified
                        ? "font-medium text-green-600"
                        : "font-medium text-yellow-600"
                    }
                  >
                    {selectedWorker.isVerified
                      ? "Verified"
                      : "Unverified"}
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default PoliceWorkers;


