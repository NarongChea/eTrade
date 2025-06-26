import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRole(null);
    localStorage.clear();
    navigate("/");
  };

  const register = async (userData) => {
    try {
      const res = await fetch("https://json-server-api-y6cs.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error("Failed to register");

      const data = await res.json();
      localStorage.setItem("id", data.id);
      setIsAuthenticated(true);
      setCurrentUser(data);
      setRole(data.role);
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
      toast.error("Registration failed. Please try again.");
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users?email=${email}`);
      if (!res.ok) {
        toast.error("Failed to fetch user data.");
        return;
      }

      const data = await res.json();

      if (data.length === 0) {
        toast.error("Email not yet registered.");
        return;
      }

      if (data[0].password !== password) {
        toast.error("Wrong password.");
        return;
      }

      // Success login
      localStorage.setItem("id", data[0].id);
      setIsAuthenticated(true);
      setCurrentUser(data[0]);
      setRole(data[0].role);
      navigate("/");
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Login error. Please try again.");
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${id}`);
      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      setCurrentUser(data);
      setRole(data.role);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setIsAuthenticated(true);
      fetchUserById(id);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        isAuthenticated,
        currentUser,
        role,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
