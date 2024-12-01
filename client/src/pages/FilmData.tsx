import Navbar from "../components/Navbar.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {IFilm, IReview} from "../types.ts";
import {useParams} from "react-router-dom";
import Review from "../components/Review.tsx";

function FilmData() {
    const [filmData, setFilmData] = useState<IFilm | null>(null);
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [userData, setUserData] = useState(null);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(1);
    const params = useParams();
    useEffect(() => {
        axios.get(`http://localhost:5000/api/films/${params.id}`).then((response) => {
            setFilmData(response.data);
        });
        axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
            setReviews(response.data);
        })
        axios.post("http://localhost:5000/api/profile", {"email": JSON.parse(localStorage.getItem("email"))}).then((response) => {
            setUserData(response.data);
        })
    }, []);
    function handleClick(){
        axios.post("http://localhost:5000/api/reviews", {"id_user": userData?.id_пользователя, "id_film": filmData?.id_фильма, "text": text, "rating": rating}).then(() => {
            axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
                setReviews(response.data);
            })
        })
    }
    return (
        <div className={"bg-[#14181c]"}>
            <Navbar />
            <div className={"h-[94.3vh] flex justify-center  text-[#8a9aa9] pt-[2vh]"}>
                <div className={"h-[50vh] rounded w-[15vw] mr-[5vw]"}>
                    <img className={"h-[50vh] rounded border-2 w-[15vw]"} src={"../public/"+filmData?.название.replace(":","")+".jpg"} alt={"Нет картинки"} />
                </div>
                <div>
                    <section className={"flex flex-row justify-between w-[40vw] text-white text-center items-center"}>
                        <h2 className={"text-[24px]"}>{filmData?.название}</h2>
                        <p className={"text-[16px] items-center flex"}>{filmData?.дата_выпуска.toLocaleString().substring(0,10).replaceAll("-", ".")}</p>
                        <p className={"text-[16px]"}>Directed by {filmData?.фамилия} {filmData?.имя}</p>
                    </section>
                    <div className={"flex mt-2"}>
                        <p className={"bg-[#283038] rounded p-1 text-[#8a9aa9]"}>{filmData?.жанр}</p>
                    </div>
                    <hr className={"bg-[#14181c] mt-5 mb-5"}/>
                    <section className={"flex text-2xl text-center w-100 text-white justify-between items-center"}>
                        <h2 className={"ml-[5vw]"}>Rating</h2>
                        <div className={`ml-auto mr-[5vw] border rounded-3xl w-[3vw] h-[3vw] text-white flex justify-center items-center ${filmData?.рейтинг > 6 ? "bg-green-500" : filmData?.рейтинг > 3 ? "bg-amber-500" : "bg-red-600"}`}>
                            <p>{filmData?.рейтинг}</p>
                        </div>
                    </section>
                    <hr className={"bg-[#14181c] mt-5 mb-5"}/>
                    <section className={"flex flex-col text-[24px]"}>
                        <h2 className={"text-center"}>Reviews</h2>
                        {reviews.map((review) => <Review key={review.id_отзыва} review={review} />)}
                        <div className={`${localStorage.getItem("email") ? "flex" : "hidden"} flex-col mt-5`}>
                            <div className={"flex flex-col p-3 border-2 rounded"}>
                                <div className={"flex"}>
                                    <div className={"flex flex-col"}>
                                        <h3 className={"text-[16px] text-[#647586]"}>Review by
                                            <span className={"text-[#aabbcc]"}> {userData?.фамилия} {userData?.имя}</span>
                                        </h3>
                                        <p className={"text-[12px] text-[#647586]"}>{}</p>
                                    </div>
                                    <div className={`ml-auto border flex justify-center items-center`}>
                                        <select onChange={(e) => setRating(parseInt(e.target.value))}>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                            <option>7</option>
                                            <option>8</option>
                                            <option>9</option>
                                            <option>10</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea onChange={(e) => setText(e.target.value)} className={"text-[16px] mt-2 text-[#97a8b9] bg-[#283038]"}></textarea>
                                <div className={"flex justify-center mt-3"}>
                                    <button onClick={handleClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default FilmData;