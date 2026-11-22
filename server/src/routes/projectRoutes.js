const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.get('/', projectController.getProjects);
router.get('/logs', projectController.getSystemLogs);
router.post('/', verifyAdminToken, projectController.createProject);
router.put('/:id', verifyAdminToken, projectController.updateProject);
router.delete('/:id', verifyAdminToken, projectController.deleteProject);

module.exports = router;
