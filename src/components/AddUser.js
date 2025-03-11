import React, { useState } from "react";
import { createUser } from "../services/UserService";

const AddUser = ({ refreshUsers }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser({ name, email, password });
            refreshUsers(); // Refresh list user setelah tambah
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add User</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Add User</button>
        </form>
    );
};

export default AddUser;
