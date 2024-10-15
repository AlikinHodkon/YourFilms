const db = require("../db");
const bcrypt = require('bcrypt')

class userController{
    async registration(req, res){
        try {
            const {name, surname, password, email} = req.body;
            const hashpassword = await bcrypt.hash(password, 5);
            const date = new Date().toLocaleDateString().replaceAll(".","-").split("-").reverse().join("-");
            const userData = await db.query(`SELECT * FROM "Пользователи" ORDER BY "id_пользователя" DESC`);
            await db.query(`INSERT INTO "Пользователи" VALUES($1,$2,$3,$4,$5)`, [userData.rows[0].id_пользователя, name, surname, email, date]);
            await db.query(`INSERT INTO "Пароль" VALUES($1,$2)`, [userData.rows[0].id_пользователя, hashpassword]);
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
            const hashpassword = await bcrypt.hash(password, 5);
            const passwordData = await db.query(`SELECT "пароль" FROM "Пароли" WHERE "id_пользователя" = $1`, [userData.rows[0].id_пользователя]);
            if (hashpassword !== passwordData.rows[0].пароль){
                return;
            }
            res.json(userData.rows[0])
        }catch (error) {

        }
    }
}

module.exports = new userController();