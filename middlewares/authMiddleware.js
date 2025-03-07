const jwt = require("jsonwebtoken");

// Middleware para autenticação com JWT
const authMiddleware = (req, res, next) => {
    // Extrai o token do cabeçalho da requisição
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Verifica se o token existe
    if (!token) {
        return res.status(401).json({ message: "Acesso não autorizado, autenticação necessária" });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona o usuário decodificado à requisição
        next(); // Passa para o próximo middleware ou rota
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Somente administradores podem realizar esta ação.' });
    }
    next(); // Passa para o próximo middleware ou rota
};

// Exporta os middlewares
module.exports = { authMiddleware, isAdmin };