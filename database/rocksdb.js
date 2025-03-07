const rocksdb = require("rocksdb");
const path = require("path");

//Caminho para o banco de dados
const dbPath = path.join(__dirname, "voluntariado.db");

//Inicializa o banco de dados 
const db = rocksdb(dbPath);

//Abre o banco de dados
db.open((err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados", err);
        return;
    }
    console.log("Banco de dados aberto");
});

//Adicionar dados
db.addData = (key, value) => {
    db.put(key, value, (err) => {
      if (err) console.error('Erro ao adicionar dados:', err);
    });
  };

//Buscar dados
db.getData = (key, callback) => {
    db.get(key, (err, value) => {
      if (err) {
        if (err.notFound) return callback(null);
        console.error('Erro ao buscar dados:', err);
        return;
      }
      callback(value.toString());
    });
};

// Obter todos os dados
db.getAllData = (callback) => {
    db.iterator({}).each((key, value) => callback(key, value));
  };

module.exports = { db }