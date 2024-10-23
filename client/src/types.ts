export interface IFilm{
    id_фильма: number,
    название: string,
    дата_выпуска: string,
    id_режиссера: number,
    рейтинг: number,
    id_жанра: number,
    жанр: string,
    имя: string,
    фамилия: string
}

export interface IReview{
    id_отзыва: number,
    id_фильма: number,
    id_пользователя: number,
    текст: string,
    оценка: number,
    имя: string,
    фамилия: string,
    дата_отзыва: string
}