const db = require('../config/db');

const ensureAuditLogsTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            action_type VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            performed_by VARCHAR(150) DEFAULT 'Admin',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

const writeAuditLog = async (actionType, description, performedBy = 'Admin') => {
    try {
        await ensureAuditLogsTable();
        await db.query(
            'INSERT INTO audit_logs (action_type, description, performed_by) VALUES (?, ?, ?)',
            [actionType, description, performedBy || 'Admin']
        );
    } catch (logErr) {
        console.warn('Audit log skipped:', logErr.message);
    }
};

exports.getProjects = async (req, res) => {
    const { search = '', status = '' } = req.query;
    try {
        let query = `
            SELECT s.*, p.* 
            FROM projects p
            LEFT JOIN sectors s ON p.sector_id = s.id
            WHERE p.project_title LIKE ?
        `;
        const params = [`%${search}%`];

        if (status) {
            query += ' AND p.status = ?';
            params.push(status);
        }
        query += ' ORDER BY p.id DESC';

        const [rawProjects] = await db.query(query, params);
        const projects = rawProjects.map((row) => ({
            ...row,
            sector: row.sector_name || row.name || row.sector || 'General Sector',
            kagawad: row.kagawad || row.kagawad_in_charge || row.lead_official || 'Barangay Council'
        }));

        const [summaryRows] = await db.query(`
            SELECT 
                COALESCE(SUM(budget_allocated), 0) AS total_allocated,
                COALESCE(SUM(budget_spent), 0) AS total_spent,
                SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) AS completed_projects,
                SUM(CASE WHEN status = 'Ongoing' THEN 1 ELSE 0 END) AS ongoing_projects
            FROM projects
        `);

        const [sectorBreakdown] = await db.query(`
            SELECT 
                s.*,
                COALESCE(SUM(p.budget_allocated), 0) AS allocated,
                COALESCE(SUM(p.budget_spent), 0) AS spent
            FROM sectors s
            LEFT JOIN projects p ON s.id = p.sector_id
            GROUP BY s.id
        `);

        const formattedSectors = sectorBreakdown.map((s) => ({
            sector: s.sector_name || s.name || s.sector || `Sector #${s.id}`,
            allocated: s.allocated,
            spent: s.spent
        }));

        res.json({
            projects,
            summary: summaryRows[0],
            sectorBreakdown: formattedSectors
        });
    } catch (err) {
        console.error('Get projects error:', err);
        res.status(500).json({ message: 'Failed to load projects.', error: err.message });
    }
};

exports.createProject = async (req, res) => {
    const {
        project_title, sector_id, budget_allocated, budget_spent,
        status, target_beneficiaries, start_date, target_date, image_url, username
    } = req.body;

    const cleanStart = start_date && String(start_date).trim() !== '' ? String(start_date).split('T')[0] : null;
    const cleanTarget = target_date && String(target_date).trim() !== '' ? String(target_date).split('T')[0] : null;

    try {
        const [result] = await db.query(
            `INSERT INTO projects 
            (project_title, sector_id, budget_allocated, budget_spent, status, target_beneficiaries, start_date, target_date, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                project_title,
                Number(sector_id) || 1,
                Number(budget_allocated) || 0,
                Number(budget_spent) || 0,
                status,
                target_beneficiaries || null,
                cleanStart,
                cleanTarget,
                image_url || null
            ]
        );

        await writeAuditLog('CREATE', `Added project: ${project_title}`, username || 'Admin');

        res.status(201).json({ id: result.insertId, message: 'Project created successfully.' });
    } catch (err) {
        console.error('Create project error:', err);
        res.status(500).json({ message: 'Failed to create project.', error: err.message });
    }
};

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const {
        project_title, sector_id, budget_allocated, budget_spent,
        status, target_beneficiaries, start_date, target_date, image_url, username
    } = req.body;

    const cleanStart = start_date && String(start_date).trim() !== '' ? String(start_date).split('T')[0] : null;
    const cleanTarget = target_date && String(target_date).trim() !== '' ? String(target_date).split('T')[0] : null;

    try {
        await db.query(
            `UPDATE projects SET 
                project_title = ?, sector_id = ?, budget_allocated = ?, budget_spent = ?,
                status = ?, target_beneficiaries = ?, start_date = ?, target_date = ?, image_url = ?
            WHERE id = ?`,
            [
                project_title,
                Number(sector_id) || 1,
                Number(budget_allocated) || 0,
                Number(budget_spent) || 0,
                status,
                target_beneficiaries || null,
                cleanStart,
                cleanTarget,
                image_url || null,
                id
            ]
        );

        await writeAuditLog('UPDATE', `Updated project: ${project_title}`, username || 'Admin');

        res.json({ message: 'Project updated successfully.' });
    } catch (err) {
        console.error('Update project error:', err);
        res.status(500).json({ message: 'Failed to update project.', error: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT project_title FROM projects WHERE id = ?', [id]);
        const title = rows[0] ? rows[0].project_title : `ID #${id}`;

        await db.query('DELETE FROM projects WHERE id = ?', [id]);

        await writeAuditLog('DELETE', `Deleted project: ${title}`, req.admin?.admin_name || 'Admin');

        res.json({ message: 'Project deleted successfully.' });
    } catch (err) {
        console.error('Delete project error:', err);
        res.status(500).json({ message: 'Failed to delete project.' });
    }
};

exports.getSystemLogs = async (req, res) => {
    try {
        await ensureAuditLogsTable();
        const [logs] = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50');
        res.json({ logs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to load audit logs.' });
    }
};
