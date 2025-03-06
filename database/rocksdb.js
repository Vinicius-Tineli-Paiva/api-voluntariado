const rocksdb = require("rocksdb");
const path = require("path");

//Caminho para o banco de dados
const dbPath = path.join(__dirname, "voluntariado.db");

//Inicializa o banco de dados 
const db = rocksdb(dbPath);