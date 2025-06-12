import Navbar from "../components/Navbar.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [watchData, setWatchData] = useState(null);
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSaveProfile = async () => {
      try {
        await axios.patch("http://localhost:5000/api/profile", {
          email: userData.email,
          first_name: firstName,
          last_name: lastName,
        });
        setUserData(prev => ({ ...prev, first_name: firstName, last_name: lastName }));
        setIsEditMode(false);
      } catch (err) {
        console.error("Ошибка при обновлении профиля:", err);
      }
    };

    useEffect(() => {
        if (!localStorage.getItem("email")) navigate("/login");
        axios.post("http://localhost:5000/api/profile", {
            "email": localStorage.getItem("email")
        }).then((response) => {
            setUserData(response.data);
            axios.get(`http://localhost:5000/api/watch/${response.data.user_id}`).then((response) => {
                setWatchData(response.data);
            });
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
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

                      {isEditMode ? (
                        <>
                          <input
                            className="border p-1 rounded mt-2"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <input
                            className="border p-1 rounded mt-2"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          <button
                            onClick={handleSaveProfile}
                            className="bg-green-500 text-white rounded p-2 mt-2"
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={() => setIsEditMode(false)}
                            className="bg-gray-500 text-white rounded p-2 mt-2"
                          >
                            Отмена
                          </button>
                        </>
                      ) : (
                        <>
                          <h1>First Name: {userData?.first_name}</h1>
                          <h1>Last Name: {userData?.last_name}</h1>
                          <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-blue-500 text-white rounded p-2 mt-2"
                          >
                            Редактировать профиль
                          </button>
                        </>
                      )}

                      <h1>Registration Date: {userData?.registration_date.substring(0, 10)}</h1>
                    </div>

                </div>
                <div className="flex flex-col w-3/4 ml-5 mr-5">
                    <div className="bg-white w-full mt-5 p-5 flex flex-col justify-between h-[47.5vh] rounded-xl text-[32px]">
                        <h1 className="text-center text-[40px]"></h1>
                        <div className={`flex justify-between ml-5 mr-5`}>
                            <p>1</p>
                            <p
                              className="w-1/4 text-blue-600 hover:underline cursor-pointer"
                              onClick={() => navigate(`/watch/${watchData?.[0]?.movie_id}`)}
                            >
                              {watchData?.[0]?.title}
                            </p>
                            <p className="w-1/4">{watchData?.[0]?.watch_time.substring(0, 8)}</p>
                            <p className="w-1/4">{watchData?.[0]?.watch_date.substring(0, 10)}</p>
                        </div>
                        <div className={`flex justify-between ml-5 mr-5`}>
                            <p>2</p>
                            <p
                              className="w-1/4 text-blue-600 hover:underline cursor-pointer"
                              onClick={() => navigate(`/watch/${watchData?.[1]?.movie_id}`)}
                            >
                              {watchData?.[1]?.title}
                            </p>
                            <p className="w-1/4">{watchData?.[1]?.watch_time.substring(0, 8)}</p>
                            <p className="w-1/4">{watchData?.[1]?.watch_date.substring(0, 10)}</p>
                        </div>
                        <div className={`flex justify-between mb-5 ml-5 mr-5`}>
                            <p>3</p>
                            <p
                              className="w-1/4 text-blue-600 hover:underline cursor-pointer"
                              onClick={() => navigate(`/watch/${watchData?.[2]?.movie_id}`)}
                            >
                              {watchData?.[2]?.title}
                            </p>
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