const express = require('express');
const AuthController = require('../controllers/authController'); // Importe o controlador corretamente
const router = express.Router();

// Rota para registro de usuário
router.post('/register', AuthController.register);

// Rota para login de usuário
router.post('/login', AuthController.login);

module.exports = router;