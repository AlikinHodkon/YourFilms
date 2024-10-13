const Router = require('express').Router;
const filmsController = require("./controllers/filmsController")
const router = new Router();

router.get("/films", filmsController.getFilms);

module.exports = router;