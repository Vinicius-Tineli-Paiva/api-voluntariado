const Activity = require('../models/activity');

// Cria atividade (Admin)
exports.createActivity = async (req, res) => {
  const { title, description, date, location, maxParticipants } = req.body;

  // Verifica se a atividade já existe
  const existingActivity = await Activity.getByTitle(title);
  if (existingActivity) {
    return res.status(400).json({ message: 'Já existe uma atividade com esse título.' });
  }

  // Cria nova atividade
  const newActivity = await Activity.create(title, description, date, location, maxParticipants);
  res.status(201).json(newActivity);
};

// Listar todas as atividades
exports.getAllActivities = async (req, res) => {
  const activities = await Activity.getAll();
  res.status(200).json(activities);
};

// Inscreve em uma atividade
exports.registerInActivity = async (req, res) => {
  const { activityId } = req.params;
  const activity = await Activity.getById(activityId);

  // Verifica se a atividade existe
  if (!activity) {
    return res.status(404).json({ message: 'Atividade não encontrada.' });
  }

  // Verifica se há vagas na atividade
  if (activity.participants.length >= activity.maxParticipants) {
    return res.status(400).json({ message: 'Não há vagas disponíveis para essa atividade.' });
  }

  // Inscreve o usuário na atividade
  activity.participants.push(req.user.id);
  await Activity.update(activityId, activity);
  res.status(200).json({ message: 'Inscrição realizada com sucesso!' });
};

// Cancela inscrição em uma atividade
exports.cancelRegistration = async (req, res) => {
  const { activityId } = req.params;
  const activity = await Activity.getById(activityId);

  // Verifica se a atividade existe
  if (!activity) {
    return res.status(404).json({ message: 'Atividade não encontrada.' });
  }

  // Verifica se o usuário está inscrito na atividade
  const index = activity.participants.indexOf(req.user.id);
  if (index === -1) {
    return res.status(400).json({ message: 'Você não está inscrito nesta atividade.' });
  }

  // Cancela a inscrição
  activity.participants.splice(index, 1);
  await Activity.update(activityId, activity);
  res.status(200).json({ message: 'Inscrição cancelada com sucesso!' });
};

// Edita atividade (Admin)
exports.editActivity = async (req, res) => {
  const { activityId } = req.params;
  const { title, description, date, location, maxParticipants } = req.body;

  // Verifica se a atividade existe
  const activity = await Activity.getById(activityId);
  if (!activity) {
    return res.status(404).json({ message: 'Atividade não encontrada.' });
  }

  // Verifica se o usuário tem permissão para editar (Admin)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Somente administradores podem editar atividades.' });
  }

  // Atualiza a atividade
  const updatedActivity = {
    ...activity,
    title,
    description,
    date,
    location,
    maxParticipants,
  };

  await Activity.update(activityId, updatedActivity);
  res.status(200).json(updatedActivity);
};

// Remove atividade (Admin)
exports.deleteActivity = async (req, res) => {
  const { activityId } = req.params;

  // Verifica se a atividade existe
  const activity = await Activity.getById(activityId);
  if (!activity) {
    return res.status(404).json({ message: 'Atividade não encontrada.' });
  }

  // Verifica se o usuário tem permissão para remover (Admin)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores podem remover atividades.' });
  }

  // Remove a atividade do banco de dados
  await Activity.remove(activityId);
  res.status(200).json({ message: 'Atividade removida com sucesso.' });
};