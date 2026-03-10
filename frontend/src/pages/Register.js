import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../services/authService";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📝</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Join the Gymkhana community</p>
        </div>

        {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError("")} /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} required placeholder="John Doe"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="you@college.edu"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="input-field">
              <option value="student">Student</option>
              <option value="organiser">Organiser</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} required placeholder="Min. 8 characters"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} required placeholder="Repeat password"
              className="input-field"
            />
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
