import Navbar from "../components/Navbar.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function Profile() {
    const navigate = useNavigate();
    useEffect(() => {if (!localStorage.getItem("email")){
        navigate("/login")
    }}, []);
    return (
        <div>
            <Navbar />
            <p>You're log in</p>
        </div>
    );
}

export default Profile;