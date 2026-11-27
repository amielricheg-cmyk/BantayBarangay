import React, { useState } from 'react';
import {
    Plus, Search, History, FileSpreadsheet,
    Download, FileCheck2, X
} from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import BudgetCharts from '../components/BudgetCharts';
import ProjectTable from '../components/ProjectTable';
import ProjectFormModal from '../components/ProjectFormModal';
import AuditLogsPanel from '../components/AuditLogsPanel';
import FeedbackSection from '../components/FeedbackSection';

export default function DashboardPage({
    projects,
    summary,
    sectorBreakdown,
    comments,
    authLogs,
    systemLogs,
    adminUser,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onCreateProject,
    onUpdateProject,
    onSubmitComment,
    onDeleteComment,
    onOpenDocRequests,
    docRequestCount = 0
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [showAuthLogs, setShowAuthLogs] = useState(Boolean(adminUser));
    const [showSystemLogs, setShowSystemLogs] = useState(false);

    // Range Export Modal State
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [rangeStart, setRangeStart] = useState(1);
    const [rangeEnd, setRangeEnd] = useState(projects.length || 1);

    const isAdmin = Boolean(adminUser);

    const openExportSelector = () => {
        setRangeStart(1);
        setRangeEnd(Math.max(1, projects.length));
        setExportModalOpen(true);
    };

    const handleConfirmRangeExport = () => {
        const startIdx = Math.max(0, Number(rangeStart) - 1);
        const endIdx = Math.min(projects.length, Number(rangeEnd));
        const selectedSubset =
            startIdx < endIdx ? projects.slice(startIdx, endIdx) : projects;

        const headers = [
            'Report #',
            'Project ID',
            'Project Title',
            'Sector Committee',
            'Lead Official',
            'Beneficiaries',
            'Start Date',
            'Target Date',
            'Budget Allocated (PHP)',
            'Budget Spent (PHP)',
            'Status'
        ];

        const rows = selectedSubset.map((p, idx) => [
            startIdx + idx + 1,
            p.id,
            `"${(p.project_title || '').replace(/"/g, '""')}"`,
            `"${(p.sector || '').replace(/"/g, '""')}"`,
            `"${(p.kagawad || '').replace(/"/g, '""')}"`,
            `"${(p.target_beneficiaries || 'All Residents').replace(/"/g, '""')}"`,
            p.start_date ? p.start_date.split('T')[0] : 'N/A',
            p.target_date ? p.target_date.split('T')[0] : 'N/A',
            Number(p.budget_allocated || 0).toFixed(2),
            Number(p.budget_spent || 0).toFixed(2),
            p.status
        ]);

        const csvContent =
            '\uFEFF' +
            [
                '"BARANGAY MAUNLAD - FINANCIAL & PROJECT TRANSPARENCY REPORT"',
                `"Exported Range: Report #${startIdx + 1} to Report #${Math.max(startIdx + 1, endIdx)}"`,
                `"Generated On: ${new Date().toLocaleString('en-PH')}"`,
                '',
                headers.join(','),
                ...rows.map((r) => r.join(','))
            ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `Barangay_Maunlad_Reports_${startIdx + 1}_to_${Math.max(startIdx + 1, endIdx)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExportModalOpen(false);
    };

    const handleSaveProject = async (formData) => {
        if (editingProject) {
            await onUpdateProject(editingProject.id, formData);
        } else {
            await onCreateProject(formData);
        }
        setModalOpen(false);
        setEditingProject(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Hero Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 p-6 sm:p-8 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                        Pera ng Bayan, Dapat Alam ng Mamamayan!
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Barangay Financial &amp; Project Tracking
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-200 mt-1">
                        Live public monitoring of local funds, sector allocations, schedules, and verified outputs.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                        onClick={onOpenDocRequests}
                        className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow transition"
                    >
                        <FileCheck2 size={16} />
                        {isAdmin
                            ? `Document Requests (${docRequestCount})`
                            : 'Request Barangay Docs'}
                    </button>

                    <button
                        onClick={openExportSelector}
                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
                    >
                        <Download size={16} className="text-emerald-400" /> Export Excel Report
                    </button>

                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingProject(null);
                                setModalOpen(true);
                            }}
                            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
                        >
                            <Plus size={18} /> Add New Project
                        </button>
                    )}
                </div>
            </div>

            {/* 4 Asymmetric KPI Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Visual Charts */}
            <BudgetCharts summary={summary} sectorBreakdown={sectorBreakdown} />

            {/* Search, Filter, and Audit Trail Controls */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects by title..."
                        className="bg-transparent w-full text-sm outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="Done">Done (Completed)</option>
                        <option value="Ongoing">Ongoing</option>
                    </select>

                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setShowSystemLogs(!showSystemLogs)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                                    showSystemLogs
                                        ? 'bg-blue-900 text-white border-blue-900'
                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <FileSpreadsheet size={14} /> Project Logs
                            </button>
                            <button
                                onClick={() => setShowAuthLogs(!showAuthLogs)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                                    showAuthLogs
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <History size={14} /> Login History
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isAdmin && (
                <AuditLogsPanel
                    showAuthLogs={showAuthLogs}
                    showSystemLogs={showSystemLogs}
                    authLogs={authLogs}
                    systemLogs={systemLogs}
                />
            )}

            <ProjectTable
                projects={projects}
                isAdmin={isAdmin}
                onEdit={(proj) => {
                    setEditingProject(proj);
                    setModalOpen(true);
                }}
            />

            <FeedbackSection
                comments={comments}
                isAdmin={isAdmin}
                onSubmitComment={onSubmitComment}
                onDeleteComment={onDeleteComment}
            />

            {/* Range Export Selector Modal */}
            {exportModalOpen && (
                <div
                    onClick={() => setExportModalOpen(false)}
                    className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-base text-slate-900">
                                Export Report Range (Excel / CSV)
                            </h3>
                            <button onClick={() => setExportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Choose which report numbers to export (Total available: {projects.length}).
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    From Report #
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={Math.max(1, projects.length)}
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    To Report #
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={Math.max(1, projects.length)}
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setExportModalOpen(false)}
                                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRangeExport}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                            >
                                <Download size={14} /> Download Selected Range
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <ProjectFormModal
                    initialData={editingProject}
                    onClose={() => {
                        setModalOpen(false);
                        setEditingProject(null);
                    }}
                    onSave={handleSaveProject}
                />
            )}
        </div>
    );
}
