require("dotenv").config(); // Carrega variáveis de ambiente
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

// Middlewares globais
app.use(helmet()); // Segurança básica
app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Habilita o uso de JSON nas requisições
app.use(cookieParser()); // Habilita o uso de cookies

// Serve arquivos estáticos do front-end
app.use(express.static("frontend"));

// Rotas da API
app.use("/api/auth", require("./routes/authRoutes")); // Rotas de autenticação
app.use("/api/activities", require("./routes/activityRoutes")); // Rotas de atividades

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});