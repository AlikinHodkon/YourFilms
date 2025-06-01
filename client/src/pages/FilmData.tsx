import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { IFilm, IReview } from "../types.ts";
import { useParams } from "react-router-dom";
import Review from "../components/Review.tsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

function FilmData() {
    const { t } = useTranslation();
    const [filmData, setFilmData] = useState<IFilm | null>(null);
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [userData, setUserData] = useState(null);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(1);
    const params = useParams();
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ align: [] }],
            ["clean"],
        ]
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/api/films/${params.id}`).then((response) => {
            setFilmData(response.data);
        });
        axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
            setReviews(response.data);
        });
        axios.post("http://localhost:5000/api/profile", { "email": localStorage.getItem("email") }).then((response) => {
            setUserData(response.data);
        });
    }, []);

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

    return (
        <div className="bg-[#14181c] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex justify-center text-[#8a9aa9] pt-[2vh] flex-grow">
                <div className="h-[50vh] rounded w-[15vw] mr-[5vw]">
                    <img className="h-[50vh] rounded border-2 w-[15vw]" src={"../public/" + filmData?.title.replace(":", "") + ".jpg"} alt={t("film_title")} />
                </div>
                <div className="flex flex-col flex-grow">
                    <section className="flex flex-row justify-between w-[40vw] text-white text-center items-center">
                        <h2 className="text-[24px]">{filmData?.title}</h2>
                        <p className="text-[16px] items-center flex">
                            {filmData?.release_date ? `${t("release_date")}: ${new Date(filmData.release_date).toLocaleDateString("ru-RU")}` : ""}
                        </p>
                        <p className="text-[16px]">{t("director")}: {filmData?.last_name} {filmData?.first_name}</p>
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
                    <section className="flex flex-col text-[24px] flex-grow overflow-auto">
                        <h2 className="text-center">{t("reviews")}</h2>
                        <div className="flex flex-col space-y-2">
                            {reviews.map((review) => (
                                <Review key={review.review_id} review={review} setReviews={setReviews} />
                            ))}
                        </div>

                        <div className={`${localStorage.getItem("email") ? "flex" : "hidden"} flex-col mt-5 h-full`}>
                            <div className="flex flex-col p-3 border-2 rounded bg-[#1d242b]">
                                <div className="flex">
                                    <div className="flex flex-col">
                                        <h3 className="text-[16px] text-[#647586]">
                                            {t("review_by")} <span className="text-[#aabbcc]">{userData?.last_name} {userData?.first_name}</span>
                                        </h3>
                                    </div>
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
                                    className="h-56 overflow-auto bg-white text-black rounded"
                                    modules={modules}
                                    formats={[
                                        "header", "bold", "italic", "underline", "strike",
                                        "list", "bullet", "blockquote", "code-block",
                                        "link", "image", "script", "indent", "direction", "align"
                                    ]}
                                />

                                <div className={"flex justify-center mt-3"}>
                                    <button onClick={handleClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                             className="size-6">
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