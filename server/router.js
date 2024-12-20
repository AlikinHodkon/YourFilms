const Router = require('express').Router;
const filmsController = require("./controllers/filmsController")
const userController = require("./controllers/userController")
const router = new Router();

router.get("/films", filmsController.getFilms);
router.get("/films/:id", filmsController.getFilm);
router.get("/reviews/:id", filmsController.getReviews);
router.get("/genres", filmsController.getGenres);
router.get("/directors", filmsController.getDirectors);
router.get("/watch/:id", userController.getWatch);
router.post("/profile", userController.profile);
router.post("/auth", userController.login);
router.post("/admin", userController.adminLogin);
router.post("/registration", userController.registration);
router.post("/reviews", filmsController.addReview);
router.post("/films", filmsController.addFilm);
router.post("/watch", userController.addWatch);
router.delete("/films/:id",filmsController.deleteFilm);
router.delete("/reviews/:id", filmsController.deleteReview);

module.exports = router;