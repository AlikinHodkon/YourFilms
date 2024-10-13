import {IFilm} from "../types.ts";

interface FilmProps{
    film: IFilm
}

function Film(props: FilmProps) {
    return (
        <div className={"border-2 border-orange-600 rounded flex flex-col h-[60vh] w-[20vw] text-center"}>
            <div className={"h-[50vh]"}>
                <img className={"h-[49vh] w-[20vw]"} src={props.film.название.replace(":","")+".jpg"} alt={""} />
            </div>
            <p>{props.film.название}</p>
            <div className={"flex flex-row justify-center"}>
                <p>{props.film.дата_выпуска.substring(0, 10)}</p>
                <p className={"ml-2"}>{props.film.рейтинг}</p>
            </div>
        </div>
    );
}

export default Film;