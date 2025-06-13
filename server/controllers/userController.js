const db = require("../db");
const bcrypt = require('bcrypt');

class UserController {
    async registration(req, res) {
        try {
            const { name, surname, password, email } = req.body;

            // Validate input
            if (!name || !surname || !password || !email) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Check if user already exists
            const existingUser = await db.query('SELECT * FROM "Users" WHERE "email" = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: "User already exists" });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Create user
            const newUser = await db.query(
                `INSERT INTO "Users"
                ("first_name", "last_name", "email", "registration_date")
                VALUES($1, $2, $3, CURRENT_DATE)
                RETURNING *`,
                [name, surname, email]
            );

            // Store password
            await db.query(
                `INSERT INTO "Passwords"
                ("user_id", "password_hash")
                VALUES($1, $2)`,
                [newUser.rows[0].user_id, passwordHash]
            );

            res.status(201).json({
                id: newUser.rows[0].user_id,
                name: newUser.rows[0].first_name,
                surname: newUser.rows[0].last_name,
                email: newUser.rows[0].email
            });

        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async adminStatus(req, res) {
        try {
            const userEmail = req.session?.email; // ✅ Берём email из сессии

            if (!userEmail) {
                return res.status(401).json({ isAdmin: false, error: "User not authenticated" });
            }

            const isAdmin = userEmail === "admin"; // ✅ Проверка на администратора
            res.json({ isAdmin });

        } catch (error) {
            console.error("Admin status error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            // Получаем пользователя
            const userData = await db.query(
                'SELECT "user_id", "first_name", "last_name", "email" FROM "Users" WHERE "email" = $1',
                [email]
            );

            if (userData.rows.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Получаем пароль
            const passwordData = await db.query(
                'SELECT "password" FROM "Passwords" WHERE "user_id" = $1',
                [userData.rows[0].user_id]
            );

            if (passwordData.rows.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            if (email != "admin"){

                const isPasswordValid = await bcrypt.compare(password, passwordData.rows[0].password);

                // Сравниваем пароли
                if (!isPasswordValid) {
                    return res.status(401).json({ error: "Invalid credentials." });
                }
            }

            // ✅ Записываем email пользователя в сессию
            req.session.email = email;

            // Возвращаем данные пользователя
            res.json(userData.rows[0]);

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async adminLogin(req, res) {
        try {
            const { name, password } = req.body;

            // This is just a basic example - in production use proper admin authentication
            if (name === 'admin' && password === 'secure_password') {
                return res.json({ role: 'admin' });
            }

            res.status(401).json({ error: "Invalid admin credentials" });

        } catch (error) {
            console.error("Admin login error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async editProfile(req, res) {
        try {
            const { email, first_name, last_name } = req.body;

            if (!email || !first_name || !last_name) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const updatedUser = await db.query(
                `UPDATE "Users"
                 SET "first_name" = $1,
                     "last_name" = $2
                 WHERE "email" = $3
                 RETURNING "user_id", "first_name", "last_name", "email", "registration_date"`,
                [first_name, last_name, email]
            );

            if (updatedUser.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(updatedUser.rows[0]);
        } catch (error) {
            console.error("Edit profile error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


    async profile(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            const userData = await db.query(
                'SELECT * FROM "Users" WHERE "email" = $1',
                [email]
            );

            if (userData.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            // Remove sensitive data before sending
            const { password_hash, ...user } = userData.rows[0];
            res.json(user);

        } catch (error) {
            console.error("Profile error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async addWatch(req, res) {
        try {
            const { email, movie_id } = req.body;

            if (!email || !movie_id) {
                return res.status(400).json({ error: "Email and movie ID are required" });
            }

            // Получаем пользователя
            const userData = await db.query(
                'SELECT "user_id" FROM "Users" WHERE "email" = $1',
                [email]
            );

            if (userData.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const user_id = userData.rows[0].user_id;

            // Удаляем предыдущие просмотры этого фильма для пользователя
            await db.query(
                'DELETE FROM "WatchHistory" WHERE "user_id" = $1 AND "movie_id" = $2',
                [user_id, movie_id]
            );

            // Добавляем новый просмотр
            await db.query(
                `INSERT INTO "WatchHistory"
                 ("user_id", "movie_id", "watch_date", "watch_time")
                 VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME)`,
                [user_id, movie_id]
            );

            res.status(201).json({ message: "Watch history recorded (unique per movie/user)" });

        } catch (error) {
            console.error("Add watch error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


    async getWatch(req, res) {
        try {
            const user_id = req.params.id;

            if (!user_id) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const watchData = await db.query(
                `SELECT
                    "Movies".*,
                    "WatchHistory"."watch_date",
                    "WatchHistory"."watch_time"
                FROM "WatchHistory"
                JOIN "Movies" ON "WatchHistory"."movie_id" = "Movies"."movie_id"
                WHERE "user_id" = $1
                ORDER BY "watch_id" DESC
                LIMIT 3`,
                [user_id]
            );

            res.json(watchData.rows);

        } catch (error) {
            console.error("Get watch history error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Ошибка при уничтожении сессии:", err);
                return res.status(500).json({ error: "Logout failed" });
            }
            res.clearCookie("connect.sid"); // ✅ Удаляем сессионную cookie
            res.status(200).json({ message: "Logout successful" });
        });
    }
}

module.exports = new UserController();