import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Simple Auth & seed data using localStorage.
 * Replace localStorage calls later with API endpoints.
 */

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function seedData() {
  if (!localStorage.getItem("attend_users")) {
    const users = [
      {
        id: "admin-1",
        name: "Admin",
        email: "admin@attend.com",
        password: "admin123",
        role: "admin",
      },
    ];
    localStorage.setItem("attend_users", JSON.stringify(users));
  }

  if (!localStorage.getItem("attend_students")) {
    const students = [
      {
        id: "s1",
        name: "Vaibhav",
        email: "vaibhav@college.edu",
        roll: "BT101",
        attendedSessions: [],
      },
      {
        id: "s2",
        name: "Aisha",
        email: "aisha@college.edu",
        roll: "BT102",
        attendedSessions: [],
      },
      {
        id: "s3",
        name: "Rohan",
        email: "rohan@college.edu",
        roll: "BT103",
        attendedSessions: [],
      },
    ];
    localStorage.setItem("attend_students", JSON.stringify(students));
  }

  if (!localStorage.getItem("attend_sessions")) {
    localStorage.setItem("attend_sessions", JSON.stringify([]));
  }

  if (!localStorage.getItem("attend_complaints")) {
    localStorage.setItem("attend_complaints", JSON.stringify([]));
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("attend_currentUser")) || null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    seedData();
  }, []);

  const signup = ({ name, email, password, role }) => {
    const users = JSON.parse(localStorage.getItem("attend_users")) || [];
    if (users.find((u) => u.email === email))
      throw new Error("Email already registered");
    const newUser = { id: `u-${Date.now()}`, name, email, password, role };
    users.push(newUser);
    localStorage.setItem("attend_users", JSON.stringify(users));
    // if student, also add to students list
    if (role === "student") {
      const students =
        JSON.parse(localStorage.getItem("attend_students")) || [];
      students.push({
        id: `s-${Date.now()}`,
        name,
        email,
        roll: `R-${Math.floor(100 + Math.random() * 900)}`,
        attendedSessions: [],
      });
      localStorage.setItem("attend_students", JSON.stringify(students));
    }
    setUser({ name, email, role });
    localStorage.setItem(
      "attend_currentUser",
      JSON.stringify({ name, email, role })
    );
    navigate("/dashboard");
  };

  const login = ({ email, password, role }) => {
    const users = JSON.parse(localStorage.getItem("attend_users")) || [];
    const u = users.find(
      (user) =>
        user.email === email && user.password === password && user.role === role
    );
    if (!u) throw new Error("Invalid credentials");
    setUser({ name: u.name, email: u.email, role: u.role });
    localStorage.setItem(
      "attend_currentUser",
      JSON.stringify({ name: u.name, email: u.email, role: u.role })
    );
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("attend_currentUser");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
