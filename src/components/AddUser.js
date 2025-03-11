import React, { useState } from "react";
import { createUser } from "../services/UserService";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

const AddUser = ({ refreshUsers }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            await createUser({ name, email, password, role });
            setSuccess("User berhasil ditambahkan!");
            refreshUsers();
            
            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            setRole("user");
            
            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (error) {
            console.error("Error adding user:", error);
            setError(error.response?.data?.message || "Gagal menambahkan user!");
            
            setTimeout(() => {
                setError("");
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tambah User Baru</h2>
            
            {error && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p>{error}</p>
                </div>
            )}
            
            {success && (
                <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                    <p>{success}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        id="role"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                    </select>
                </div>
                
                <div>
                    <button
                        type="submit"
                        className={`flex justify-center items-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <FiUserPlus className="mr-2" />
                        )}
                        {loading ? "Processing..." : "Tambah User"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;