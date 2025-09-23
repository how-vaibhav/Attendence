import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Your data for features and testimonials  " random generate kiye he so ek bar go through karan he "
const features = [
  {
    title: "QR Code Attendance",
    description:
      "Students mark attendance by scanning a unique QR code generated for each class.",
    longDescription:
      "Our system generates a unique QR code for each class session. Students simply scan the code with their mobile app, and their attendance is instantly and securely recorded. This eliminates manual roll calls and reduces human error.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="11" y="11" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    colors: "from-blue-400 to-indigo-500",
  },
  {
    title: "Student Analytics",
    description:
      "Real-time insight into attendance trends so faculty can intervene early.",
    longDescription:
      "Faculty and administrators get access to a powerful analytics dashboard. Visualize attendance trends, identify at-risk students, and track engagement across different classes and semesters. This data-driven approach helps improve student retention and performance.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3v18h18"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 13v5M12 8v10M17 3v15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    colors: "from-teal-400 to-green-500",
  },
  {
    title: "Complaint Management",
    description:
      "Students can file complaints (date/time/class) and admins respond centrally.",
    longDescription:
      "Our integrated complaint system allows students to submit issues regarding attendance discrepancies, technical problems, or other academic concerns. Administrators can track, manage, and resolve these complaints efficiently, creating a clear and traceable communication channel.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2v4M20 8v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12h8M8 16h5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    colors: "from-purple-400 to-pink-500",
  },
  {
    title: "Real-time Notifications",
    description:
      "Get instant alerts for attendance status, new classes, or important announcements.",
    longDescription:
      "Receive immediate notifications about successful attendance marking, class schedule changes, or new announcements from faculty. Our system ensures you are always up-to-date, so you never miss a beat.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.73 21a2 2 0 01-3.46 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    colors: "from-yellow-400 to-orange-500",
  },
  {
    title: "Performance Insights",
    description:
      "Visualize your attendance and engagement trends to improve your academic journey.",
    longDescription:
      "Students get a personal dashboard with charts and graphs showing their attendance and performance history. This helps you track your progress, identify areas for improvement, and stay on top of your studies.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20V10M18 20V4M6 20v-6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    colors: "from-red-400 to-rose-500",
  },
  {
    title: "Data Security",
    description:
      "Your personal data is encrypted and securely stored, ensuring complete privacy.",
    longDescription:
      "We prioritize the security and privacy of your data. All information is encrypted both in transit and at rest, and we follow industry best practices to ensure your personal and academic data is safe from unauthorized access.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 11c-2.761 0-5 2.239-5 5v5h10v-5c0-2.761-2.239-5-5-5z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 11c-2.761 0-5-5-5-5s2.239-5 5-5s5 5 5 5-2.239 5-5 5z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    colors: "from-cyan-400 to-sky-500",
  },
];

const testimonials = [
  {
    name: "Prof. Rekha",
    role: "HOD, CS",
    text: "Tally reduced my manual attendance time by 80% — love the analytics.",
  },
  {
    name: "Amit K",
    role: "Student",
    text: "Quick QR scans and instant records — no more proxy hassle.",
  },
  {
    name: "Ms. Sharma",
    role: "Admin",
    text: "Complaint workflow made resolving issues fast and traceable.",
  },
];

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

