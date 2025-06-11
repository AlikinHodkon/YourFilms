import axios from "axios";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();
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
                <label>{t("email")}</label>
                <input onChange={(e) => setEmail(e.target.value)} className={"border-2 border-orange-600"} type={"text"} />
                <label>{t("password")}</label>
                <input onChange={(e) => setPassword(e.target.value)} className={"border-2 border-orange-600"} type={"password"} />
                <button onClick={buttonHandler}>{t("login")}</button>
                <button onClick={() => navigate("/registration")}>{t("registration")}</button>
            </form>
        </div>
    );
}

export default LoginForm;