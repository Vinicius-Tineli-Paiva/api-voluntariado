const db = require('../database/rocksdb');

class Activity {
  // Cria uma nova atividade
  static async create(title, description, date, location, maxParticipants) {
    const activity = { title, description, date, location, maxParticipants, participants: [] };
    
    // Salva a atividade no banco de dados utilizando o título como chave
    db.addData(title, JSON.stringify(activity));
    return activity;
  }

  // Método para buscar todas as atividades
  static async getAll() {
    return new Promise((resolve, reject) => {
      const activities = [];

      // Itera sobre as chaves no banco de dados e busca as atividades
      db.db.iterator({ key_as_buffer: true, value_as_buffer: true })
        .each((key, value) => {

          if (key) {
            activities.push(JSON.parse(value));
          }
        }, (err) => {
          if (err) {
            reject('Erro ao buscar atividades:', err);
          } else {
            resolve(activities);
          }
        });
    });
  }

  //Busca uma atividade específica pelo título
  static async getByTitle(title) {
    return new Promise((resolve, reject) => {
        db.getData(title, (value) => {
            if(value) {
                resolve(JSON.parse(value));
            }
        });
    });
  }
}

module.exports = Activity;