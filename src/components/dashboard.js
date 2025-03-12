import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import { FiUsers, FiPlusCircle, FiHome, FiLogOut } from "react-icons/fi";
import { logout, getCurrentUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("list"); // "list" atau "add"
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const refreshUsers = () => {
        setRefresh(!refresh);
    };

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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xl font-bold">User Management Dashboard</span>
                        </div>
                        <div className="flex items-center">
                            <span className="px-4 py-2 mr-4">Welcome, {currentUser?.name || "Admin"}</span>
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
                {/* Tabs */}
                <div className="flex mb-8 border-b border-gray-200">
                    <button
                        className={`flex items-center mr-8 py-4 px-2 ${
                            activeTab === "list"
                                ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                                : "text-gray-600 hover:text-indigo-500"
                        }`}
                        onClick={() => setActiveTab("list")}
                    >
                        <FiUsers className="mr-2" />
                        <span>User List</span>
                    </button>
                    <button
                        className={`flex items-center py-4 px-2 ${
                            activeTab === "add"
                                ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                                : "text-gray-600 hover:text-indigo-500"
                        }`}
                        onClick={() => setActiveTab("add")}
                    >
                        <FiPlusCircle className="mr-2" />
                        <span>Add User</span>
                    </button>
                </div>

                {/* Content based on active tab */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === "list" ? (
                        <UserList key={refresh} refreshUsers={refreshUsers} />
                    ) : (
                        <AddUser refreshUsers={() => {
                            refreshUsers();
                            setActiveTab("list"); // Switch to list view after adding
                        }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;