// Component for the feature detail modal
const FeatureDetailModal = ({ feature, onClose }) => {
  if (!feature) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative border border-gray-200/50 dark:border-gray-700/50"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br ${feature.colors}`}
        >
          {feature.icon}
        </div>
        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {feature.longDescription}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);
  const testiTimer = useRef(null);
  const [particles, setParticles] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight || 1;
      setScrollPct(Math.round((scrolled / total) * 100));
    };
    window.addEventListener("scroll", onScroll);

    testiTimer.current = setInterval(() => {
      setTestiIndex((i) => (i + 1) % testimonials.length);
    }, 4000);

    setParticles(generateParticles(50));

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(testiTimer.current);
    };
  }, []);

  const Stat = ({ from = 0, to, label, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      <motion.h3
        layout
        className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400"
      >
        <motion.span
          initial={{ count: from }}
          animate={{ count: to }}
          transition={{ duration: 1.2, ease: "easeOut", delay }}
        >
          {to}
        </motion.span>
      </motion.h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{label}</p>
    </motion.div>
  );

  return (
    <div
      className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden"
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
      <main className="flex-grow pt-24">
        {/* top scroll progress */}
        <div
          aria-hidden
          className="fixed top-0 left-0 h-1 z-50 w-full bg-transparent"
        >
          <div
            style={{ width: `${scrollPct}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
          />
        </div>

        {/* --- HERO SECTION --- */}
        <section className="relative text-white py-28 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Heading and CTA */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg"
                >
                  Smarter attendance with{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Tally
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                  className="mt-4 text-lg text-white/90 max-w-xl"
                >
                  Automate attendance via QR, get analytics, and handle
                  complaints — all in one modern dashboard.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex gap-4"
                >
                  <Link
                    to="/signup"
                    className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 rounded-full bg-white text-indigo-700 font-semibold hover:scale-[1.02] transition"
                  >
                    Open Dashboard
                  </Link>
                </motion.div>
              </div>

              {/* Right Side: Hero Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* --- IMPROVED 'NEXT CLASS' CARD --- */}
                <motion.div
                  className="hero-card relative rounded-3xl p-6 shadow-xl overflow-hidden"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* --- Animated background Orb --- */}
                  <div className="card-bg-orb absolute inset-0 rounded-full blur-3xl opacity-0 transition-opacity duration-500" />

                  {/* --- Card Content --- */}
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-white/90">Next class</p>
                          <p className="text-lg font-semibold text-white">
                            CS-101 — 11:00 AM
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Status</p>
                        <span className="text-green-300 font-bold px-3 py-1 rounded-full bg-green-900/40 text-xs">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-white/8 p-3 rounded-lg">
                        <p className="text-sm text-white/90">Present</p>
                        <p className="font-bold text-xl">42</p>
                      </div>
                      <div className="bg-white/8 p-3 rounded-lg">
                        <p className="text-sm text-white/90">Absent</p>
                        <p className="font-bold text-xl">3</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        to="/dashboard"
                        className="hero-button relative w-full py-2 rounded-full bg-indigo-600 text-white block text-center font-medium hover:bg-indigo-700 transition overflow-hidden"
                      >
                        <span className="z-10 relative">
                          View Full Dashboard
                        </span>
                        <motion.span
                          className="hero-arrow absolute right-4 top-1/2 -translate-y-1/2 opacity-0"
                          initial={{ x: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-900 py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-extrabold text-center mb-12"
            >
              Key features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {features.map((f, i) => (
                  <motion.article
                    key={i}
                    whileHover="hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate="rest"
                    exit="rest"
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="feature-card relative group rounded-2xl shadow-lg p-6 border overflow-hidden"
                  >
                    <div className="feature-card-border absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <motion.div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors text-white bg-gradient-to-br ${f.colors}`}
                        variants={{ rest: { y: 0 }, hover: { y: -5 } }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                      >
                        {f.icon}
                      </motion.div>
                      <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {f.description}
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={() => setSelectedFeature(f)}
                          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline transition-colors"
                        >
                          Learn more →
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Stat to="10000+" label="Students Managed" />
            <Stat to="500+" label="Teachers Active" />
            <Stat to="99.9%" label="Uptime" />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-2xl font-extrabold text-center mb-8">
              What users say
            </h3>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testiIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                >
                  <p className="text-lg italic text-gray-700 dark:text-gray-200">
                    “{testimonials[testiIndex].text}”
                  </p>
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    — {testimonials[testiIndex].name},{" "}
                    {testimonials[testiIndex].role}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-3 mt-6">
                {testimonials.map((t, idx) => (
                  <button
                    aria-label={`Go to testimonial ${idx + 1}`}
                    key={idx}
                    onClick={() => setTestiIndex(idx)}
                    className={`w-3 h-3 rounded-full ${
                      testiIndex === idx
                        ? "bg-indigo-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section (Redesigned) */}
        <section className="relative overflow-hidden z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-container relative text-white py-16 text-center"
          >
            <div className="relative z-10 max-w-2xl mx-auto px-6">
              <h4 className="text-2xl font-bold mb-3">Ready to try Tally?</h4>
              <p className="mb-6">
                Sign up and run a demo session today — no credit card required.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow"
                >
                  Start Free
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full border border-white/30"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />

      {/* --- FEATURE DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedFeature && (
          <FeatureDetailModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style>{`
        /* CTA Section Animation */
        .cta-container {
          background-color: #4f46e5;
        }
        .cta-container::before {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: conic-gradient(
            from 180deg at 50% 50%,
            #4f46e5, #8b5cf6, #d946ef, #4f46e5
          );
          animation: cta-glow 10s infinite linear;
          z-index: 0;
        }
        @keyframes cta-glow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .cta-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background-color: #4f46e5;
          opacity: 1;
        }

        /* All other styles */
        .hero-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .dark .hero-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(75, 85, 99, 0.5);
        }
        .card-bg-orb {
          top: 25%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(165, 180, 252, 0.8) 0%, rgba(139, 92, 246, 0.6) 50%, rgba(255, 255, 255, 0) 70%);
          animation: orb-pulse 4s infinite ease-in-out;
        }

        @keyframes orb-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }
        
        .hero-button:hover .hero-arrow {
            opacity: 1;
            transform: translateX(0);
        }
        .hero-button:hover {
          background-color: var(--color-indigo-700);
        }

        /* Existing Animations */
        @keyframes blob {
          0% { transform: translateY(0px) translateX(0) scale(1); }
          33% { transform: translateY(-12px) translateX(8px) scale(1.05); }
          66% { transform: translateY(8px) translateX(-8px) scale(0.95); }
          100% { transform: translateY(0px) translateX(0) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animate-blob-reverse { animation: blob 10s infinite reverse; }
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
      `}</style>
    </div>
  );
}
