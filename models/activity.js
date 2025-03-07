const db = require('../database/rocksdb');
const path = require('path');

// Inicializa o banco de dados e a tabela de atividades
const activitiesTable = 'activities';

// Cria atividade
class Activity {
  static async create(title, description, date, location, maxParticipants) {
    const activity = {
      title,
      description,
      date,
      location,
      maxParticipants,
      participants: [],
    };

    // Salva no banco de dados
    const activityId = `${Date.now()}`;
    db.addData(activityId, JSON.stringify(activity));
    return { id: activityId, ...activity };
  }

  // Lista todas as atividades
  static async getAll() {
    const activities = await db.getAll(activitiesTable);
    return activities;
  }

  // Busca atividade por ID
  static async getById(activityId) {
    const activity = await db.getData(activityId);
    return activity ? JSON.parse(activity) : null;
  }

  // Atualiza atividade
  static async update(activityId, updatedActivity) {
    db.addData(activityId, JSON.stringify(updatedActivity));
    return updatedActivity;
  }
}

module.exports = Activity;