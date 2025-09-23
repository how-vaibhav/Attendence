import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

// Component for the animated attendance progress bar
const AttendanceProgress = ({ attended, total }) => {
  const attendancePercentage = (attended / total) * 100;
  let progressColor = "bg-green-500";
  let textColor = "text-green-500";
  if (attendancePercentage < 75) {
    progressColor = "bg-orange-500";
    textColor = "text-orange-500";
  }
  if (attendancePercentage < 50) {
    progressColor = "bg-red-500";
    textColor = "text-red-500";
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${attendancePercentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-2.5 rounded-full ${progressColor}`}
      />
    </div>
  );
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Simulate fetching data from local storage
    const studentsData =
      JSON.parse(localStorage.getItem("attend_students")) || [];
    const sessionsData =
      JSON.parse(localStorage.getItem("attend_sessions")) || [];

    const me = studentsData.find((s) => s.email === user.email);
    setStudent(me);
    setSessions(sessionsData);

    setParticles(generateParticles(50));
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || !student) {
    return null; // Or a loading spinner
  }

  const attendedSessionsCount = student.attendedSessions?.length || 0;
  const totalSessionsCount = sessions.length || 1;
  const attendancePercentage = (
    (attendedSessionsCount / totalSessionsCount) *
    100
  ).toFixed(1);

  // Framer Motion variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const mockEnrolledClasses = [
    {
      id: "cs101",
      name: "CS-101: Intro to Programming",
      teacher: "Prof. Smith",
    },
    { id: "math202", name: "MATH-202: Calculus II", teacher: "Dr. Jones" },
    { id: "eng103", name: "ENG-103: Technical Writing", teacher: "Ms. Davis" },
  ];

  return (
    <div
      className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1f2937, #374151)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-40 mix-blend-multiply pointer-events-none z-10" />
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
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Profile Card */}
          <motion.div
            className="lg:col-span-1 p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 flex flex-col items-center text-center"
            variants={cardVariants}
          >
            <div className="profile-pic-container relative w-32 h-32 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-32 w-32 text-indigo-300 dark:text-indigo-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.94 0 3.5 1.56 3.5 3.5S13.94 12 12 12s-3.5-1.56-3.5-3.5S10.06 5 12 5zm0 14.2c-2.5 0-4.71-1.29-6-3.21a5.952 5.952 0 0112 0c-1.29 1.92-3.5 3.21-6 3.21z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold mb-1">{student.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {student.email}
            </p>
            <span className="mt-2 text-sm px-4 py-1 rounded-full font-semibold bg-indigo-500/20 text-indigo-300">
              Student
            </span>
            <button
              onClick={handleLogout}
              className="mt-8 w-full py-3 px-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition transform hover:scale-[1.02]"
            >
              Logout
            </button>
          </motion.div>

          {/* Right Column: Metrics and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Summary Card */}
            <motion.div
              className="p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50"
              variants={cardVariants}
            >
              <h3 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-500">
                Attendance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Attended
                  </p>
                  <p className="text-4xl font-extrabold text-green-500">
                    {attendedSessionsCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </p>
                  <p className="text-4xl font-extrabold text-indigo-500">
                    {totalSessionsCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Percentage
                  </p>
                  <p
                    className={`text-4xl font-extrabold ${
                      attendancePercentage > 75
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  >
                    {attendancePercentage}%
                  </p>
                </div>
              </div>
              <AttendanceProgress
                attended={attendedSessionsCount}
                total={totalSessionsCount}
              />
            </motion.div>

            {/* Enrolled Classes Card */}
            <motion.div
              className="p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50"
              variants={cardVariants}
            >
              <h3 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Enrolled Classes
              </h3>
              <ul className="space-y-3">
                {mockEnrolledClasses.map((cls, index) => (
                  <motion.li
                    key={cls.id}
                    className="p-4 rounded-xl shadow-lg bg-white dark:bg-gray-700 transition-colors"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {cls.name}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {cls.teacher}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
      <style>{`
        .particle-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .particle {
          position: absolute;
          background-color: rgba(147, 197, 253, 0.4);
          border-radius: 50%;
          animation-name: floatAndFade;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
        }
        @keyframes floatAndFade {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 0.2; transform: translateY(-20%) scale(0.6); }
          50% { opacity: 0.6; transform: translateY(-50%) scale(1); }
          80% { opacity: 0.2; transform: translateY(-80%) scale(0.6); }
          100% { transform: translateY(-100%) scale(0); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 10s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
