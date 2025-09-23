import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative bg-gray-900 text-gray-300 py-12 rounded-t-3xl mt-24 overflow-hidden"
  >
    {/* Animated background blob for a creative touch " ye thoda risky he kyoki error deta hein" */}
    <div
      aria-hidden
      className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-blob-footer"
    />
    <div
      aria-hidden
      className="absolute top-0 right-0 w-60 h-60 bg-indigo-500 opacity-10 rounded-full filter blur-3xl animate-blob-footer-reverse"
    />

    <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 z-10">
      <div>
        <h3 className="text-white text-3xl font-extrabold mb-2">Tally</h3>
        <p className="text-sm text-gray-400">
          Smart attendance, analytics & complaint management.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Newsletter</h4>
        <form className="flex gap-2">
          <input
            aria-label="email"
            type="email"
            placeholder="Email"
            className="flex-1 px-3 py-2 rounded-md bg-white/10 dark:bg-gray-800/60 backdrop-blur-md border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 text-center mt-10 border-t border-gray-800 pt-6 text-sm relative z-10">
      <p>© {new Date().getFullYear()} Tally. All rights reserved.</p>
    </div>
  </motion.footer>
);

export default Footer;
