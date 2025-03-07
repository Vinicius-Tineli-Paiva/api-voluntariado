const jwt = require("jsonwebtoken");
const { addData, getData } = require('../database/rocksdb');
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET;

class AuthController {
    static async register(req, res) {
      const { name, email, password, isAdmin } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
  
      getData(email, async (existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: 'E-mail já cadastrado' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = {
          name,
          email,
          password: hashedPassword,
          isAdmin: isAdmin || false,
        };
  
        addData(email, JSON.stringify(user));
  
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      });
    }
  
    static async login(req, res) {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
      }
  
      getData(email, async (userData) => {
        if (!userData) {
          return res.status(400).json({ message: 'Usuário não encontrado' });
        }
  
        const user = JSON.parse(userData);
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Senha incorreta' });
        }
  
        const token = jwt.sign({ id: email, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });
  
        res.json({ message: 'Login realizado com sucesso!', token });
      });
    }
  }
  
  module.exports = AuthController;