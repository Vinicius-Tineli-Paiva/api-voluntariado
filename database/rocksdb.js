const rocksdb = require("rocksdb");
const path = require("path");

// Caminho para o banco de dados
const dbPath = path.join(__dirname, "voluntariado.db");

// Inicializa o banco de dados 
const db = rocksdb(dbPath);

// Abre o banco de dados
db.open((err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados", err);
        return;
    }
    console.log("Banco de dados aberto");
});

// Métodos do banco de dados
const addData = (key, value) => {
    return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
            if (err) {
                console.error('Erro ao adicionar dados:', err);
                reject(err); // rejeita a Promise em caso de erro
            } else {
                resolve(); // resolve a Promise se a inserção for bem-sucedida
            }
        });
    });
};

const getData = (key) => {
    return new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
            if (err) {
                if (err.notFound) {
                    console.log(`Usuário com email ${key} não encontrado.`);
                    resolve(null); // Retorna null quando o usuário não é encontrado
                } else {
                    reject(err); // Erro inesperado
                }
            } else {
                console.log(`Usuário com email ${key} encontrado.`)
                resolve(value); // Retorna os dados se encontrados
            }
        });
    });
};

const getAllData = async () => {
    return new Promise((resolve, reject) => {
        const activities = [];
        const iterator = db.iterator({ keys: true, values: true });

        iterator.next(function process(err, key, value) {
            if (err) {
                reject(err);
                return;
            }

            if (!key) {
                resolve(activities);
                return;
            }

            activities.push(JSON.parse(value.toString()));
            iterator.next(process);
        });
    });
};

module.exports = { db, addData, getData, getAllData };