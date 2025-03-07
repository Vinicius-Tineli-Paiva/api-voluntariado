require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

// Middlewares globais
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(cookieParser()); 

app.use(express.static("frontend"));

// Rotas da API
app.use("/api/auth", require("./routes/authRoutes")); // Rotas de autenticação
app.use("/api/activities", require("./routes/activityRoutes")); // Rotas de atividades

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});