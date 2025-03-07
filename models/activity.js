const { db, getAllData, addData, getData } = require('../database/rocksdb');

class Activity {
  // Cria atividade
  static async create(title, description, date, location, maxParticipants) {
    const activity = { title, description, date, location, maxParticipants, participants: [] };
    addData(title, JSON.stringify(activity));
    return activity;
  }

  // Obtém todas as atividades
  static async getAll() {
    return await getAllData();
  }

  // Obtém uma atividade pelo ID (neste caso, o título)
  static async getById(activityId) {
    return new Promise((resolve, reject) => {
      getData(activityId, (err, value) => {
        if (err) reject(err);
        resolve(value ? JSON.parse(value) : null);
      });
    });
  }
}

module.exports = Activity;