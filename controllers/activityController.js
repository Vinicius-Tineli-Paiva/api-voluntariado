const Activity = require('../models/activity.js');
const db = require('../database/rocksdb');

// Cria atividade
exports.createActivity = async (req, res) => {
  const { title, description, date, location, maxParticipants } = req.body;

  if (!title || !description || !date || !location || !maxParticipants) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const activity = await Activity.create(title, description, date, location, maxParticipants);
  res.status(201).json(activity);
};

// Lista todas as atividades
exports.getAllActivities = async (req, res) => {
  const activities = await Activity.getAll();
  res.status(200).json(activities);
};

// Inscreve usuário em uma atividade
exports.registerUserForActivity = async (req, res) => {
  const { activityId } = req.params;

  // Verifica se a atividade existe
  const activity = await Activity.getById(activityId);
  if (!activity) {
    return res.status(404).json({ message: 'Atividade não encontrada.' });
  }

  // Verifica se a atividade já atingiu o número máximo de participantes
  if (activity.participants.length >= activity.maxParticipants) {
    return res.status(400).json({ message: 'Não há mais vagas para essa atividade.' });
  }

  // Inscreve o usuário
  const userId = req.user.id; 
  activity.participants.push(userId);
  
  await Activity.update(activityId, activity);
  res.status(200).json({ message: 'Inscrição realizada com sucesso!' });
};

// Cancela inscrição de um usuário
exports.cancelUserRegistration = async (req, res) => {
  const { activityId } = req.params;

  // Verifica se a atividade existe
  const activity = await Activity.getById(activityId);
  if (!activity) {
    return res.status(404).json({ error: 'Atividade não encontrada.' });
  }

  // Verifica se o usuário está inscrito na atividade
  const userId = req.user.id; 
  const index = activity.participants.indexOf(userId);

  if (index === -1) {
    return res.status(400).json({ error: 'Você não está inscrito nesta atividade.' });
  }

  // Cancela inscrição
  activity.participants.splice(index, 1);
  await Activity.update(activityId, activity);

  res.status(200).json({ message: 'Inscrição cancelada com sucesso!' });
};
