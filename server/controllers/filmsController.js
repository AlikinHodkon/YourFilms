const db = require("../db");
const bcrypt = require('bcrypt');

class filmsController{
    async getFilms(req, res){
        try{
            const films = await db.query('SELECT * FROM "Фильмы"');
            let passwords = [
                'abcd', '1234', 'pass', 'word', 'qwer',
                'asdf', 'zxcv', '0987', '5678', 'home',
                'base', 'test', 'lock', 'open', 'safe'
            ]
            passwords.forEach((password) => bcrypt.hash(password, 5).then((responde) => console.log(responde)));
            res.json(films.rows);
        }catch (error){

        }
    }
}

module.exports = new filmsController();