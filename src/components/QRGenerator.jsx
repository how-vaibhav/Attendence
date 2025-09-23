import React, { useState } from "react";

import QRCode from "react-qr-code";

/**

 * Admin tool to create unique QR session IDs (stored locally).

 * Replace localStorage calls with POST /api/sessions in backend.

 */

export default function QRGenerator() {
  const [sessionId, setSessionId] = useState(null);

  function startSession() {
    const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const sessions = JSON.parse(localStorage.getItem("attend_sessions")) || [];

    const s = { id, createdAt: new Date().toISOString() };

    sessions.unshift(s);

    localStorage.setItem("attend_sessions", JSON.stringify(sessions));

    localStorage.setItem("attend_currentSession", id);

    setSessionId(id);
  }

  function endSession() {
    localStorage.removeItem("attend_currentSession");

    setSessionId(null);
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">QR Session</h3>

      {!sessionId ? (
        <button
          onClick={startSession}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Start Session
        </button>
      ) : (
        <>
          <div className="p-4 bg-gray-50 inline-block rounded">
            <QRCode value={sessionId} size={160} />
          </div>

          <p className="text-sm mt-2">
            Session ID:{" "}
            <code className="bg-gray-700 px-2 py-1 rounded">{sessionId}</code>
          </p>

          <div className="mt-3">
            <button
              onClick={endSession}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              End Session
            </button>
          </div>
        </>
      )}

      <p className="text-xs text-gray-500 mt-3">
        Students can scan this QR or enter the session code to mark attendance.
      </p>
    </div>
  );
}
