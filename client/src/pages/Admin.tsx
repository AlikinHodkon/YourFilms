import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    function handleClick(e){
        e.preventDefault();
        axios.post("http://localhost:5000/api/admin", {"name": name, "password": password}).then((response) => {
            console.log(response);
            localStorage.setItem("email", response.data)
        })
        if (localStorage.getItem('email') === 'root') navigate("/watch")
    }
    return (
        <div className={"flex justify-center mt-[3%]"}>
            <form className={"flex flex-col border-2 border-orange-600 rounded"}>
                <label>Login</label>
                <input onChange={(e) => setName(e.target.value)} className={"border-2"} type={"text"} />
                <label>Password</label>
                <input onChange={(e) => setPassword(e.target.value)} className={"border-2"} type={"password"}/>
                <button onClick={handleClick}>Log in</button>
            </form>
        </div>
    );
}

export default Admin;