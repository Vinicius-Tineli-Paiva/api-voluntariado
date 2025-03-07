const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, activityController.createActivity);
router.get('/', activityController.getAllActivities);

module.exports = router;