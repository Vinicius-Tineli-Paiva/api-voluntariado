const bcrypt = require("bcryptjs");
const db = require("../database/rocksdb.js");

class User {
    static async create(email, password, role= "user") {
        const hash = await bcrypt.hash(password, 10);
        const user = { email, password: hash, role };

        //Salvar no banco de dados
        await db.addData(`user:${email}`, JSON.stringify(user));
        return user;
    }

    static async findByEmail(email) {
        const user = await db.getData(`user:${email}`);
        return user ? JSON.parse(user) : null;
    }
}

module.exports = User;