const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const token = req.header.authorization;

    if(!token) {
        return res.status(401).json({ message: "Acesso não autorizado, token ausente" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Token inválido");
        }
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;