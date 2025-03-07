const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const activityController = require('../controllers/activityController'); // Importe o controlador corretamente
const router = express.Router();

// Rota para criar atividade (somente administrador)
router.post('/', authMiddleware, isAdmin, activityController.createActivity);

// Rota para listar todas as atividades
router.get('/', authMiddleware, activityController.getAllActivities);

// Rota para inscrever-se em uma atividade
router.post('/:activityId/register', authMiddleware, activityController.registerInActivity);

// Rota para cancelar inscrição em uma atividade
router.delete('/:activityId/cancel', authMiddleware, activityController.cancelRegistration);

// Rota para editar atividade (somente administrador)
router.put('/:activityId', authMiddleware, isAdmin, activityController.editActivity);

// Rota para excluir atividade (somente administrador)
router.delete('/:activityId', authMiddleware, isAdmin, activityController.deleteActivity);

module.exports = router;