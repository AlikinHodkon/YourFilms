const db = require("../db");

class DirectorsController {
    async getDirectors(req, res) {
        try {
            const directors = await db.query('SELECT * FROM "Directors"');
            res.json(directors.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка получения режиссеров" });
        }
    }

    async getDirector(req, res) {
        try {
            const { id } = req.params;
            const director = await db.query('SELECT * FROM "Directors" WHERE "director_id" = $1', [id]);
            res.json(director.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка получения режиссера" });
        }
    }

    async addDirector(req, res) {
        try {
            const { first_name, last_name, birth_date, biography } = req.body;
            await db.query(
                'INSERT INTO "Directors" ("first_name", "last_name", "birth_date", "biography") VALUES ($1, $2, $3, $4)',
                [first_name, last_name, birth_date, biography]
            );
            res.json({ message: "Режиссер успешно добавлен" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка добавления режиссера" });
        }
    }

    async updateDirector(req, res) {
        try {
            const { id } = req.params;
            const { first_name, last_name, birth_date, biography } = req.body;

            await db.query(
                'UPDATE "Directors" SET "first_name" = $1, "last_name" = $2, "birth_date" = $3, "biography" = $4 WHERE "director_id" = $5',
                [first_name, last_name, birth_date, biography, id]
            );

            res.json({ message: "Режиссер обновлен" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка обновления режиссера" });
        }
    }

    async deleteDirector(req, res) {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM "Directors" WHERE "director_id" = $1', [id]);
            res.json({ message: "Режиссер успешно удален" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка удаления режиссера" });
        }
    }
}

module.exports = new DirectorsController();
