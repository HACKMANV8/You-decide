import React, { useState, useEffect } from "react";
// MODIFIED: Added ShieldCheck for the "Blocked" button icon
import { Shield, ShieldAlert, Clock, User, Monitor, AlertTriangle, MapPin, Activity, ShieldCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to get userId from token (no changes here)
const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    return decoded.userId || decoded.id || decoded.sub || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockingId, setBlockingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // ADDED: New state to hold the set of blocked destination IPs for quick lookups
  const [blockedDestinations, setBlockedDestinations] = useState(new Set());

  useEffect(() => {
    // Get current user ID
    const userId = getUserIdFromToken();
    setCurrentUserId(userId);
    
    // MODIFIED: Fetch both logs and blocked IPs when the component mounts
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Use Promise.all to fetch both sets of data concurrently for better performance
        await Promise.all([fetchLogs(), fetchBlockedIPs()]);
      } catch (error) {
        // This catch block will handle failures from either fetch operation
        console.error("Error loading initial data:", error);
        toast.error("Failed to load all required data.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchLogs = async () => {
    // setLoading(true); // Loading is now handled in the useEffect
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5001/admin/getAllLogs", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLogs(result.data);
      } else {
        toast.error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Unable to connect to server to fetch logs");
    } 
    // finally { // Loading is now handled in the useEffect
    //   setLoading(false);
    // }
  };

  // ADDED: New function to fetch the list of blocked IPs
  const fetchBlockedIPs = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // IMPORTANT: Make sure this API endpoint exists on your server
      const response = await fetch("http://localhost:5001/admin/getAllBlockedIPS", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        // We create a Set of destination IPs for efficient O(1) lookups
        const destinationSet = new Set(result.data.map(item => item.destination));
        setBlockedDestinations(destinationSet);
      } else {
        toast.error("Failed to fetch blocked IPs list");
      }
    } catch (error) {
      console.error("Error fetching blocked IPs:", error);
      toast.error("Unable to connect to server to fetch blocked IPs");
    }
  };


  const handleBlock = async (log) => {
    if (!currentUserId) {
      toast.error("User not authenticated");
      return;
    }

    setBlockingId(log._id);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5001/admin/blockIP", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destination: log.destination,
          campLocation: log.campLocation,
          source: log.source,
          userId: currentUserId,
          timestamp: log.timestamp
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`IP ${log.destination} blocked successfully`);
        
        // MODIFIED: Update the local state instantly for a better user experience
        // This adds the newly blocked IP to our Set without needing a full refetch.
        setBlockedDestinations(prev => new Set(prev).add(log.destination));
        
        // You can keep this full refetch if you want to ensure data consistency
        // fetchLogs(); 
      } else {
        toast.error(data.message || "Failed to block IP");
      }
    } catch (error) {
      console.error("Error blocking IP:", error);
      toast.error("Unable to connect to server");
    } finally {
      setBlockingId(null);
    }
  };
  
  // No changes to helper functions below this point
  const getSeverityColor = (severity) => {
    const colors = {
      Low: "bg-green-500/20 text-green-400 border-green-500/50",
      Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      High: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      Critical: "bg-red-500/20 text-red-400 border-red-500/50",
      warning: "bg-orange-500/20 text-orange-400 border-orange-500/50"
    };
    return colors[severity] || "bg-gray-500/20 text-gray-400 border-gray-500/50";
  };
  const getRiskScoreColor = (score) => {
    if (score >= 0.7) return "text-red-400";
    if (score >= 0.4) return "text-yellow-400";
    return "text-green-400";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="text-blue-500" size={40} />
            Security Logs
          </h1>
          <p className="text-gray-400">Monitor and manage security events across your network</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <span className="text-gray-400">Total Logs: </span>
              <span className="text-white font-semibold">{logs.length}</span>
            </div>
            {/* ADDED: A stat for blocked IPs */}
            <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <span className="text-gray-400">Blocked IPs: </span>
              <span className="text-white font-semibold">{blockedDestinations.size}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><Clock size={16} />Timestamp</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><Activity size={16} />Source</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><Activity size={16} />Destination</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><Monitor size={16} />Device</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Event Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><AlertTriangle size={16} />Severity</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><div className="flex items-center gap-2"><MapPin size={16} />Location</div></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <ShieldAlert size={48} className="text-gray-600" />
                        <p className="text-gray-400 text-lg">No logs found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    // ADDED: Check if the current log's destination is in our set of blocked IPs.
                    const isBlocked = blockedDestinations.has(log.destination);

                    return (
                      <tr
                        key={log._id}
                        // MODIFIED: Conditionally apply a red background if the IP is blocked.
                        className={`transition-colors duration-150 ${
                          isBlocked 
                            ? 'bg-red-900/30 hover:bg-red-900/40' 
                            : 'hover:bg-gray-700/30'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(log.timestamp)}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><code className="text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{log.source}</code></td>
                        <td className="px-6 py-4 whitespace-nowrap"><code className="text-sm text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{log.destination}</code></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.device}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">{log.eventType}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getSeverityColor(log.eventSeverity)}`}>{log.eventSeverity}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.campLocation}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`text-sm font-bold ${getRiskScoreColor(log.mlRiskScore)}`}>{(log.mlRiskScore * 100).toFixed(0)}%</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* MODIFIED: Conditionally render either the "Block" or "Blocked" button */}
                          {isBlocked ? (
                            <button
                              disabled
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed"
                            >
                              <ShieldCheck size={16} />
                              Blocked
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(log)}
                              disabled={blockingId === log._id}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            >
                              {blockingId === log._id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Blocking...
                                </>
                              ) : (
                                <>
                                  <ShieldAlert size={16} />
                                  Block
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Event Descriptions section (no changes) */}
        {logs.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-white mb-3">Event Details</h2>
            {logs.map((log) => (
              <div key={log._id} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(log.eventSeverity)}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{log.eventDescription}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(log.timestamp)} • {log.campLocation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsTable;