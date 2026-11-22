import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import LegalModal from './components/LegalModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import HotlinesPage from './pages/HotlinesPage';
import OfficialsPage from './pages/OfficialsPage';

export default function App() {
    const [view, setView] = useState('landing');
    const [legalType, setLegalType] = useState(null);
    const [adminUser, setAdminUser] = useState(() => {
        const saved = localStorage.getItem('bb_admin_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [projects, setProjects] = useState([]);
    const [summary, setSummary] = useState({
        total_allocated: 0,
        total_spent: 0,
        completed_projects: 0,
        ongoing_projects: 0
    });
    const [sectorBreakdown, setSectorBreakdown] = useState([]);
    const [comments, setComments] = useState([]);
    const [authLogs, setAuthLogs] = useState([]);
    const [systemLogs, setSystemLogs] = useState([]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const loadAllData = useCallback(async () => {
        try {
            const [projData, commentData, authLogData, sysLogData] = await Promise.all([
                apiService.getProjects(search, statusFilter),
                apiService.getComments(),
                apiService.getAuthLogs(),
                apiService.getSystemLogs()
            ]);

            setProjects(projData.projects || []);
            if (projData.summary) setSummary(projData.summary);
            setSectorBreakdown(projData.sectorBreakdown || []);
            setComments(commentData.comments || []);
            setAuthLogs(authLogData.logs || []);
            setSystemLogs(sysLogData.logs || []);
        } catch (err) {
            console.error('Error loading portal data:', err);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const handleLogout = async () => {
        if (adminUser?.name) {
            await apiService.logoutAdmin(adminUser.name);
        }
        localStorage.removeItem('bb_admin_token');
        localStorage.removeItem('bb_admin_user');
        setAdminUser(null);
        await loadAllData();
        setView('landing');
    };

    const handleCreateProject = async (formData) => {
        await apiService.createProject({ ...formData, username: adminUser?.name });
        await loadAllData();
    };

    const handleUpdateProject = async (id, formData) => {
        await apiService.updateProject(id, { ...formData, username: adminUser?.name });
        await loadAllData();
    };

    const handleSubmitComment = async (residentName, message) => {
        await apiService.submitComment(residentName, message);
        await loadAllData();
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('Burahin ang komentong ito? (Para lamang sa spam o walang kabuluhang mensahe)')) return;
        await apiService.deleteComment(id);
        await loadAllData();
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
            <Navbar
                view={view}
                setView={setView}
                adminUser={adminUser}
                onLogout={handleLogout}
            />

            {view === 'landing' && (
                <LandingPage
                    summary={summary}
                    projects={projects}
                    onEnterResident={() => setView('dashboard')}
                    onEnterLogin={() => setView(adminUser ? 'dashboard' : 'login')}
                    onOpenLegal={(type) => setLegalType(type)}
                />
            )}

            {view === 'login' && (
                <AdminLoginPage
                    onLoginSuccess={(admin) => {
                        setAdminUser(admin);
                        loadAllData();
                        setView('dashboard');
                    }}
                    onBack={() => setView('landing')}
                />
            )}

            {view === 'dashboard' && (
                <DashboardPage
                    projects={projects}
                    summary={summary}
                    sectorBreakdown={sectorBreakdown}
                    comments={comments}
                    authLogs={authLogs}
                    systemLogs={systemLogs}
                    adminUser={adminUser}
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onCreateProject={handleCreateProject}
                    onUpdateProject={handleUpdateProject}
                    onSubmitComment={handleSubmitComment}
                    onDeleteComment={handleDeleteComment}
                />
            )}

            {view === 'hotlines' && <HotlinesPage onBack={() => setView('dashboard')} />}
            {view === 'officials' && <OfficialsPage onBack={() => setView('dashboard')} />}

            <LegalModal type={legalType} onClose={() => setLegalType(null)} />
        </div>
    );
}
