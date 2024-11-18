import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function RegistrationForm() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    function buttonHandler(){
        axios.post("http://localhost:5000/api/registration", {"email": email, "password": password, "name": name, "surname": surname}).then((response) => {
            localStorage.setItem("email", JSON.stringify(response.email));
        });
        navigate("/profile");
    }
    return (
        <div className={"flex justify-center"}>
            <form className={"flex flex-col w-1/2 border-2 border-gray-500"}>
                <label>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} className={"border-2 border-orange-600"}
                       type={"text"}/>
                <label>Name</label>
                <input onChange={(e) => setName(e.target.value)} className={"border-2 border-orange-600"}
                       type={"text"}/>
                <label>Surname</label>
                <input onChange={(e) => setSurname(e.target.value)} className={"border-2 border-orange-600"}
                       type={"text"}/>
                <label>Password</label>
                <input onChange={(e) => setPassword(e.target.value)} className={"border-2 border-orange-600"}
                       type={"password"}/>
                <button onClick={buttonHandler}>Log in</button>
            </form>
        </div>
    );
}

export default RegistrationForm;