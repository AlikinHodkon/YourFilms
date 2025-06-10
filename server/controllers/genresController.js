const db = require("../db");

class GenresController {
    async getGenres(req, res) {
        try {
            const genres = await db.query('SELECT * FROM "Genre"');
            res.json(genres.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка получения жанров" });
        }
    }

    async getGenre(req, res) {
        try {
            const { id } = req.params;
            const genre = await db.query('SELECT * FROM "Genre" WHERE "genre_id" = $1', [id]);
            res.json(genre.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка получения жанра" });
        }
    }

    async addGenre(req, res) {
        try {
            const { name, description } = req.body;
            await db.query('INSERT INTO "Genre" ("name", "description") VALUES ($1, $2)', [name, description]);
            res.json({ message: "Жанр успешно добавлен" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка добавления жанра" });
        }
    }

    async updateGenre(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            await db.query(
                'UPDATE "Genre" SET "name" = $1, "description" = $2 WHERE "genre_id" = $3',
                [name, description, id]
            );

            res.json({ message: "Жанр успешно обновлен" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка обновления жанра" });
        }
    }

    async deleteGenre(req, res) {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM "Genre" WHERE "genre_id" = $1', [id]);
            res.json({ message: "Жанр успешно удален" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка удаления жанра" });
        }
    }
}

module.exports = new GenresController();
