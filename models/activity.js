const db = require('../database/rocksdb');

class Activity {
  // Cria uma nova atividade
  static async create(title, description, date, location, maxParticipants) {
    const activity = { title, description, date, location, maxParticipants, participants: [] };
    
    // Salva a atividade no banco de dados utilizando o título como chave
    await db.addData(title, JSON.stringify(activity));
    return activity;
  }

  // Método para buscar todas as atividades
  static async getAll() {
    return new Promise((resolve, reject) => {
        const activities = [];
        const iterator = db.db.iterator(); // Criamos um iterador

        function next() {
            iterator.next((err, key, value) => {
                if (err) {
                    reject("Erro ao buscar atividades: " + err);
                    return;
                }

                // Se não houver mais chaves, encerramos e resolvemos a Promise
                if (key === undefined) {
                    resolve(activities);
                    return;
                }

                // Adicionamos a atividade à lista
                activities.push(JSON.parse(value));

                // Chamamos `next()` recursivamente para buscar o próximo item
                next();
            });
        }
        next(); 
    });
  }

  //Busca uma atividade específica pelo título
  static async getByTitle(title) {
    return new Promise((resolve, reject) => {
        db.getData(title, (value) => {
            if(value) {
                resolve(JSON.parse(value));
            } else {
                reject("Atividade não encontrada");
            }
        });
    });
  }
}

module.exports = Activity;