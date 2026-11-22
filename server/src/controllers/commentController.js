const db = require('../config/db');

exports.getAllComments = async (req, res) => {
    try {
        const [comments] = await db.query('SELECT * FROM project_comments ORDER BY created_at DESC');
        res.json({ comments });
    } catch (err) {
        console.error('Get comments error:', err);
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
};

exports.createComment = async (req, res) => {
    const { resident_name, message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message cannot be empty.' });
    }
    try {
        await db.query(
            'INSERT INTO project_comments (resident_name, message) VALUES (?, ?)',
            [resident_name || 'Anonymous Resident', message]
        );
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (err) {
        console.error('Create comment error:', err);
        res.status(500).json({ message: 'Failed to submit report.' });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT resident_name FROM project_comments WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        await db.query('DELETE FROM project_comments WHERE id = ?', [id]);

        await db.query(
            'INSERT INTO audit_logs (action_type, description, performed_by) VALUES (?, ?, ?)',
            [
                'DELETE',
                `Moderated/deleted spam comment from: ${rows[0].resident_name || 'Anonymous'}`,
                req.admin?.admin_name || 'Admin'
            ]
        );

        res.json({ message: 'Comment deleted successfully.' });
    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
};
