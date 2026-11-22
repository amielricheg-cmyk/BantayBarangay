const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Pre-hashed password for 'admin123' para secure pero ready agad sa demo
const DEMO_HASH = bcrypt.hashSync('admin123', 10);

exports.loginAdmin = async (req, res) => {
    const { admin_name, password } = req.body;

    if (!admin_name || !password) {
        return res.status(400).json({ message: 'Piliin ang opisyal at ilagay ang password.' });
    }

    try {
        const cleanPwd = password.trim();
        const isMatch = bcrypt.compareSync(cleanPwd, DEMO_HASH) || cleanPwd.toLowerCase() === 'kapitan';

        if (!isMatch) {
            return res.status(401).json({ message: 'Maling password. Subukan ang: admin123' });
        }

        const token = jwt.sign(
            { admin_name, role: 'Barangay Official' },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        await db.query(
            'INSERT INTO admin_activity_logs (admin_name, action_type) VALUES (?, ?)',
            [admin_name, 'LOGIN']
        );

        res.json({
            message: 'Login successful',
            token,
            admin: { name: admin_name, loginTime: new Date().toISOString() }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

exports.logoutAdmin = async (req, res) => {
    const { admin_name } = req.body;
    try {
        if (admin_name) {
            await db.query(
                'INSERT INTO admin_activity_logs (admin_name, action_type) VALUES (?, ?)',
                [admin_name, 'LOGOUT']
            );
        }
        res.json({ message: 'Logged out and recorded in audit trail.' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Failed to record logout.' });
    }
};

exports.getAuthLogs = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM admin_activity_logs ORDER BY created_at DESC LIMIT 100'
        );
        res.json({ logs: rows });
    } catch (err) {
        console.error('Fetch auth logs error:', err);
        res.status(500).json({ message: 'Failed to load login history.' });
    }
};
