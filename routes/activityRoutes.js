const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const activityController = require('../controllers/activityController');

// Rotas de atividades
router.post('/', authMiddleware, activityController.createActivity); // Criar atividade (Administrador)
router.get('/', authMiddleware, activityController.getAllActivities); // Listar atividades
router.post('/:activityId/register', authMiddleware, activityController.registerUserForActivity); // Inscrever usuário
router.post('/:activityId/cancel', authMiddleware, activityController.cancelUserRegistration); // Cancelar inscrição

module.exports = router;