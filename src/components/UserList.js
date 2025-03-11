import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiEdit, FiSearch, FiRefreshCw } from "react-icons/fi";

const UserList = ({ refreshUsers }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users");
            setUsers(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
            setLoading(false);
        }
    };

    // Fungsi untuk menghapus user
    const deleteUser = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Gagal menghapus user!");
        }
    };

    // Fungsi untuk sorting
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Filter users berdasarkan search
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.role && user.role.toLowerCase().includes(search.toLowerCase()))
    );

    // Sort users berdasarkan config
    const sortedUsers = React.useMemo(() => {
        let sortableUsers = [...filteredUsers];
        if (sortConfig.key) {
            sortableUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [filteredUsers, sortConfig]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
                <button 
                    onClick={fetchUsers}
                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                >
                    <FiRefreshCw className="mr-2" />
                    Refresh
                </button>
            </div>

            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : sortedUsers.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    {search ? "No users match your search." : "No users found."}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center">
                                        Name
                                        {sortConfig.key === 'name' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => requestSort('email')}
                                >
                                    <div className="flex items-center">
                                        Email
                                        {sortConfig.key === 'email' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => requestSort('role')}
                                >
                                    <div className="flex items-center">
                                        Role
                                        {sortConfig.key === 'role' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : user.role === 'moderator'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            onClick={() => console.log('Edit user', user.id)}
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;