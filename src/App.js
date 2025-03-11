import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
    const [refresh, setRefresh] = useState(false);

    const refreshUsers = () => {
        setRefresh(!refresh);
    };

    return (
        <div className="App">
            <h1>Laravel + React CRUD</h1>
            <AddUser refreshUsers={refreshUsers} />
            <UserList key={refresh} />
        </div>
    );
}

export default App;
