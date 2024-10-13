const db = require("../db");
const bcrypt = require('bcrypt')

class  userController{
    async registration(req, res){
        try {
            const {email, password} = res.body;
            const hashpassword = await bcrypt.hash(password, 5);
            res.json({email});
        }catch (error){

        }
    }
    async login(req, res){
        try{
            const {email, password} = res.body;
            const userData = await db.query(`SELECT * FROM "Пользователи" WHERE "электронная_почта" == $1`,[email]);
            if (userData.rows[0].email != await db.query(`SELECT "электронная_почта" FROM "Пользователи" WHERE "электронная_почта" == $1`,[email])){
                return;
            }
            const hashpassword = await bcrypt.hash(password, 5);
            if (hashpassword != await db.query(`SELECT "пароль" FROM "Пароли" WHERE "id_пользователя" == $1`, [userData.rows[0].id_пользователя])){
                return;
            }
            res.json(userData.rows[0])
        }catch (error) {

        }
    }
}