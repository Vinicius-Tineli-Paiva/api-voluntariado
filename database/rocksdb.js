const RocksDB = require('rocksdb');
const path = require('path');

const dbPath = path.join(__dirname, 'volunteer_db');
const db = new RocksDB(dbPath);

// Abre o banco de dados (cria se não existir)
db.open({ createIfMissing: true }, (err) => {
    if (err) console.error('Erro ao abrir o banco de dados:', err);
    else console.log('Banco de dados aberto com sucesso.');
});

// Função para adicionar dados ao banco de dados
const addData = (key, value) => {
    return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
            if (err) {
                console.error('Erro ao adicionar dados:', err);
                reject(err);
            } else {
                console.log(`Dados adicionados com sucesso: ${key}`);
                resolve();
            }
        });
    });
};

// Função para buscar dados no banco de dados
const getData = (key) => {
    return new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
            if (err) {
                if (err.message.includes('NotFound')) {
                    console.log('Chave não encontrada:', key);
                    resolve(null); // Retorna null se a chave não for encontrada
                } else {
                    console.error('Erro ao buscar dados:', err);
                    reject(err);
                }
            } else {
                resolve(value);
            }
        });
    });
};

// Exporta as funções para uso em outros arquivos
module.exports = { db, addData, getData };