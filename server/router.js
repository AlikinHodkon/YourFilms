const express = require("express");
const { filmsController, upload } = require("./controllers/filmsController");
const userController = require("./controllers/userController");
const directorsController = require("./controllers/directorsController");
const genresController = require("./controllers/genresController");
const checkAdmin = require("./middlewares/checkAdminMiddleware"); // ✅ Добавляем middleware

const router = express.Router();

// 🔹 Маршрут для выхода (очистка сессии)
router.post("/logout", userController.logout);

// 🔹 Маршруты для проверки админа
router.get("/admin-status", userController.adminStatus);

// 🔹 Маршруты для фильмов
router.get("/films", filmsController.getFilms);
router.get("/films/:id", filmsController.getFilm);
router.patch("/films/:id", filmsController.updateFilmField);
router.post('/films', upload.single('image'), filmsController.addFilm);
router.put("/films/:id", checkAdmin, filmsController.updateFilm);
router.delete("/films/:id", checkAdmin, filmsController.deleteFilm);
router.post("/films/:id/upload", checkAdmin, upload.single("image"), filmsController.uploadImage);

// 🔹 Маршруты для отзывов (✅ Без проверки админа)
router.get("/reviews/:id", filmsController.getReviews);
router.post("/reviews", filmsController.addReview);
router.delete("/reviews/:id", filmsController.deleteReview);

// 🔹 Маршруты для жанров
router.get("/genres", genresController.getGenres);
router.get("/genres/:id", genresController.getGenre);
router.post("/genres", checkAdmin, genresController.addGenre);
router.put("/genres/:id", checkAdmin, genresController.updateGenre);
router.delete("/genres/:id", checkAdmin, genresController.deleteGenre);

// 🔹 Маршруты для режиссёров
router.get("/directors", directorsController.getDirectors);
router.get("/directors/:id", directorsController.getDirector);
router.post("/directors", checkAdmin, directorsController.addDirector);
router.put("/directors/:id", checkAdmin, directorsController.updateDirector);
router.delete("/directors/:id", checkAdmin, directorsController.deleteDirector);

// 🔹 Маршруты для пользователей (✅ Без проверки админа)
router.get("/watch/:id", userController.getWatch);
router.post("/profile", userController.profile);
router.post("/auth", userController.login);
router.post("/admin", userController.adminLogin);
router.post("/registration", userController.registration);
router.post("/watch", userController.addWatch);

module.exports = router;