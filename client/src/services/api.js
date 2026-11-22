const API_BASE = 'http://localhost:5001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('bb_admin_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

// Image compression helper para mabilis ang upload at pasok sa MySQL LONGTEXT
export const compressImage = (file, maxWidth = 900, quality = 0.75) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export const apiService = {
    // Auth & Persistent Login Logs
    loginAdmin: async (admin_name, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_name, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
    },
    logoutAdmin: async (admin_name) => {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_name })
        });
    },
    getAuthLogs: async () => {
        const res = await fetch(`${API_BASE}/auth/logs`);
        return res.json();
    },

    // Projects & Summary
    getProjects: async (search = '', status = '') => {
        const params = new URLSearchParams({ search, status });
        const res = await fetch(`${API_BASE}/projects?${params}`);
        return res.json();
    },
    createProject: async (projectData) => {
        const res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(projectData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create project');
        return data;
    },
    updateProject: async (id, projectData) => {
        const res = await fetch(`${API_BASE}/projects/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(projectData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update project');
        return data;
    },
    deleteProject: async (id) => {
        const res = await fetch(`${API_BASE}/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete project');
        return data;
    },
    getSystemLogs: async () => {
        const res = await fetch(`${API_BASE}/projects/logs`);
        return res.json();
    },

    // Resident Feedback & Incident Reports
    getComments: async () => {
        const res = await fetch(`${API_BASE}/projects/comments/all`);
        return res.json();
    },
    submitComment: async (resident_name, message) => {
        const res = await fetch(`${API_BASE}/projects/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resident_name, message })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to submit report');
        return data;
    },
    deleteComment: async (id) => {
        const res = await fetch(`${API_BASE}/projects/comments/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete comment');
        return data;
    }
};
