
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


import {
  Search,
  Users,
  ShieldCheck,
  Eye,
  X,
} from "lucide-react";

const InsuranceWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/insurance/workers"
      );

      setWorkers(response.data.workers || []);
    } catch (error) {
      console.error(
        "Fetch Insurance Workers Error:",
        error
      );

      setError(
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

  // Search workers
  const filteredWorkers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return workers;
    }

    return workers.filter((worker) => {
      const name =
        worker.fullName?.toLowerCase() || "";

      const email =
        worker.email?.toLowerCase() || "";

      const phone =
        worker.phone?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)
      );
    });
  }, [workers, search]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <DashboardLayout>
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Insured Workers
        </h1>

        <p className="text-gray-500 mt-1">
          View workers and their insurance policies
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-xl">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {search && (
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredWorkers.length} of{" "}
            {workers.length} workers
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          Loading workers...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-5">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredWorkers.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <Users
              size={40}
              className="mx-auto mb-3 text-gray-400"
            />

            <h3 className="font-semibold text-lg">
              {search
                ? "No matching workers"
                : "No workers found"}
            </h3>

            <p className="text-gray-500 mt-1">
              {search
                ? "Try a different name, email or phone number."
                : "There are no workers available."}
            </p>
          </div>
        )}

      {/* Workers Table */}
      {!loading &&
        !error &&
        filteredWorkers.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">
                    Worker
                  </th>

                  <th className="text-left p-4">
                    Phone
                  </th>

                  <th className="text-left p-4">
                    Policies
                  </th>

                  <th className="text-left p-4">
                    Active Policies
                  </th>

                  <th className="text-right p-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredWorkers.map((worker) => (
                  <tr
                    key={worker._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {worker.profileImage ? (
                          <img
                            src={worker.profileImage}
                            alt={worker.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users size={18} />
                          </div>
                        )}

                        <div>
                          <p className="font-medium">
                            {worker.fullName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {worker.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {worker.phone || "-"}
                    </td>

                    <td className="p-4 font-medium">
                      {worker.policyCount || 0}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck
                          size={16}
                          className="text-green-600"
                        />

                        {worker.activePolicies || 0}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        to={`/insurance/workers/${worker._id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
    </DashboardLayout>
  );
};

export default InsuranceWorkers;
