import {useEffect, useState} from "react";
import Film from "./Film.tsx";
import {IFilm} from "../types.ts";
import axios from "axios";

function FilmList() {
    const [films, setFilms] = useState<IFilm[]>([]);
    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [rating, setRating] = useState("1");
    const [genre, setGenre] = useState("Drama");
    const [director, setDirector] = useState("Sergei Eisenstein");
    const [form, setForm] = useState(false);
    useEffect(() => {
        axios.get("http://localhost:5000/api/films").then((response) => {
            setFilms(response.data);
        })
        axios.get("http://localhost:5000/api/genres").then((response) => {
            setGenres(response.data);
        })
        axios.get("http://localhost:5000/api/directors").then((response) => {
            setDirectors(response.data);
        })
    }, []);
    async function addFilm(e){
        e.preventDefault();
        setForm(false);
        await axios.post("http://localhost:5000/api/films", {"name": name, "date": date, "rating": rating, "genre": genre, "director": director});
        await axios.get("http://localhost:5000/api/films").then((response) => {
            setFilms(response.data);
        })
    }
    function handleInput(e){
        switch (e.target.name){
            case "name":{
                setName(e.target.value);
                break;
            }
            case "date":{
                setDate(e.target.value);
                break;
            }
            case "rating":{
                setRating(e.target.value);
                break;
            }
            case "director":{
                setDirector(e.target.value);
                break;
            }
            case "genre":{
                setGenre(e.target.value);
            }
        }
    }
    function showForm(){
        const visible = !form;
        setForm(visible);
    }
    return (
        <>
            <div className="flex justify-center">
                <button onClick={() => setFilms([...films].sort((film, film2) => film.id_жанра - film2.id_жанра))} className="mr-2 border bg-orange-600 p-2 w-[10%]">Sort by genre</button>
                <button onClick={() => setFilms([...films].sort((film, film2) => film.название.localeCompare(film2.название)))} className="mr-2 border bg-orange-600 p-2 w-[10%]">Sort by name</button>
                <button onClick={() => setFilms([...films].sort((film, film2) => film.id_режиссера - film2.id_режиссера))} className="mr-2 border bg-orange-600 p-2 w-[10%]">Sort by director</button>
                <button onClick={() => setFilms([...films].sort((film, film2) => film.id_фильма - film2.id_фильма))} className="border bg-orange-600 p-2 w-[10%]">Reset</button>
            </div>
            <div className={"flex flex-wrap justify-between"}>
                {films.map((film: IFilm) => <Film key={film.id_фильма} film={film} setFilms={setFilms}/>)}
                <button onClick={showForm} className={"border-2 border-dotted border-orange-600 h-[60vh] w-[20vw] flex justify-center items-center mt-2"}>
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
                    <div className={"flex flex-col"}>
                        <label>Director</label>
                        <select name={"director"} onChange={handleInput} className={"border-2"}>
                            {directors.map((director) => <option key={director.id_режиссера}>{director.имя} {director.фамилия}</option>)}
                        </select>
                    </div>
                    <div className={"flex flex-col"}>
                        <label>Genre</label>
                        <select name={"genre"} onChange={handleInput} className={"border-2"}>
                            {genres.map((genre) => <option key={genre.id_жанра}>{genre.название}</option>)}
                        </select>
                    </div>
                    <button onClick={addFilm} className={"bg-orange-600 text-white rounded"}>Add</button>
                </form>
            </div>
        </>
    );
}

export default FilmList;