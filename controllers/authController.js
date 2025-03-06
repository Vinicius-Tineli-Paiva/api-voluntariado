const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);

        if (!user || (await bcrypt.compare(password, user.password))) {
            return res.status(400).send("Credenciais inválidas");
        }

        const token = jwt.sign({ email:user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({ token });
    } catch (error) {
        res.status(400).send(error);
    } 
}

module.exports = { login };