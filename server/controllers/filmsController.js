const db = require("../db");
const bcrypt = require('bcrypt');

class filmsController{
    async getFilms(req, res){
        try{
            const films = await db.query('SELECT * FROM "Фильмы"');
            res.json(films.rows);
        }catch (error){

        }
    }
}

module.exports = new filmsController();