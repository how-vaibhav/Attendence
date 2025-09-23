import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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

export default function Contact() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(generateParticles(50));
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div
      className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1f2937, #374151)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-40 mix-blend-multiply pointer-events-none z-10" />

      {/* Particle Animation Container */}
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

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-20 mt-15">
        <motion.div
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Contact Details */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
            >
              Contact Us
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
            >
              We're here to help with all your attendance and system-related
              queries. Please use the contact information below to get in touch
              with our IT department.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-indigo-600 dark:text-indigo-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <div>
                  <h4 className="font-semibold text-lg">Email Address</h4>
                  <a
                    href="mailto:it.dept@mycollege.edu"
                    className="text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    it.dept@mycollege.edu
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-indigo-600 dark:text-indigo-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </span>
                <div>
                  <h4 className="font-semibold text-lg">Phone Number</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    +91 123 456 7890
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-indigo-600 dark:text-indigo-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <div>
                  <h4 className="font-semibold text-lg">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    IT Department, Main Campus, Cityville, State, 12345
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Creative Visual */}
          <motion.div
            className="flex items-center justify-center p-6 bg-indigo-50/50 dark:bg-gray-900/50 rounded-2xl shadow-inner border border-white/20 dark:border-gray-700/50"
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 1,
                type: "spring",
                stiffness: 100,
              }}
              className="w-full h-full p-4 text-center text-gray-400"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Find Us on the Map
              </h3>
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <span className="block p-4">
                  Map Placeholder
                  <br />
                  (You can integrate a map widget here)
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
