const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const activityController = require('../controllers/activityController');

// Rotas de atividades
router.post('/', authMiddleware, activityController.createActivity); // Criar atividade (Admin)
router.get('/', activityController.getAllActivities); // Listar atividades
router.post('/:activityId/register', authMiddleware, activityController.registerInActivity); // Inscrever usuário
router.delete('/:activityId/register', authMiddleware, activityController.cancelRegistration); // Cancelar inscrição
router.put("/:activityId", authMiddleware, activityController.editActivity); // Editar atividade (Admin)
router.delete("/:activityId", authMiddleware, activityController.deleteActivity); // Remover atividade (Admin)

module.exports = router;