export default function StudentCard({ s }) {
  const total =
    JSON.parse(localStorage.getItem("attend_sessions"))?.length || 0;
  const attended = s.attendedSessions?.length || 0;
  const percent = total ? Math.round((attended / total) * 100) : 0;
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold">{s.name}</h4>
          <p className="text-sm text-gray-500">
            {s.roll} • {s.email}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{percent}%</div>
          <div className="text-xs text-gray-500">Attendance</div>
        </div>
      </div>
    </div>
  );
}
