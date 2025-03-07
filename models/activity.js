const db = require('../database/rocksdb');

class Activity {
  // Cria atividade
  static async create(title, description, date, location, maxParticipants) {
    const activity = { title, description, date, location, maxParticipants, participants: [] };
    db.addData(title, JSON.stringify(activity));
    return activity;
  }

  // Obtém todas as atividades
  static async getAll() {
    const activities = [];
    db.getAllData((key, value) => {
      activities.push(JSON.parse(value));
    });
    return activities;
  }

  // Obtém uma atividade pelo ID (neste caso, o título)
  static async getById(activityId) {
    return new Promise((resolve, reject) => {
      db.getData(activityId, (err, value) => {
        if (err) reject(err);
        resolve(value ? JSON.parse(value) : null);
      });
    });
  }

  // Atualiza uma atividade
  static async update(activityId, updatedActivity) {
    db.addData(activityId, JSON.stringify(updatedActivity));
    return updatedActivity;
  }

  // Remove uma atividade
  static async remove(activityId) {
    db.deleteData(activityId);
  }

  // Busca atividade pelo título
  static async getByTitle(title) {
    return new Promise((resolve, reject) => {
      db.getData(title, (err, value) => {
        if (err) reject(err);
        resolve(value ? JSON.parse(value) : null);
      });
    });
  }
}

module.exports = Activity;