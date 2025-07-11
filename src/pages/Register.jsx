import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instance from "../services/axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await instance.post("/auth/register", {
        email,
        password,
      });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md space-y-5">
        <h2 className="text-3xl font-bold text-text text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-dark border border-gray-700 rounded text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-dark border border-gray-700 rounded text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-purple-700 p-3 rounded text-white font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Click here to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
