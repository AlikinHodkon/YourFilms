const db = require("../db");
const admin = require("../admin");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../public/images/");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

class FilmsController {
    async updateFilm(req, res) {
        try {
            const id = req.params.id;
            const { title, genre_id, release_date, director_id, rating } = req.body;

            const filmExists = await db.query(`SELECT * FROM "Movies" WHERE "movie_id" = $1`, [id]);
            if (filmExists.rows.length === 0) {
                return res.status(404).json({ error: "Film not found" });
            }

            await db.query(`
                UPDATE "Movies"
                SET "title" = $1, "genre_id" = $2, "release_date" = $3, "director_id" = $4, "rating" = $5
                WHERE "movie_id" = $6`,
                [title, genre_id, release_date, director_id, rating, id]);

            res.json({ message: "Film updated successfully" });

        } catch (error) {
            console.error("Error updating film:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

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
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async addFilm(req, res) {
        try {
            const { name, date, rating, genre, director } = req.body;
            const image = req.file;

            const id_genre = await db.query(`SELECT "genre_id" FROM "Genre" WHERE "name" = $1`, [genre]);
            const [firstName, lastName] = director.split(" ");
            const id_director = await db.query(
                `SELECT "director_id" FROM "Directors" WHERE "first_name" = $1 AND "last_name" = $2`, 
                [firstName, lastName]
            );

            const newDate = date.replaceAll(".", "-");
            
            await db.query(
                `INSERT INTO "Movies" ("title", "genre_id", "release_date", "director_id", "rating", "image") 
                VALUES ($1, $2, $3, $4, $5, $6)`, 
                [
                    name, 
                    id_genre.rows[0].genre_id, 
                    newDate, 
                    id_director.rows[0].director_id, 
                    rating,
                    image ? image.filename : null
                ]
            );

            res.json({ message: "Film added successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteFilm(req, res) {
        try {
            const id = req.params.id;
            await admin.query('DELETE FROM "Movies" WHERE "movie_id" = $1', [id]);
            res.json({ message: "Film deleted successfully" });
        } catch (error) {
            console.error(error);
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
            console.error(error);
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
            const reviews = await db.query(
                `SELECT rating FROM "Reviews" WHERE "movie_id" = $1`, [movie_id]
            );
            const sum = reviews.rows.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = Math.round((sum / reviews.rows.length) * 10) / 10;
            await db.query(
                `UPDATE "Movies" SET "rating" = $1 WHERE "movie_id" = $2`, [averageRating, movie_id]
            );
            res.status(201).json({ message: "Review added successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteReview(req, res) {
        try {
            const id = req.params.id;
            const movie_id = await db.query('SELECT movie_id FROM "Reviews" WHERE "review_id" = $1', [id]).then((response) => response.rows[0].movie_id)
            await db.query('DELETE FROM "Reviews" WHERE "review_id" = $1', [id]);
            const reviews = await db.query(
                `SELECT rating FROM "Reviews" WHERE "movie_id" = $1`, [movie_id]
            );
            const sum = reviews.rows.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = Math.round((sum / reviews.rows.length) * 10) / 10;
            await db.query(
                `UPDATE "Movies" SET "rating" = $1 WHERE "movie_id" = $2`, [averageRating, movie_id]
            );
            res.json({ message: "Review deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = {
    filmsController: new FilmsController(),
    upload
};
