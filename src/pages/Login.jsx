import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const { login, error } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      const toastId = toast.loading("Checking...");
      toast.update(toastId, {
        render: "All fields are required.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnHover: true,
      });
      return;
    }

    setLoading(true);
    await login(formData);
    setLoading(false);
  };

  return (
    <div className="w-full bg-gradient-to-br from-pink-50 to-blue-50 min-h-[62.1vh]">
      <div className="max-w-[1500px] mx-auto flex justify-center items-center py-10">
        <form
          className="w-[600px] p-5 py-8 border border-black/30 rounded-md mt-6 bg-white/30 backdrop-blur-md"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email" className="text-gray-700 block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded-sm px-3 py-2 focus:outline-blue-500 mb-6"
          />

          <label htmlFor="password" className="text-gray-700 block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded-sm px-3 py-2 focus:outline-blue-500 mb-6"
          />

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center mt-5 text-gray-700">
            Not yet have an account?{' '}
            <Link to="/register" className="text-blue-600 underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Login;
