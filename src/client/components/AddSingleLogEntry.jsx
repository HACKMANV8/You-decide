import React, { useState, useEffect } from "react";
import { Dices, Check, ShieldCheck, ShieldAlert, ClipboardList } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data for demo
const mockData = {
  safe_ips: ["192.168.1.1", "10.0.0.1", "172.16.0.1"],
  safe_destination_ips: ["192.168.1.254", "10.0.0.254", "172.16.0.254"],
  users: ["admin", "user1", "user2", "guest"],
  device: ["Laptop-001", "Desktop-002", "Server-003", "Mobile-004"],
  event_types: ["Login", "Logout", "File Access", "Network Connection", "Security Alert"],
  event_description_templates: {
    "Login": "User {user} logged in from {source}",
    "Logout": "User {user} logged out from {device}",
    "File Access": "User {user} accessed file from {device}",
    "Network Connection": "Connection from {source} to {destination}",
    "Security Alert": "Security event detected on {device}"
  },
  event_severity: ["Low", "Medium", "High", "Critical"],
  campLocation: ["Camp Alpha", "Camp Beta", "Camp Gamma", "Camp Delta"]
};

const randomElementFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomIP = () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

const replaceVariable = (template, data) => {
  return template.replace(/{(\w+)}/g, (match, key) => data[key] || match);
};


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

const initialLogData = {
  timestamp: "",
  source: "",
  destination: "",
  user: "",
  device: "",
  eventType: "",
  eventDescription: "",
  eventSeverity: "",
  campLocation: "",
};

