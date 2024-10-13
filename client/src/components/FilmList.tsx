import {useEffect, useState} from "react";
import Film from "./Film.tsx";
import {IFilm} from "../types.ts";
import axios from "axios";

function FilmList() {
    const [films, setFilms] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/films").then((response) => {
            setFilms(response.data);
        })
    }, []);
    return (
        <div className={"flex flex-wrap justify-between"}>
            {films.map((film: IFilm) => <Film key={film.id_фильма} film={film} />)}
        </div>
    );
}

export default FilmList;