import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("email")) navigate("/profile");
    }, []);
    function buttonHandler(event) {
        event.preventDefault();

        axios.post("http://localhost:5000/api/auth", {"email": email, "password": password})
          .then((response) => {
            localStorage.setItem("email", response.data.email);
            navigate("/profile");
          })
          .catch((error) => {
            console.error("Ошибка входа:", error);
          });
    }

    return (
        <div className={"flex justify-center"}>
            <form className={"flex flex-col w-1/2 border-2 border-gray-500"}>
                <label>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} className={"border-2 border-orange-600"} type={"text"} />
                <label>Password</label>
                <input onChange={(e) => setPassword(e.target.value)} className={"border-2 border-orange-600"} type={"password"} />
                <button onClick={buttonHandler}>Log in</button>
                <button onClick={() => navigate("/registration")}>Registration</button>
            </form>
        </div>
    );
}

export default LoginForm;