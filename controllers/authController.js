const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.JWT_SECRET;

class AuthController {
    // Registra um novo usuário
    static async register(req, res) {
        const { name, email, password, isAdmin } = req.body;

        // Valida se todos os campos foram fornecidos
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        try {
            console.log(`Tentando registrar usuário: ${email}`);
            console.log('Senha fornecida durante o registro:', password);

            // Remove espaços em branco da senha
            const trimmedPassword = password.trim();
            console.log('Senha após trim:', trimmedPassword);

            // Verifica se o e-mail já está cadastrado
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                console.log('E-mail já cadastrado:', email);
                return res.status(400).json({ message: 'E-mail já cadastrado' });
            }

            // Define a role do usuário
            const role = isAdmin ? 'admin' : 'user';

            // Cria o usuário (sem criptografar a senha aqui!)
            const user = await User.create(email, trimmedPassword, role);
            console.log('Usuário criado com sucesso:', user);

            res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            res.status(500).json({ message: 'Erro ao conectar com o banco de dados' });
        }
    }

    // Faz o login do usuário
    static async login(req, res) {
        const { email, password } = req.body;

        // Valida se o e-mail e a senha foram fornecidos
        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
        }

        try {
            console.log(`Tentando fazer login com o e-mail: ${email}`);

            // Busca o usuário pelo e-mail
            const user = await User.findByEmail(email);
            if (!user) {
                console.log('Usuário não encontrado:', email);
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }

            console.log('Usuário encontrado:', user);

            // Remove espaços em branco da senha fornecida
            const trimmedPassword = password.trim();
            console.log('Senha fornecida após trim:', trimmedPassword);

            // Verifica se a senha está correta (usando bcrypt)
            console.log('Comparando senhas...');
            console.log('Senha fornecida:', trimmedPassword);
            console.log('Senha criptografada no banco:', user.password);

            const isMatch = await bcrypt.compare(trimmedPassword, user.password);
            console.log('Resultado da comparação:', isMatch);

            if (!isMatch) {
                console.log('Senha incorreta para o usuário:', email);
                return res.status(400).json({ message: 'Senha incorreta' });
            }

            // Gera o token JWT
            const token = jwt.sign({ id: email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            console.log('Login realizado com sucesso para o usuário:', email);

            res.json({ message: 'Login realizado com sucesso!', token, role: user.role });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            res.status(500).json({ message: 'Erro ao realizar login, tente novamente' });
        }
    }
}

module.exports = AuthController;