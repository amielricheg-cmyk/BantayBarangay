const express = require('express');
const router = express.Router();
const db = require('../config/db');

// READ: Get all projects with feedback count
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        const statusFilter = req.query.status || '';
        
        let query = `
            SELECT 
                p.*, 
                s.sector_name AS sector, 
                s.assigned_kagawad AS kagawad, 
                (p.budget_allocated - p.budget_spent) AS remaining_budget
            FROM projects p 
            JOIN sectors s ON p.sector_id = s.id 
            WHERE p.project_title LIKE ?
        `;
        let params = [`%${search}%`];

        if (statusFilter) {
            query += ` AND p.status = ?`;
            params.push(statusFilter);
        }

        query += ` ORDER BY p.id DESC`;

        const [projects] = await db.execute(query, params);
        
        const [summaryRows] = await db.execute(`
            SELECT 
                COUNT(*) AS total_projects,
                SUM(budget_allocated) AS total_allocated,
                SUM(budget_spent) AS total_spent,
                SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) AS completed_projects,
                SUM(CASE WHEN status = 'Ongoing' THEN 1 ELSE 0 END) AS ongoing_projects
            FROM projects
        `);

        res.json({ success: true, projects, summary: summaryRows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve projects' });
    }
});

// READ: Activity Logs
router.get('/logs', async (req, res) => {
    try {
        const [logs] = await db.execute(`SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 20`);
        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch logs' });
    }
});

// CREATE: Add new project record
router.post('/', async (req, res) => {
    try {
        const { project_title, sector_id, budget_allocated, budget_spent, status, target_beneficiaries, start_date, target_date, image_url, username } = req.body;
        
        const [result] = await db.execute(
            `INSERT INTO projects (project_title, sector_id, budget_allocated, budget_spent, status, target_beneficiaries, start_date, target_date, image_url, date_logged) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [project_title, sector_id, budget_allocated, budget_spent || 0, status || 'Ongoing', target_beneficiaries, start_date || null, target_date || null, image_url || null]
        );

        await db.execute(
            `INSERT INTO activity_logs (action_type, description, performed_by) VALUES (?, ?, ?)`,
            ['CREATE', `Created project: ${project_title}`, username || 'admin_kapitan']
        );

        res.status(201).json({ success: true, message: 'Project added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create project' });
    }
});

// UPDATE: Edit project record
router.put('/:id', async (req, res) => {
    try {
        const { project_title, sector_id, budget_allocated, budget_spent, status, target_beneficiaries, start_date, target_date, image_url, username } = req.body;
        
        await db.execute(
            `UPDATE projects SET project_title=?, sector_id=?, budget_allocated=?, budget_spent=?, status=?, target_beneficiaries=?, start_date=?, target_date=?, image_url=? WHERE id=?`,
            [project_title, sector_id, budget_allocated, budget_spent, status, target_beneficiaries, start_date, target_date, image_url, req.params.id]
        );

        await db.execute(
            `INSERT INTO activity_logs (action_type, description, performed_by) VALUES (?, ?, ?)`,
            ['UPDATE', `Updated project ID: ${req.params.id}`, username || 'admin_kapitan']
        );

        res.json({ success: true, message: 'Project updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update project' });
    }
});

// DELETE: Remove project record
router.delete('/:id', async (req, res) => {
    try {
        await db.execute(`DELETE FROM projects WHERE id = ?`, [req.params.id]);
        
        await db.execute(
            `INSERT INTO activity_logs (action_type, description, performed_by) VALUES (?, ?, ?)`,
            ['DELETE', `Deleted project ID: ${req.params.id}`, 'admin_kapitan']
        );

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
});

// COMMENTS & FEEDBACK ROUTES
router.get('/comments/all', async (req, res) => {
    try {
        const [comments] = await db.execute(`SELECT * FROM project_comments ORDER BY created_at DESC`);
        res.json({ success: true, comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch comments' });
    }
});

router.post('/comments', async (req, res) => {
    try {
        const { resident_name, message } = req.body;
        
        await db.execute(
            `INSERT INTO project_comments (resident_name, message, created_at) VALUES (?, ?, NOW())`,
            [resident_name || 'Anonymous Resident', message || '']
        );
        
        res.status(201).json({ success: true, message: 'Comment posted successfully' });
    } catch (error) {
        console.error("CRITICAL ERROR SA POST COMMENTS:", error);
        res.status(500).json({ success: false, message: error.message || 'Failed to post comment' });
    }
});

module.exports = router;
