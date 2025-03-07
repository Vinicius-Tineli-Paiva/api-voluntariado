const jwt = require("jsonwebtoken");
const { addData, getData } = require('../database/rocksdb');
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET;

class AuthController {
    // Função de registro de usuário
    static async register(req, res) {
        const { name, email, password, isAdmin } = req.body;

        // Valida se os campos obrigatórios estão presentes
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        try {
            // Verifica se o usuário já existe no banco
            const existingUser = await getData(email);
            if (existingUser !== null) {
                return res.status(400).json({ message: 'E-mail já cadastrado' });
            }

            // Criptografa a senha do usuário
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cria o objeto do usuário
            const user = {
                name,
                email,
                password: hashedPassword,
                isAdmin: isAdmin || false,
            };

            // Adiciona o usuário ao banco de dados
            await addData(email, JSON.stringify(user));  // Agora aguardamos a Promise

            console.log(`Usuário ${email} registrado no banco de dados`);
            res.status(201).json({ message: 'Usuário registrado com sucesso!' });

        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message });
        }
    }

    // Função de login de usuário
    static async login(req, res) {
        const { email, password } = req.body;

        // Valida se os campos obrigatórios estão presentes
        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
        }

        try {
            // Verifica se o usuário existe no banco de dados
            const userData = await getData(email);

            // Se o usuário não foi encontrado
            if (!userData) {
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }

            const user = JSON.parse(userData);

            // Verifica se a senha está correta
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Senha incorreta' });
            }

            // Cria o token JWT
            const token = jwt.sign({ id: email, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: 'Login realizado com sucesso!', token });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            res.status(500).json({ message: 'Erro ao realizar login, tente novamente' });
        }
    }
}

module.exports = AuthController;