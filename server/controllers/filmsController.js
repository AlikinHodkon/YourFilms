const db = require("../db");
const admin = require("../admin");

class filmsController{
    async getFilms(req, res){
        try{
            const films = await db.query('SELECT * FROM "Фильмы"');
            res.json(films.rows);
        }catch (error){
            console.log(error)
        }
    }
    async getFilm(req, res){
        try{
            const id = req.params.id;
            const film = await db.query(`SELECT "Жанр"."название" AS "жанр", * , "Фильмы"."название" FROM "Фильмы" 
            JOIN "Жанр" ON "Фильмы"."id_жанра" = "Жанр"."id_жанра" 
            JOIN "Режиссеры" ON "Фильмы"."id_режиссера" = "Режиссеры"."id_режиссера" 
            WHERE "Фильмы"."id_фильма" = $1`,[id]);
            res.json(film.rows[0]);
        }catch (error){
            console.log(error)
        }
    }
    async getReviews(req, res){
        try {
            const id = req.params.id;
            const reviews = await db.query(`SELECT * FROM "Отзывы" 
            JOIN "Пользователи" ON "Отзывы"."id_пользователя" = "Пользователи"."id_пользователя"
            WHERE "id_фильма" = $1`, [id]);
            res.json(reviews.rows);
        }catch (error){
            console.log(error)
        }
    }
    async addReview(req, res){
        try {
            const {id_user, id_film, text, rating} = req.body;
            await db.query(`INSERT INTO "Отзывы" ("id_фильма", "id_пользователя", "текст", "оценка") VALUES ($1, $2, $3, $4)`, [id_film, id_user, text, rating]);
            res.json();
        }catch (error){
            console.log(error)
        }
    }
    async getGenres(req, res){
        try {
            const genres = await db.query('SELECT * FROM "Жанр"');
            res.json(genres.rows)
        }catch (error){
            console.log(error)
        }
    }
    async getDirectors(req, res){
        try{
            const directors = await db.query('SELECT * FROM "Режиссеры"');
            res.json(directors.rows);
        }catch (error) {
            console.log(error)

        }
    }
    async addFilm(req, res){
        try{
            const {name, date, rating, genre, director} = req.body;
            const id_genre = await db.query(`SELECT "id_жанра" FROM "Жанр" WHERE "название" = $1`, [genre]);
            const id_director = await db.query(`SELECT "id_режиссера" FROM "Режиссеры" WHERE "имя" = $1 AND "фамилия" = $2;`, [director.split(" ")[0], director.split(" ")[1]]);
            const newDate = date.replaceAll(".","-");
            await admin.query(`INSERT INTO "Фильмы" ("название", "id_жанра", "дата_выпуска", "id_режиссера", "рейтинг") VALUES ($1, $2, $3, $4, $5)`, [name, id_genre.rows[0].id_жанра, newDate, id_director.rows[0].id_режиссера, rating]);
            res.json();
        }catch (error) {
            console.log(error)
        }
    }
    async deleteFilm(req, res){
        try{
            const id = req.params.id;
            await admin.query(`DELETE FROM "Фильмы" WHERE "id_фильма" = $1`, [id]);
            res.json();
        }catch (error) {
            console.log(error)

        }
    }
}

module.exports = new filmsController();