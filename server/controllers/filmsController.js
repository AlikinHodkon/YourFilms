const db = require("../db");

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
            const reviews = await db.query(`SELECT * fROM "Отзывы" 
            JOIN "Пользователи" ON "Отзывы"."id_пользователя" = "Пользователи"."id_пользователя"
            WHERE "id_фильма" = $1`, [id]);
            res.json(reviews.rows);
        }catch (error){
            console.log(error)
        }
    }
}

module.exports = new filmsController();