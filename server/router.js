const Router = require('express').Router;
const filmsController = require("./controllers/filmsController")
const userController = require("./controllers/userController")
const router = new Router();

router.get("/films", filmsController.getFilms);
router.get("/films/:id", filmsController.getFilm);
router.get("/reviews/:id", filmsController.getReviews)
router.post("/auth", userController.login);
router.post("/registration", userController.registration);

module.exports = router;