export default function Inputs() {
  const [logData, setlogData] = useState(initialLogData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {

    const id = getUserIdFromToken();
    if (id) {
      setUserId(id);
    } else {
      toast.error("Unable to retrieve user information. Please login again.");
    }
  }, []);

  const handleSubmit = async () => {

    if (!userId) {
      toast.error("User not authenticated. Please login again.");
      return;
    }

    if (!logData.timestamp || !logData.source || !logData.destination || 
        !logData.user || !logData.device || !logData.eventType || 
        !logData.eventSeverity || !logData.campLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const token = localStorage.getItem("authToken");
      console.log("logdata",logData);
      console.log("token",token);
      console.log("user id",userId);

      const response = await fetch("http://localhost:5001/client/addLog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...logData,
          userId: userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Log entry added successfully!");
        setlogData(initialLogData);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        toast.error(data.message || "Failed to add log entry");
      }
    } catch (error) {
      console.error("Failed to add log entry:", error);
      toast.error("Unable to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, value, onChange, type = "text", readOnly = false, placeholder = "", endButtons = null }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {endButtons && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            {endButtons}
          </div>
        )}
      </div>
    </div>
  );

  const SelectField = ({ label, value, onChange, options, placeholder = "Select an option" }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
      >
        <option value="" className="bg-gray-800">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-gray-800">
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const IconButton = ({ color, onClick, tooltip, icon: Icon }) => (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-md transition-all hover:scale-110 ${
        color === "success" 
          ? "bg-green-600 hover:bg-green-700" 
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      <Icon size={16} className="text-white" />
    </button>
  );

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="w-full max-w-6xl bg-gray-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-800">

        <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-900 via-blue-950 to-gray-950 p-10 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="bg-blue-500 bg-opacity-30 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <ClipboardList size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Log Generator</h2>
            <p className="text-blue-100 mb-8 leading-relaxed text-lg">
              Create, customize, and submit detailed log entries directly to your database with ease.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-blue-500 bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={24} className="text-green-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Safe IPs</h4>
                  <p className="text-sm text-blue-100">Generate trusted IP addresses from your whitelist</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-blue-500 bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <ShieldAlert size={24} className="text-red-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Unsafe IPs</h4>
                  <p className="text-sm text-blue-100">Generate random IP addresses for testing</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-blue-500 bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <Dices size={24} className="text-yellow-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Customizable</h4>
                  <p className="text-sm text-blue-100">Full control over all log data fields</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 p-8 lg:p-12 text-white overflow-y-auto">
          <div className="mb-8">
           <h1 className="text-4xl font-black mb-4 uppercase tracking-wide text-blue-400 
  drop-shadow-[0_0_10px_rgba(96,165,250,0.7)] 
  hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.9)] transition-all duration-300">
  LOG ENTRY APPLICATION
</h1>

            <p className="text-gray-400">
              Fill in the fields below to generate and submit a new log entry to your system.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

          {/* Form Grid */}
          <div className="space-y-6">
            {/* Timestamp - Full Width */}
            <InputField
              label="Timestamp"
              type="datetime-local"
              value={logData.timestamp}
              onChange={(e) => setlogData(prev => ({ ...prev, timestamp: e.target.value }))}
            />

            {/* Source and Destination IPs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Source IP Address"
                value={logData.source}
                readOnly
                placeholder="Click dice to generate"
                endButtons={
                  <>
                    <IconButton
                      color="success"
                      tooltip="Random Safe IP"
                      icon={Dices}
                      onClick={() => setlogData(prev => ({
                        ...prev,
                        source: randomElementFromArray(mockData.safe_ips)
                      }))}
                    />
                    <IconButton
                      color="danger"
                      tooltip="Random Unsafe IP"
                      icon={Dices}
                      onClick={() => setlogData(prev => ({
                        ...prev,
                        source: randomIP()
                      }))}
                    />
                  </>
                }
              />

              <InputField
                label="Destination IP Address"
                value={logData.destination}
                readOnly
                placeholder="Click dice to generate"
                endButtons={
                  <>
                    <IconButton
                      color="success"
                      tooltip="Random Safe IP"
                      icon={Dices}
                      onClick={() => setlogData(prev => ({
                        ...prev,
                        destination: randomElementFromArray(mockData.safe_destination_ips)
                      }))}
                    />
                    <IconButton
                      color="danger"
                      tooltip="Random Unsafe IP"
                      icon={Dices}
                      onClick={() => setlogData(prev => ({
                        ...prev,
                        destination: randomIP()
                      }))}
                    />
                  </>
                }
              />
            </div>

            {/* User and Device */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="User"
                value={logData.user}
                onChange={(e) => setlogData(prev => ({ ...prev, user: e.target.value }))}
                options={mockData.users}
                placeholder="Select a user"
              />

              <SelectField
                label="Device"
                value={logData.device}
                onChange={(e) => setlogData(prev => ({ ...prev, device: e.target.value }))}
                options={mockData.device}
                placeholder="Select a device"
              />
            </div>

            {/* Event Type - Full Width */}
            <SelectField
              label="Event Type"
              value={logData.eventType}
              onChange={(e) => {
                const newType = e.target.value;
                setlogData(prev => {
                  const newState = { ...prev, eventType: newType };
                  const newDescription = replaceVariable(
                    mockData.event_description_templates[newType] || "",
                    newState
                  );
                  return { ...newState, eventDescription: newDescription };
                });
              }}
              options={mockData.event_types}
              placeholder="Select event type"
            />

            {/* Event Description - Full Width */}
            <InputField
              label="Event Description"
              value={logData.eventDescription}
              readOnly
              placeholder="Auto-generated based on Event Type"
            />

            {/* Severity and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Event Severity"
                value={logData.eventSeverity}
                onChange={(e) => setlogData(prev => ({ ...prev, eventSeverity: e.target.value }))}
                options={mockData.event_severity}
                placeholder="Select severity level"
              />

              <SelectField
                label="Camp Location"
                value={logData.campLocation}
                onChange={(e) => setlogData(prev => ({ ...prev, campLocation: e.target.value }))}
                options={mockData.campLocation}
                placeholder="Select camp location"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-10 pt-6 border-t border-gray-800">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
              } ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : isSuccess ? (
                <>
                  <Check size={20} />
                  Success!
                </>
              ) : (
                "Add Log Entry"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}