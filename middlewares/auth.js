const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token) {
        return res.status(401).send("Acesso não autorizado");
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