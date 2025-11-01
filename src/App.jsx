import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./client/components/Login";
import Signup from "./client/components/Signup";
import AddSingleLogEntry from "./client/components/AddSingleLogEntry";
import CreateNlogs from "./client/components/CreateNlogs";
import LandingPage from "./client/components/landingPage";
import Navbar from "./client/components/navbar";
import { useLocation } from "react-router-dom";
import Features from "./client/components/features";
import AllLogs from "./admin/components/AllLogs";
import BlockedIps from "./admin/components/BlockedIPS";
import LogAnalysis from "./admin/components/LogAnalysis";
import AdminNavbar from "./admin/components/AdminNavbar";
import MainDashboard from "./admin/MainDashboard";

const App = () => {
  const location = useLocation();
  
  // Determine which navbar to show based on route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const publicRoutes = ['/', '/login', '/signup']; // Removed '/features' from here
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  return (
    <>
      {/* Show AdminNavbar only on admin routes */}
      {isAdminRoute && <AdminNavbar />}
      
      {/* Show client Navbar on all routes except admin and public routes */}
      {!isAdminRoute && !isPublicRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AddSingleLogEntry />} />
        <Route path='/log' element={<CreateNlogs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/features' element={<Features />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/admin" element={<MainDashboard />} />
        <Route path="/admin/all-logs" element={<AllLogs />} />
        <Route path="/admin/blocked-ips" element={<BlockedIps />} />
        <Route path="/admin/log-analysis" element={<LogAnalysis />} />
      </Routes>
    </>
  );
};

export default App;