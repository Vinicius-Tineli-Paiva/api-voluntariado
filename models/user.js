const bcrypt = require("bcrypt");
const { addData, getData } = require("../database/rocksdb");

class User {
    // Cria um novo usuário
    static async create(email, password, role = "user") {
        try {
            console.log(`Criando usuário: ${email}`);

            // Criptografa a senha
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Senha criptografada:', hashedPassword);

            // Cria o objeto do usuário
            const user = { email, password: hashedPassword, role };

            // Salva o usuário no banco de dados
            await addData(`user:${email}`, JSON.stringify(user));
            console.log(`Usuário salvo no banco de dados: ${email}`);

            return user;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    // Busca um usuário pelo e-mail
    static async findByEmail(email) {
        try {
            console.log(`Buscando usuário: ${email}`);
            const user = await getData(`user:${email}`);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            if (error.message.includes('NotFound')) {
                console.log('Usuário não encontrado:', email);
                return null;
            }
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }
}

module.exports = User;