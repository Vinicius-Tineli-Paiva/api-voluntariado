require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

//Inicializa Middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static("frontend"))

//Gerenciamento de rotas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));

//Inicializacao do servidor
app.listen(port, function () {
    console.log(`Rodando em ${port}`);
})