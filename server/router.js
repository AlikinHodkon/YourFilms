const express = require("express");
const { filmsController, upload } = require("./controllers/filmsController");
const userController = require("./controllers/userController");
const directorsController = require("./controllers/directorsController");
const genresController = require("./controllers/genresController");

const router = express.Router();

// Маршруты для фильмов
router.get("/films", filmsController.getFilms);
router.get("/films/:id", filmsController.getFilm);
router.patch("/films/:id", filmsController.updateFilmField);
router.post('/films', upload.single('image'), filmsController.addFilm);
router.put("/films/:id", filmsController.updateFilm);
router.delete("/films/:id", filmsController.deleteFilm);

// Маршруты для отзывов
router.get("/reviews/:id", filmsController.getReviews);
router.post("/reviews", filmsController.addReview);
router.delete("/reviews/:id", filmsController.deleteReview);

// Маршруты для жанров
router.get("/genres", genresController.getGenres);
router.get("/genres/:id", genresController.getGenre);
router.post("/genres", genresController.addGenre);
router.put("/genres/:id", genresController.updateGenre);
router.delete("/genres/:id", genresController.deleteGenre);

// Маршруты для режиссеров
router.get("/directors", directorsController.getDirectors);
router.get("/directors/:id", directorsController.getDirector);
router.post("/directors", directorsController.addDirector);
router.put("/directors/:id", directorsController.updateDirector);
router.delete("/directors/:id", directorsController.deleteDirector);

// Маршруты для пользователей
router.get("/watch/:id", userController.getWatch);
router.post("/profile", userController.profile);
router.post("/auth", userController.login);
router.post("/admin", userController.adminLogin);
router.post("/registration", userController.registration);
router.post("/watch", userController.addWatch);

module.exports = router;
