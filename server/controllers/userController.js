const db = require("../db");
const bcrypt = require('bcrypt')
const {compare} = require("bcrypt");

class userController{
    async registration(req, res){
        try {
            const {name, surname, password, email} = req.body;
            const salt = await bcrypt.genSalt(5);
            const hashpassword = await bcrypt.hash(password, salt);
            const date = new Date().toLocaleDateString().replaceAll(".","-").split("-").reverse().join("-");
            await db.query(`INSERT INTO "Пользователи" ("имя",  "фамилия", "электронная_почта", "дата_регистрации") VALUES($1,$2,$3,$4)`, [name, surname, email, date]);
            await db.query(`INSERT INTO "Пароли" ("пароль") VALUES($1)`, [hashpassword]);
            res.json({name, surname, email});
        }catch (error){

        }
    }
    async login(req, res){
        try{
            const {email, password} = req.body;
            const userData = await db.query(`SELECT * FROM "Пользователи" WHERE "электронная_почта" = $1`,[email]);
            if (!userData){
                return;
            }
            const passwordData = await db.query(`SELECT "пароль" FROM "Пароли" WHERE "id_пользователя" = $1`, [userData.rows[0].id_пользователя]);
            if (!bcrypt.compare(password, passwordData.rows[0].пароль)){
                return;
            }
            res.json(userData.rows[0])
        }catch (error) {

        }
    }
    async adminLogin(req, res){
        try{
            const {name, password} = req.body;
            if (name === 'root' && password === 'root') res.json('root');
        }catch (error){

        }
    }
    async profile(req, res){
        try {
            const {email} = req.body;
            const userData = await db.query(`SELECT * FROM "Пользователи" WHERE "электронная_почта" = $1`,[email]);
            res.json(userData.rows[0]);
        }catch (error) {
            
        }
    }
}

module.exports = new userController();