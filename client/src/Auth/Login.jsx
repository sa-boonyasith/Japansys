import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetForm({ ...resetForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");
      
      if (onLogin) onLogin(data.user);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("An error occurred while logging in");
      console.error("Error:", err);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/changepass", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setResetMessage(data.error || "Failed to change password");
        return;
      }

      // Close modal and show alert
      setShowModal(false);
      alert("Password changed successfully!");
      
      // Clear the form
      setResetForm({
        email: "",
        oldPassword: "",
        newPassword: "",
      });
      setResetMessage("");

    } catch (error) {
      console.error("Error changing password:", error);
      setResetMessage("An error occurred while changing password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo or Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold  bg-black bg-clip-text text-transparent">
              LOGIN
            </h1>
            <p className="text-gray-500 mt-2">Please sign in to continue</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition duration-200 transform hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>

          {/* Additional Actions */}
          <div className="mt-6 space-y-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium"
            >
              Change Password
            </button>
            
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Change Password
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={resetForm.email}
                  onChange={handleResetInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={resetForm.oldPassword}
                  onChange={handleResetInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={resetForm.newPassword}
                  onChange={handleResetInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {resetMessage && (
                <div className={`p-4 rounded-lg text-sm ${
                  resetMessage.includes("successfully") 
                    ? "bg-green-50 text-green-600" 
                    : "bg-red-50 text-red-600"
                }`}>
                  {resetMessage}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;