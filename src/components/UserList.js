import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
    const [users, setUsers] = useState([]); // State untuk menyimpan daftar user

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users");
            setUsers(response.data.data || []); // Pastikan mengambil array dalam "data"
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]); // Jika gagal, set array kosong agar tidak error
        }
    };

    // 🔴 Fungsi untuk menghapus user
    const deleteUser = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
            setUsers(users.filter((user) => user.id !== id)); // Hapus user dari state tanpa reload
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Gagal menghapus user!");
        }
    };

    return (
        <div>
            <h2>User List</h2>
            {users.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.name} - {user.email} ({user.role})
                            <button
                                onClick={() => deleteUser(user.id)}
                                style={{ marginLeft: "10px", color: "red" }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
