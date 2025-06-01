const db = require("../db");
const admin = require("../admin");

class FilmsController {
    async getFilms(req, res) {
        try {
            const films = await db.query('SELECT * FROM "Movies"');
            res.json(films.rows);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getFilm(req, res) {
        try {
            const id = req.params.id;
            const film = await db.query(`
                SELECT 
                    "Genre"."name" AS "genre_name", 
                    "Movies".*, 
                    "Directors"."first_name" || ' ' || "Directors"."last_name" AS "director_name"
                FROM "Movies" 
                JOIN "Genre" ON "Movies"."genre_id" = "Genre"."genre_id" 
                JOIN "Directors" ON "Movies"."director_id" = "Directors"."director_id" 
                WHERE "Movies"."movie_id" = $1`, [id]);
                
            res.json(film.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getReviews(req, res) {
        try {
            const id = req.params.id;
            const reviews = await db.query(`
                SELECT 
                    "Reviews".*,
                    "Users"."first_name" || ' ' || "Users"."last_name" AS "user_name"
                FROM "Reviews" 
                JOIN "Users" ON "Reviews"."user_id" = "Users"."user_id"
                WHERE "movie_id" = $1`, [id]);
            res.json(reviews.rows);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async addReview(req, res) {
        try {
            const { user_id, movie_id, text, rating } = req.body;
            await db.query(`
                INSERT INTO "Reviews" 
                ("movie_id", "user_id", "text", "rating") 
                VALUES ($1, $2, $3, $4)`, 
                [movie_id, user_id, text, rating]);
            res.status(201).json({ message: "Review added successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getGenres(req, res) {
        try {
            const genres = await db.query('SELECT * FROM "Genre"');
            res.json(genres.rows);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getDirectors(req, res) {
        try {
            const directors = await db.query('SELECT * FROM "Directors"');
            res.json(directors.rows);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async addFilm(req, res) {
        try {
            const {name, date, rating, genre, director} = req.body;
            const id_genre = await db.query(`SELECT "genre_id" FROM "Genre" WHERE "name" = $1`, [genre]);
            const id_director = await db.query(`SELECT "director_id" FROM "Directors" WHERE "first_name" = $1 AND "last_name" = $2;`, [director.split(" ")[0], director.split(" ")[1]]);
            const newDate = date.replaceAll(".","-");
            await db.query(`INSERT INTO "Movies" ("title", "genre_id", "release_date", "director_id", "rating") VALUES ($1, $2, $3, $4, $5)`, [name, id_genre.rows[0].genre_id, newDate, id_director.rows[0].director_id, rating]);
            res.json();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteFilm(req, res) {
        try {
            const id = req.params.id;
            await admin.query('DELETE FROM "Movies" WHERE "movie_id" = $1', [id]);
            res.json({ message: "Film deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteReview(req, res) {
        try {
            const id = req.params.id;
            await db.query('DELETE FROM "Reviews" WHERE "review_id" = $1', [id]);
            res.json({ message: "Review deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new FilmsController();