import { motion } from "framer-motion";

const complaints = [
  {
    id: 1,
    student: "John Doe",
    issue: "Attendance not marked",
    date: "2025-09-21",
  },
  {
    id: 2,
    student: "Priya Sharma",
    issue: "Wrong subject marked",
    date: "2025-09-22",
  },
];

export default function AdminComplaints() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100">
        Admin – Complaints Dashboard
      </h2>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {complaints.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">
                {c.student}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{c.issue}</p>
              <span className="text-sm text-gray-400">{c.date}</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Resolve
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Discard
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Reply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
