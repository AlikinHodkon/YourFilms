import Navbar from "../components/Navbar.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {IFilm, IReview} from "../types.ts";
import {useParams} from "react-router-dom";
import Review from "../components/Review.tsx";

function FilmData() {
    const [filmData, setFilmData] = useState<IFilm | null>(null);
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const params = useParams();
    useEffect(() => {
        axios.get(`http://localhost:5000/api/films/${params.id}`).then((response) => {
            setFilmData(response.data);
        });
        axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
            setReviews(response.data);
        })
    }, []);
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
                        {reviews.map((review) => <Review review={review} />)}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default FilmData;