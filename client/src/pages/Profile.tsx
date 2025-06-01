import Navbar from "../components/Navbar.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [watchData, setWatchData] = useState(null);
    
    useEffect(() => {
        axios.post("http://localhost:5000/api/profile", {
            "email": localStorage.getItem("email")
        }).then((response) => {
            setUserData(response.data);
            axios.get(`http://localhost:5000/api/watch/${response.data.user_id}`).then((response) => {
                setWatchData(response.data.rows);
            });
        });
    }, []);

    return (
        <div className="w-full">
            <Navbar />
            <div className="flex flex-row w-full pt-5 pb-5 bg-slate-400">
                <div className="shadow bg-white w-1/4 ml-5 rounded-xl">
                    <div className="h-[50vh]">
                        <img src={"public/avatar.jpg"} className="rounded-xl"/>
                    </div>
                    <div className="flex flex-col justify-between h-[45vh] p-5 text-[24px]">
                        <h1>Email: {userData?.email}</h1>
                        <h1>First Name: {userData?.first_name}</h1>
                        <h1>Last Name: {userData?.last_name}</h1>
                        <h1>Registration Date: {userData?.registration_date.substring(0, 10)}</h1>
                    </div>
                </div>
                <div className="flex flex-col w-3/4 ml-5 mr-5">
                    <div className="bg-white w-full p-5 flex flex-col h-[47.5vh] rounded-xl text-[32px]">
                        <h1 className="text-center text-[40px]"></h1>
                        <p className="mt-5"></p>
                        <p className="mt-20"></p>
                    </div>
                    <div className="bg-white w-full mt-5 p-5 flex flex-col justify-between h-[47.5vh] rounded-xl text-[32px]">
                        <h1 className="text-center text-[40px]"></h1>
                        <div className={`flex justify-between ml-5 mr-5`}>
                            <p>1</p>
                            <p className="w-1/4">{watchData?.[0]?.title}</p>
                            <p className="w-1/4">{watchData?.[0]?.watch_time.substring(0, 8)}</p>
                            <p className="w-1/4">{watchData?.[0]?.watch_date.substring(0, 10)}</p>
                        </div>
                        <div className={`flex justify-between ml-5 mr-5`}>
                            <p>2</p>
                            <p className="w-1/4">{watchData?.[1]?.title}</p>
                            <p className="w-1/4">{watchData?.[1]?.watch_time.substring(0, 8)}</p>
                            <p className="w-1/4">{watchData?.[1]?.watch_date.substring(0, 10)}</p>
                        </div>
                        <div className={`flex justify-between mb-5 ml-5 mr-5`}>
                            <p>3</p>
                            <p className="w-1/4">{watchData?.[2]?.title}</p>
                            <p className="w-1/4">{watchData?.[2]?.watch_time.substring(0, 8)}</p>
                            <p className="w-1/4">{watchData?.[2]?.watch_date.substring(0, 10)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;