import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldOff, Clock, User, MapPin } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlockedIPsTable = () => {
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState(null); // Tracks which IP is being unblocked

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  // Fetches the list of all blocked IPs from your new API endpoint
  const fetchBlockedIPs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      // IMPORTANT: Ensure this API endpoint exists on your server
      const response = await fetch("http://localhost:5001/admin/getAllBlockedIPS", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setBlockedIPs(result.data);
      } else {
        toast.error(result.message || "Failed to fetch blocked IPs");
      }
    } catch (error) {
      console.error("Error fetching blocked IPs:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Handles the unblocking action
  const handleUnblock = async (blockedIp) => {
    setUnblockingId(blockedIp._id);
    try {
      const token = localStorage.getItem("authToken");
      // IMPORTANT: Create this API endpoint on your server
      const response = await fetch("http://localhost:5001/admin/unblockIP", {
        method: "POST", // Or DELETE, depending on your API design
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send the unique identifier for the blocked IP entry
          blockId: blockedIp._id, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`IP ${blockedIp.destination} unblocked successfully`);
        // Update the UI instantly by filtering out the unblocked IP
        setBlockedIPs((prevIPs) =>
          prevIPs.filter((ip) => ip._id !== blockedIp._id)
        );
      } else {
        toast.error(data.message || "Failed to unblock IP");
      }
    } catch (error) {
      console.error("Error unblocking IP:", error);
      toast.error("Unable to connect to server");
    } finally {
      setUnblockingId(null);
    }
  };

  // Helper function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading Blocked IPs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-red-500" size={40} />
            Blocked IP Addresses
          </h1>
          <p className="text-gray-400">
            Manage and unblock IP addresses that have been blocked across the network.
          </p>
          <div className="mt-4">
            <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 inline-block">
              <span className="text-gray-400">Total Blocked IPs: </span>
              <span className="text-white font-semibold">{blockedIPs.length}</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Blocked IP</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><MapPin size={16} /> Location</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><User size={16} /> Blocked By</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><Clock size={16} /> Blocked At</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {blockedIPs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <ShieldCheck size={48} className="text-gray-600" />
                        <p className="text-gray-400 text-lg">No IPs are currently blocked.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blockedIPs.map((ip) => (
                    <tr key={ip._id} className="hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-red-400 bg-red-500/10 px-2 py-1 rounded">{ip.destination}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ip.campLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {/* Assumes your API returns a `blockedBy` field with user info */}
                        {ip.blockedBy?.name || 'Admin'} 
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(ip.timestamp)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleUnblock(ip)}
                          disabled={unblockingId === ip._id}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                          {unblockingId === ip._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Unblocking...
                            </>
                          ) : (
                            <>
                              <ShieldOff size={16} />
                              Unblock
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedIPsTable;