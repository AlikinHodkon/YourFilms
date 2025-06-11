import {useEffect, useState} from "react";
import Film from "./Film.tsx";
import {IFilm} from "../types.ts";
import axios from "axios";
import { useTranslation } from "react-i18next";

function FilmList() {
    const [films, setFilms] = useState<IFilm[]>([]);
    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [rating, setRating] = useState("1");
    const [genre, setGenre] = useState("Drama");
    const [director, setDirector] = useState();
    const [form, setForm] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        axios.get("http://localhost:5000/api/films").then((response) => {
            setFilms(response.data);
        });
        axios.get("http://localhost:5000/api/genres").then((response) => {
            setGenres(response.data);
        });
        axios.get("http://localhost:5000/api/directors").then((response) => {
            setDirectors(response.data);
        });
    }, []);

    async function addFilm(e) {
        e.preventDefault();
        setForm(false);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('date', date);
        formData.append('rating', rating);
        formData.append('genre', genre);
        formData.append('director', director);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post("http://localhost:5000/api/films", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const response = await axios.get("http://localhost:5000/api/films");
            setFilms(response.data);
        } catch (error) {
            console.error("Error adding film:", error);
        }
    }

    function handleInput(e) {
        switch (e.target.name) {
            case "name": setName(e.target.value); break;
            case "date": setDate(e.target.value); break;
            case "rating": setRating(e.target.value); break;
            case "director": setDirector(e.target.value); break;
            case "genre": setGenre(e.target.value); break;
        }
    }

    function showForm() {
        setForm(!form);
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        setImage(file);
    }

    return (
        <>
            <div className="flex justify-center">
                <button onClick={() => setFilms([...films].sort((a, b) => a.genre_id - b.genre_id))} className="mr-2 border bg-orange-600 p-2 w-[10%]">{t("sortbygenre")}</button>
                <button onClick={() => setFilms([...films].sort((a, b) => a.title.localeCompare(b.title)))} className="mr-2 border bg-orange-600 p-2 w-[10%]">{t("sortbyname")}</button>
                <button onClick={() => setFilms([...films].sort((a, b) => a.director_id - b.director_id))} className="mr-2 border bg-orange-600 p-2 w-[10%]">{t("sortbydirector")}</button>
                <button onClick={() => setFilms([...films].sort((a, b) => a.movie_id - b.movie_id))} className="border bg-orange-600 p-2 w-[10%]">{t("reset")}</button>
            </div>
            <div className={"flex flex-wrap gap-24 p-4"}>
                {films.map((film: IFilm) => <Film key={film.movie_id} film={film} setFilms={setFilms}/>)}
                <button onClick={showForm} className={`border-2 border-dotted border-orange-600 h-[60vh] w-[20vw] justify-center items-center mt-2 ${localStorage.getItem('email') === 'admin' ? "flex" : "hidden"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                </button>
                <form className={`${form ? "flex" : "hidden"} flex-col p-2 w-1/4 h-1/2 justify-between fixed transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-white border-2 border-orange-600`}>
                    <div className={"flex flex-col"}>
                        <label>Name</label>
                        <input onChange={handleInput} name={"name"} className={"border-2"} type={"text"} required />
                    </div>
                    <div className={"flex flex-col"}>
                        <label>Release Date</label>
                        <input onChange={handleInput} name={"date"} className={"border-2"} type={"date"} required />
                    </div>
                    <div className={"flex flex-col"}>
                        <label>Rating</label>
                        <select onChange={handleInput} name={"rating"} className={"border-2"}>
                            {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num}>{num}</option>)}
                        </select>
                    </div>
                    <div className={"flex flex-col"}>
                        <label>Director</label>
                        <select name={"director"} onChange={handleInput} className={"border-2"}>
                            {directors.map((director) => (
                                <option key={director.director_id}>
                                    {director.first_name} {director.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={"flex flex-col"}>
                        <label>Genre</label>
                        <select name={"genre"} onChange={handleInput} className={"border-2"}>
                            {genres.map((genre) => (
                                <option key={genre.genre_id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input type="file" onChange={handleImageUpload} className="mt-2 text-white" />
                    </div>
                    <button onClick={addFilm} className={"bg-orange-600 text-white rounded"}>Add</button>
                    <button onClick={() => setForm(false)} className="border border-orange-600">Close</button>
                </form>
            </div>
        </>
    );
}

export default FilmList;