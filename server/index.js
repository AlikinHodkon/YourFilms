const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./router");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db"); // 🔹 Подключение к PostgreSQL

const app = express();

// ✅ Сессии теперь хранятся в PostgreSQL
app.use(session({
    store: new pgSession({ pool, tableName: "session" }),
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // ⚠️ true только для HTTPS
        maxAge: 4 * 60 * 60 * 1000 // ✅ 4 часа
    }
}));

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // ✅ Передача cookie для сессий
}));
app.use("/api", router);

// ✅ Поддержка загрузки изображений
app.use("/images", express.static(path.join(__dirname, "public/images")));

const start = () => {
    app.listen(5000, () => console.log("✅ Server started on port 5000"));
};

start();
