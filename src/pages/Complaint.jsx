import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Function to generate random particles for background
const generateParticles = (count) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      size: Math.random() * 20 + 10,
      left: Math.random() * 100 + "%",
      animationDuration: Math.random() * 10 + 15 + "s",
      animationDelay: Math.random() * 10 + "s",
    });
  }
  return particles;
};

// Mock data for classes to make the dropdown functional
const mockClasses = [
  { id: "cs101", name: "CS-101: Introduction to Programming" },
  { id: "math202", name: "MATH-202: Calculus II" },
  { id: "eng103", name: "ENG-103: Technical Writing" },
  { id: "phy304", name: "PHY-304: Quantum Mechanics" },
];

export default function Complaint() {
  const [subject, setSubject] = useState("");
  const [classId, setClassId] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [particles, setParticles] = useState(generateParticles(50));

  useEffect(() => {
    setParticles(generateParticles(50));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real app, you would send this data to a server
      console.log({ subject, classId, details });
      setStatus("success");
      setSubject("");
      setClassId("");
      setDetails("");
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion variants for the form card's entry animation
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden "
      style={{
        background: "linear-gradient(135deg, #1f2937, #374151)",
      }}
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-40 mix-blend-multiply pointer-events-none z-10" />

      {/* --- PARTICLE ANIMATION CONTAINER --- */}
      <div className="particle-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-20 mt-20">
        <motion.div
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Complaint Form */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Submit a Complaint
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please provide the details of your issue. An administrator will
              review it and get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Attendance Discrepancy"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 dark:bg-gray-700 transition"
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class/Session
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 dark:bg-gray-700 transition"
                  required
                >
                  <option value="">Select a class...</option>
                  {mockClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complaint Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide as much detail as possible (e.g., date, time, reason)"
                  rows="4"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 dark:bg-gray-700 transition"
                  required
                />
              </motion.div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </motion.button>
            </form>
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-md text-sm text-center ${
                    status === "success"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {status === "success"
                    ? "✅ Your complaint has been submitted successfully."
                    : "❌ There was an error submitting your complaint. Please try again."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Creative Visual */}
          <motion.div className="flex flex-col items-center justify-center p-6 bg-indigo-50/50 dark:bg-gray-900/50 rounded-2xl shadow-inner border border-white/20 dark:border-gray-700/50">
            <h3 className="text-xl md:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
              How It Works
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Your feedback is important. Our system ensures your issues are
              tracked and addressed.
            </p>
            <motion.div
              className="w-2/3 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400 shadow-xl"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 5 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="block p-4">
                Your complaint is logged and timestamped for review.
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
      <style>{`
        /* Existing Animations */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 10s infinite ease-in-out; }
        .particle-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          background-color: rgba(147, 197, 253, 0.4);
          border-radius: 50%;
          animation: floatAndFade infinite ease-in-out both;
        }
        @keyframes floatAndFade {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 0.2; transform: translateY(-20%) scale(0.6); }
          50% { opacity: 0.6; transform: translateY(-50%) scale(1); }
          80% { opacity: 0.2; transform: translateY(-80%) scale(0.6); }
          100% { transform: translateY(-100%) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
