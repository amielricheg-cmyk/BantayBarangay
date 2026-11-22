const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.get('/all', commentController.getAllComments);
router.post('/', commentController.createComment);
router.delete('/:id', verifyAdminToken, commentController.deleteComment);

module.exports = router;
