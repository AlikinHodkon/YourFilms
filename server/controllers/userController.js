const db = require("../db");
const bcrypt = require('bcrypt');

class UserController {
    async registration(req, res) {
        try {
            const { name, surname, password, email } = req.body;

            if (!name || !surname || !password || !email) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const existingUser = await db.query('SELECT * FROM "Users" WHERE "email" = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: "User already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = await db.query(
                `INSERT INTO "Users" 
                ("first_name", "last_name", "email", "registration_date") 
                VALUES($1, $2, $3, CURRENT_DATE) 
                RETURNING *`, 
                [name, surname, email]
            );

            await db.query(
                `INSERT INTO "Passwords" 
                ("user_id", "password") 
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

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            console.log(email);
            
            const userData = await db.query(
                'SELECT "user_id", "first_name", "last_name", "email" FROM "Users" WHERE "email" = $1',
                [email]
            );

            if (userData.rows.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }


            const passwordData = await db.query(
                'SELECT "password" FROM "Passwords" WHERE "user_id" = $1',
                [userData.rows[0].user_id]
            );

            if (passwordData.rows.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isValidPassword = await bcrypt.compare(
                password, 
                passwordData.rows[0].password
            )

            if (!isValidPassword) {
                return res.status(401).json({
                    error: `Invalid credentials.`
                });
            }

            res.json(userData.rows[0]);

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async adminLogin(req, res) {
        try {
            const { name, password } = req.body;
            
            if (name === 'admin' && password === 'root') {
                return res.json({ role: 'admin' });
            }
            
            res.status(401).json({ error: "Invalid admin credentials" });

        } catch (error) {
            console.error("Admin login error:", error);
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

            res.json(userData.rows[0]);

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

            const userData = await db.query(
                'SELECT "user_id" FROM "Users" WHERE "email" = $1', 
                [email]
            );

            if (userData.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            await db.query(
                `INSERT INTO "WatchHistory" 
                ("user_id", "movie_id", "watch_date", "watch_time") 
                VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME)`, 
                [userData.rows[0].user_id, movie_id]
            );

            res.status(201).json({ message: "Watch history recorded" });

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
}

module.exports = new UserController();