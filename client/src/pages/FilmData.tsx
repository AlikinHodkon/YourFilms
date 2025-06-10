import { useEffect, useState } from "react";
import axios from "axios";
import { IFilm, IReview } from "../types.ts";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Review from "../components/Review.tsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import "./Review.css";

function FilmData() {
    const { t } = useTranslation();
    const [filmData, setFilmData] = useState<IFilm | null>(null);
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [userData, setUserData] = useState(null);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(1);
    const params = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
            setReviews(response.data);
        });
        axios.post("http://localhost:5000/api/profile", { email: localStorage.getItem("email") }).then((response) => {
            setUserData(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/films/${params.id}`).then((response) => {
            setFilmData(response.data);
        });
    }, [reviews])

    function handleClick() {
        axios.post("http://localhost:5000/api/reviews", {
            "user_id": userData?.user_id,
            "movie_id": filmData?.movie_id,
            "text": text,
            "rating": rating
        }).then(() => {
            axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
                setReviews(response.data);
            });
        }).then(() => {
            setText("");
            setRating(1);
        });
    }

    if (!userData) return (<div>Loading</div>)

    return (
        <div className="bg-[#14181c] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex justify-center text-[#8a9aa9] pt-[2vh] flex-grow gap-4">
                <div className="h-[50vh] w-[15vw] flex flex-col items-center justify-center">
                    <img className="h-[50vh] rounded border-2 w-[15vw]" src={`http://localhost:5000/images/${filmData?.image}`} alt={t("film_title")} />
                </div>

                <div className="flex flex-col flex-grow">
                    <section className="flex flex-row justify-between w-[40vw] text-white text-center items-center">
                        <h2 className="text-[24px]">{filmData?.title}</h2>
                        <p className="text-[16px]">
                            {filmData?.release_date ? `${t("release_date")}: ${new Date(filmData.release_date).toLocaleDateString("ru-RU")}` : ""}
                        </p>
                        <p className="text-[16px]">{t("director")}: {filmData?.director_name}</p>
                    </section>

                    <div className="flex mt-2">
                        <p className="bg-[#283038] rounded p-1 text-[#8a9aa9]">{t("genre")}: {filmData?.genre_name}</p>
                    </div>

                    <hr className="bg-[#14181c] mt-5 mb-5"/>


                    <section className="flex text-2xl text-center w-100 text-white justify-between items-center">
                        <h2 className="ml-[5vw]">{t("rating")}</h2>
                        <div className={`ml-auto mr-[5vw] border rounded-3xl w-[3vw] h-[3vw] text-white flex justify-center items-center ${filmData?.rating > 6 ? "bg-green-500" : filmData?.rating > 3 ? "bg-amber-500" : "bg-red-600"}`}>
                            <p>{filmData?.rating}</p>
                        </div>
                    </section>

                    <section className="flex flex-col text-[24px] flex-grow overflow-hidden">
                        <h2 className="text-center">{t("reviews")}</h2>
                        <div className="flex flex-col space-y-2 items-center">
                            {reviews.map((review) => (
                                <Review key={review.review_id} review={review} setReviews={setReviews} userData={userData} />
                            ))}
                        </div>

                        <div className={`${localStorage.getItem("email") && localStorage.getItem("email") != "admin" ? "flex" : "hidden"} flex-col mt-5 h-full items-center`}>
                            <div className="flex flex-col p-3 border-2 rounded bg-[#1d242b] w-3/4">
                                <div className="flex pb-3">
                                    <h3 className="text-[16px] text-[#647586]">
                                        {t("review_by")} <span className="text-[#aabbcc]">{userData?.last_name} {userData?.first_name}</span>
                                    </h3>
                                    <div className="ml-auto border flex justify-center items-center">
                                        <select onChange={(e) => setRating(parseInt(e.target.value))}
                                                className="bg-[#283038] text-[#8a9aa9]">
                                            {Array.from({ length: 10 }, (_, i) => <option key={i+1}>{i+1}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <ReactQuill
                                    value={text}
                                    onChange={setText}
                                    className="quill-container overflow-auto h-80 bg-white text-black rounded"
                                    modules={{ toolbar: true }}
                                    readOnly={false}
                                />

                                <div className={"flex justify-center mt-3"}>
                                    <button onClick={handleClick} className="bg-green-500 text-white rounded p-2">Добавить отзыв</button>
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
