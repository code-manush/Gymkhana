import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Profile update will call your backend; shown here as a UI stub
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      // TODO: await updateProfile(formData)
      await new Promise((r) => setTimeout(r, 800)); // simulated delay
      setAlert({ type: "success", message: "Profile updated successfully!" });
    } catch {
      setAlert({ type: "error", message: "Could not update profile. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">👤 My Profile</h1>

          {/* Avatar Section */}
          <Card className="mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-bold select-none">
                {formData.name.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{formData.name || "Student"}</p>
                <p className="text-sm text-gray-500">{formData.email}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role || "Student"}</p>
              </div>
            </div>
          </Card>

          {/* Edit Form */}
          <Card title="Edit Profile">
            {alert.message && (
              <div className="mb-4">
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio" value={formData.bio} onChange={handleChange}
                  rows={3} placeholder="Tell us about yourself…"
                  className="input-field resize-none"
                />
              </div>
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </form>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
