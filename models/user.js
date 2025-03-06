const bcrypt = require("bcryptjs");
const db = require("../database/rocksdb.js");

class User {
    static async create(email, password) {
        const hash = await bcrypt.hash(password, 10);
        const user = { email, password: hash };

        //Salvar no banco de dados
        db.addData(email, JSON.stringify(user));
        return user;
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.getData(email, (value) => {
                if(value) {
                    resolve(JSON.parse(value));
                } else {
                    reject("Usuário não encontrado");
                }
            });
        });
    }
}

module.exports = User;