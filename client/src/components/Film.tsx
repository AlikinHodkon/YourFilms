import {IFilm} from "../types.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";

interface FilmProps{
    film: IFilm,
    setFilms: (films: IFilm[]) => void
}

function Film(props: FilmProps) {
    const navigate = useNavigate();
    function handleClick(){
        navigate(`/watch/${props.film.id_фильма}`);
    }
    async function deleteFilm(e){
        e.stopPropagation();
        await axios.delete(`http://localhost:5000/api/films/${props.film.id_фильма}`);
        await axios.get("http://localhost:5000/api/films").then((response) => {
            props.setFilms(response.data);
        })
    }
    return (
        <div onClick={handleClick} className={"border-2 mt-2 border-orange-600 rounded flex flex-col h-[60vh] w-[20vw] text-center relative"}>
            <div className={"h-[50vh]"}>
                <button onClick={deleteFilm} className={`absolute left-[90%] scale-150 top-1 bg-orange-600 ${localStorage.getItem('email') === "root" ? "block" : "hidden"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                </button>
                <img className={"h-[49vh] w-[20vw]"} src={props.film.название.replace(":", "") + ".jpg"} alt={""}/>
            </div>
            <p>{props.film.название}</p>
            <div className={"flex flex-row justify-center font-Poppins"}>
                <p>{props.film.дата_выпуска.substring(0, 10)}</p>
                <p className={"ml-2"}>{props.film.рейтинг}</p>
            </div>
        </div>
    );
}

export default Film;