import axios from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    function buttonHandler(){
        axios.post("http://localhost:5000/api/auth", {"email": email, "password": password}).then((response) => {
            alert(response);
            localStorage.setItem("email", JSON.stringify(response));
            navigate("/profile");
        });
    }
    return (
        <div className={"flex justify-center"}>
            <form className={"flex flex-col w-1/2 border-2 border-gray-500"}>
                <input onChange={(e) => setEmail(e.target.value)} className={"border-2 border-orange-600"} type={"text"} />
                <input onChange={(e) => setPassword(e.target.value)} className={"border-2 border-orange-600"} type={"password"} />
                <button onClick={buttonHandler}>Log in</button>
            </form>
        </div>
    );
}

export default LoginForm;