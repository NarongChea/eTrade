import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    username: "",
    email: "",
    password: "",
    confirmPwd: "",
    cart: [],
    favorites: [],
    order: [],
    role: "customer",
  });

  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    // Validation
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPwd.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and symbol."
      );
      return;
    }

    if (formData.password !== formData.confirmPwd) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check for existing username/email
    const toastId = toast.loading("Checking account availability...");

    try {
      const res = await fetch("https://json-server-api-y6cs.onrender.com/users");
      const users = await res.json();

      const emailExists = users.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );
      const usernameExists = users.some(
        (user) =>
          user.username.toLowerCase() === formData.username.toLowerCase()
      );

      if (emailExists || usernameExists) {
        toast.update(toastId, {
          render: emailExists
            ? "Email already exists."
            : "Username already exists.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          pauseOnHover: true,
        });
        return;
      }

      // Register if passed
      await register({
        id: formData.id,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        cart: formData.cart,
        favorites: formData.favorites,
        order: formData.order,
      });

      toast.update(toastId, {
        render: "Registration successful!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        pauseOnHover: true,
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to register. Try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-pink-50 to-blue-50 h-[62.1vh]">
      <div className="max-w-[1500px] mx-auto flex justify-center items-center py-10">
        <form
          className="w-[600px] p-5 py-8 border border-black/30 rounded-md mt-6 bg-white/30 backdrop-blur-md"
          onSubmit={handleSubmit}
        >
          <label className="text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full bg-transparent border-[1.5px] border-gray-300 rounded-sm px-3 py-1 focus:outline-blue-500 mb-3"
          />

          <label className="text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded-sm px-3 py-1 focus:outline-blue-500 mb-3"
          />

          <label className="text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded-sm px-3 py-1 focus:outline-blue-500 mb-3"
          />

          <label className="text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPwd"
            value={formData.confirmPwd}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded-sm px-3 py-1 focus:outline-blue-500 mb-3"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer">
            Register
          </button>

          <p className="text-center mt-5 text-gray-700">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Register;
