import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import LegalModal from './components/LegalModal';
import DocumentRequestModal from './components/DocumentRequestModal';
import BarangayChatbot from './components/BarangayChatbot';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import HotlinesPage from './pages/HotlinesPage';
import OfficialsPage from './pages/OfficialsPage';

export default function App() {
    const [view, setView] = useState('landing');
    const [legalType, setLegalType] = useState(null);
    const [docModalOpen, setDocModalOpen] = useState(false);

    // Auto-retry state when backend server is still booting up
    const [backendWaking, setBackendWaking] = useState(false);

    const [docRequests, setDocRequests] = useState(() => {
        const saved = localStorage.getItem('bb_doc_requests');
        return saved ? JSON.parse(saved) : [];
    });

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

    useEffect(() => {
        localStorage.setItem('bb_doc_requests', JSON.stringify(docRequests));
    }, [docRequests]);

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

            // Clear waking banner once live data succeeds
            setBackendWaking(false);
        } catch (err) {
            console.warn('Backend still starting up, retrying in 2s...', err);

            // Show banner and retry every 2 seconds until port 5001 responds
            setBackendWaking(true);
            setTimeout(() => {
                loadAllData();
            }, 2000);
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
        try {
            await apiService.createProject({ ...formData, username: adminUser?.name });
            await loadAllData();
            alert('Bagong proyekto ay matagumpay na naidagdag!');
        } catch (err) {
            console.error('Failed to create project:', err);
            alert(err?.message || 'Hindi naidagdag ang bagong proyekto. I-check ang server.');
            throw err;
        }
    };

    const handleUpdateProject = async (id, formData) => {
        try {
            await apiService.updateProject(id, { ...formData, username: adminUser?.name });
            await loadAllData();
            alert('Project updated successfully!');
        } catch (err) {
            console.error('Failed to update project:', err);
            alert(err?.message || 'Hindi na-save ang project update. I-check ang backend server o login session.');
            throw err;
        }
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

    const handleSubmitDocRequest = (newReq) => {
        setDocRequests((prev) => [newReq, ...prev]);
    };

    const handleMarkDocReady = (id) => {
        setDocRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Ready for Pickup' } : r))
        );
    };

    const handleMarkDocPickedUp = (id) => {
        setDocRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Picked Up' } : r))
        );
    };

    const pendingDocCount = docRequests.filter(
        (r) => r.status !== 'Picked Up' && r.status !== 'Done'
    ).length;

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
            <Navbar
                view={view}
                setView={setView}
                adminUser={adminUser}
                onLogout={handleLogout}
                onOpenDocRequests={() => setDocModalOpen(true)}
            />

            {/* Sync status banner while backend API is booting */}
            {backendWaking && (
                <div className="bg-amber-500 text-slate-950 text-xs font-bold text-center py-2 px-4">
                    Connecting to Barangay Maunlad database server... Syncing live records automatically.
                </div>
            )}

            {view === 'landing' && (
                <LandingPage
                    summary={summary}
                    projects={projects}
                    onEnterResident={() => setView('dashboard')}
                    onEnterLogin={() => setView(adminUser ? 'dashboard' : 'login')}
                    onOpenLegal={(type) => setLegalType(type)}
                    onOpenDocRequests={() => setDocModalOpen(true)}
                    onEnterHotlines={() => setView('hotlines')}
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
                    onOpenDocRequests={() => setDocModalOpen(true)}
                    docRequestCount={pendingDocCount}
                />
            )}

            {view === 'hotlines' && <HotlinesPage onBack={() => setView('dashboard')} />}
            {view === 'officials' && <OfficialsPage onBack={() => setView('dashboard')} />}

            <DocumentRequestModal
                isOpen={docModalOpen}
                onClose={() => setDocModalOpen(false)}
                isAdmin={Boolean(adminUser)}
                requests={docRequests}
                onSubmitRequest={handleSubmitDocRequest}
                onMarkReady={handleMarkDocReady}
                onMarkPickedUp={handleMarkDocPickedUp}
            />

            <BarangayChatbot summary={summary} projects={projects} />

            <LegalModal type={legalType} onClose={() => setLegalType(null)} />
        </div>
    );
}
