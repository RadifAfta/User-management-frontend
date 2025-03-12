import React from "react";
import { getCurrentUser, logout } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";

const Profile = () => {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiUser className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">User Profile</span>
            </div>
            <div className="flex items-center">
              <span className="px-4 py-2 mr-4">
                Welcome, {currentUser?.user?.name || currentUser?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded bg-indigo-700 hover:bg-indigo-800 transition"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <div className="mb-4">
            <p className="text-gray-700"><strong>Name:</strong> {currentUser?.user?.name || currentUser?.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {currentUser?.user?.email || currentUser?.email}</p>
            <p className="text-gray-700"><strong>Role:</strong> {currentUser?.user?.role || currentUser?.role || "User"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;