import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import img from "../../assets/loginImg.jpg";

const Signup = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 16 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.25 }
    })
  };

  const mediaVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        
        // Store user data if provided
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Unable to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-black p-0 font-sans"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
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
      <div className="w-full min-h-screen mx-0 bg-gradient-to-br from-slate-900 to-black flex flex-col lg:flex-row">
        <motion.div
          className="lg:w-1/2 w-full mx-auto flex flex-col justify-center items-center px-6 py-10 md:py-16"
          variants={containerVariants}
        >
          <motion.div className="flex flex-col items-start justify-start text-start w-full max-w-md" variants={itemVariants} custom={0}>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Create your account</h2>
            <p className="text-blue-300 mt-1">Join us to start analyzing logs securely</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col justify-center mt-6"
            initial="initial"
            animate="animate"
          >
            <motion.div variants={itemVariants} custom={1}>
              <label className="block text-sm font-medium text-blue-200">
                Name
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-800/50 border border-blue-700/50 rounded-lg px-3.5 py-2.5 text-white shadow-sm outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 placeholder-slate-500"
                placeholder="Enter your name"
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>

            <motion.div className="mt-4" variants={itemVariants} custom={2}>
              <label className="block text-sm font-medium text-blue-200">
                Email
              </label>
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-800/50 border border-blue-700/50 rounded-lg px-3.5 py-2.5 text-white shadow-sm outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 placeholder-slate-500"
                placeholder="Enter email address"
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>

            <motion.div className="mt-4" variants={itemVariants} custom={3}>
              <label className="block text-sm font-medium text-blue-200">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800/50 border border-blue-700/50 rounded-lg px-3.5 py-2.5 pr-10 text-white shadow-sm outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 placeholder-slate-500"
                  placeholder="Enter password"
                  disabled={isLoading}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 mt-1 mr-2.5 px-2 text-blue-400 hover:text-blue-300 text-sm"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </motion.div>

            <motion.div className="mt-4" variants={itemVariants} custom={4}>
              <label className="block text-sm font-medium text-blue-200">
                Confirm Password
              </label>
              <div className="relative">
                <motion.input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800/50 border border-blue-700/50 rounded-lg px-3.5 py-2.5 pr-10 text-white shadow-sm outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 placeholder-slate-500"
                  placeholder="Confirm password"
                  disabled={isLoading}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 mt-1 mr-2.5 px-2 text-blue-400 hover:text-blue-300 text-sm"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer mt-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ y: -1, boxShadow: "0 10px 28px rgba(59,130,246,0.4)" }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              custom={5}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </motion.button>

            <motion.p className="text-sm mt-4 text-center text-blue-300" variants={itemVariants} custom={6}>
              Already have an account?{" "}
              <Link to="/login" className="hover:underline text-blue-400 font-medium">
                Login Now!
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>

        <motion.div
          className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-blue-950 via-slate-900 to-black p-8 relative min-h-screen"
          variants={mediaVariants}
        >
          <motion.img
            src={img}
            alt="hero image"
            initial={{ y: 10, opacity: 0.9 }}
            animate={{ y: [10, -6, 10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="rounded-lg opacity-80"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup;