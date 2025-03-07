const { addData, getData } = require('../database/rocksdb');

class ActivityController {
  static async createActivity(req, res) {
    const { title, description, date, location, maxParticipants } = req.body;

    if (!title || !description || !date || !location || !maxParticipants) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const activity = {
      title,
      description,
      date,
      location,
      maxParticipants,
      participants: []
    };

    addData(title, JSON.stringify(activity));
    res.status(201).json({ message: 'Atividade criada com sucesso!' });
  }

  static async getAllActivities(req, res) {
    // Aqui, precisaremos buscar todas as atividades do banco de dados
    // Simulação: Retornando atividades estáticas (substituir com lógica do RocksDB)
    res.json([{ title: "Atividade 1" }, { title: "Atividade 2" }]);
  }
}

module.exports = ActivityController;