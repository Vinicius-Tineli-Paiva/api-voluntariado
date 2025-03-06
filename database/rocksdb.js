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
function addData (key, value) {
    db.put(key, value, (err) => {
        if (err) {
            console.error("Erro ao adicionar dados: ", err);
        } else {
            console.log("Dados adicionados com sucesso");
        }
    }); 
}

//Buscar dados
function getData (key, callback) {
    db.get (key, (err,value) => {
        if (err) {
            console.error("Erro ao buscar dados: ", err);
        } else {
            callback(value);
        }
    });
}

//Excluir dados
function deleteData (key) {
    db.del(key, (err) => {
        if (err) {
            console.error("Erro ao excluir dados", err);
        } else {
            console.log("Dados excluídos com sucesso");
        }
    });
}

module.exports = { db, addData, getData, deleteData }