import {IFilm} from "../types.ts";
import {useNavigate} from "react-router-dom";

interface FilmProps{
    film: IFilm
}

function Film(props: FilmProps) {
    const navigate = useNavigate();
    function handleClick(){
        navigate(`/watch/${props.film.id_фильма}`);
    }
    return (
        <div onClick={handleClick} className={"border-2 mt-2 border-orange-600 rounded flex flex-col h-[60vh] w-[20vw] text-center"}>
            <div className={"h-[50vh]"}>
                <img className={"h-[49vh] w-[20vw]"} src={props.film.название.replace(":","")+".jpg"} alt={""} />
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