import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

function RegistrationForm() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();
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
                <label>{t("email")}</label>
                <input onChange={(e) => setEmail(e.target.value)} className={"border-2 border-orange-600"}
                       type={"text"}/>
                <label>{t("name")}</label>
                <input onChange={(e) => setName(e.target.value)} className={"border-2 border-orange-600"}
                       type={"text"}/>
                <label>{t("surname")}</label>
                <input onChange={(e) => setSurname(e.target.value)} className={"border-2 border-orange-600"}
                       type={"text"}/>
                <label>{t("password")}</label>
                <input onChange={(e) => setPassword(e.target.value)} className={"border-2 border-orange-600"}
                       type={"password"}/>
                <button onClick={buttonHandler}>{t("sign_in")}</button>
            </form>
        </div>
    );
}

export default RegistrationForm;