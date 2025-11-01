import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, TrendingUp, AlertTriangle, Activity, MapPin, Clock } from 'lucide-react';

const LogAnalysis = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5001/admin/getAllLogs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLogs(result.data);
        setError(null);
      } else {
        setError('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Data processing functions
  const getSeverityData = () => {
    const severityCounts = logs.reduce((acc, log) => {
      acc[log.eventSeverity] = (acc[log.eventSeverity] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(severityCounts).map(([name, value]) => ({
      name,
      value,
      color: getSeverityColor(name)
    }));
  };

  const getEventTypeData = () => {
    const eventCounts = logs.reduce((acc, log) => {
      acc[log.eventType] = (acc[log.eventType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(eventCounts).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  };

  const getLocationData = () => {
    const locationCounts = logs.reduce((acc, log) => {
      acc[log.campLocation] = (acc[log.campLocation] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(locationCounts).map(([name, count]) => ({
      name,
      count
    }));
  };

  const getRiskScoreDistribution = () => {
    const ranges = {
      'Low (0-40%)': 0,
      'Medium (40-70%)': 0,
      'High (70-100%)': 0
    };

    logs.forEach(log => {
      const score = log.mlRiskScore * 100;
      if (score < 40) ranges['Low (0-40%)']++;
      else if (score < 70) ranges['Medium (40-70%)']++;
      else ranges['High (70-100%)']++;
    });

    return Object.entries(ranges).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getTimelineData = () => {
    const timelineCounts = logs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(timelineCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days
  };

  const getTopDestinations = () => {
    const destCounts = logs.reduce((acc, log) => {
      acc[log.destination] = (acc[log.destination] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(destCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: '#10b981',
      Medium: '#f59e0b',
      High: '#f97316',
      Critical: '#ef4444',
      warning: '#f97316'
    };
    return colors[severity] || '#6b7280';
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const severityData = getSeverityData();
  const eventTypeData = getEventTypeData();
  const locationData = getLocationData();
  const riskDistribution = getRiskScoreDistribution();
  const timelineData = getTimelineData();
  const topDestinations = getTopDestinations();

  return (
    <div className="min-h-screen bg-gradient-to-br  p-6">
      {error && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={24} />
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchLogs}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-blue-500" size={40} />
            Security Log Analysis
          </h1>
          <p className="text-gray-400">Visual insights into your security events</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-blue-500" size={24} />
              <span className="text-gray-400 text-sm">Total Events</span>
            </div>
            <p className="text-3xl font-bold text-white">{logs.length}</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-500" size={24} />
              <span className="text-gray-400 text-sm">Critical Events</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {logs.filter(l => l.eventSeverity === 'Critical').length}
            </p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-green-500" size={24} />
              <span className="text-gray-400 text-sm">Locations</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {new Set(logs.map(l => l.campLocation)).size}
            </p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-purple-500" size={24} />
              <span className="text-gray-400 text-sm">Avg Risk Score</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {logs.length > 0 ? ((logs.reduce((sum, l) => sum + l.mlRiskScore, 0) / logs.length) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Severity Distribution */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              Severity Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Event Types */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              Event Types
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Timeline */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-purple-500" />
              Events Timeline (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Score Distribution */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={20} className="text-green-500" />
              Risk Score Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Stats & Top Destinations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Locations */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-green-500" />
              Events by Location
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Destinations */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top 10 Destination IPs</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {topDestinations.map((dest, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <code className="text-sm text-purple-400">{dest.ip}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(dest.count / topDestinations[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold text-sm w-8 text-right">{dest.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogAnalysis;