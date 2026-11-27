import React, { useState } from 'react';
import {
    Calendar, CheckCircle2, Clock, Edit3,
    Image as ImageIcon, X, Lock, Maximize2, Users
} from 'lucide-react';

export default function ProjectTable({ projects, isAdmin, onEdit }) {
    const [selectedProject, setSelectedProject] = useState(null);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatPeso = (val) =>
        `₱${Number(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold flex items-center gap-1.5">
                        <Lock size={12} className="text-emerald-600" />
                        Immutable Public Ledger • Click any project row to pop out &amp; inspect full details.
                    </span>
                    <span className="font-bold text-slate-700">{projects.length} Records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider">
                                <th className="py-3.5 px-5 font-bold">Project Details &amp; Output Photo</th>
                                <th className="py-3.5 px-4 font-bold">Sector &amp; Lead</th>
                                <th className="py-3.5 px-4 font-bold">Schedule</th>
                                <th className="py-3.5 px-4 font-bold">Budget &amp; Spent</th>
                                <th className="py-3.5 px-4 font-bold">Status</th>
                                {isAdmin && <th className="py-3.5 px-5 font-bold text-right">Update</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {projects.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 6 : 5}
                                        className="py-10 text-center text-slate-400 text-sm"
                                    >
                                        No project records found.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((proj) => (
                                    <tr
                                        key={proj.id}
                                        onClick={() => setSelectedProject(proj)}
                                        className="hover:bg-blue-50/50 cursor-pointer transition group"
                                    >
                                        <td className="py-4 px-5">
                                            <div className="flex items-start gap-3.5">
                                                {proj.image_url ? (
                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs">
                                                        <img
                                                            src={proj.image_url}
                                                            alt={proj.project_title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                                                        <ImageIcon size={16} />
                                                        <span className="text-[9px] mt-0.5">No Photo</span>
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-700 leading-snug flex items-center gap-1.5">
                                                        <span>{proj.project_title}</span>
                                                        <Maximize2 size={12} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        Beneficiaries:{' '}
                                                        <span className="font-medium text-slate-700">
                                                            {proj.target_beneficiaries || 'All Residents'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-slate-800 text-xs">
                                                {proj.sector || 'General'}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                Lead: {proj.kagawad || 'Barangay Council'}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-xs text-slate-600 space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-blue-500" />
                                                Start: {formatDate(proj.start_date)}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-amber-500" />
                                                Target: {formatDate(proj.target_date)}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="font-bold text-slate-900">
                                                {formatPeso(proj.budget_allocated)}
                                            </div>
                                            <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                                                Spent: {formatPeso(proj.budget_spent)}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            {proj.status === 'Done' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                    <CheckCircle2 size={13} /> Done
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                                    <Clock size={13} /> Ongoing
                                                </span>
                                            )}
                                        </td>

                                        {isAdmin && (
                                            <td
                                                onClick={(e) => e.stopPropagation()}
                                                className="py-4 px-5 text-right"
                                            >
                                                <button
                                                    onClick={() => onEdit(proj)}
                                                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs inline-flex items-center gap-1.5 transition"
                                                    title="Edit Project & Upload Completion Photo"
                                                >
                                                    <Edit3 size={13} /> Edit
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Highlighted Pop-Up Detail Modal */}
            {selectedProject && (
                <div
                    onClick={() => setSelectedProject(null)}
                    className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
                    >
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                    Project Spotlight • Record #{selectedProject.id}
                                </span>
                                <h3 className="font-extrabold text-base sm:text-lg leading-snug mt-0.5">
                                    {selectedProject.project_title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-sm">
                            {selectedProject.image_url && (
                                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                                    <img
                                        src={selectedProject.image_url}
                                        alt={selectedProject.project_title}
                                        className="w-full max-h-64 object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                                        Budget Allocated
                                    </span>
                                    <span className="text-xl font-black text-slate-900">
                                        {formatPeso(selectedProject.budget_allocated)}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                                    <span className="text-[11px] font-bold uppercase text-emerald-700 block">
                                        Actual Budget Spent
                                    </span>
                                    <span className="text-xl font-black text-emerald-700">
                                        {formatPeso(selectedProject.budget_spent)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                    <span className="text-slate-400 block">Sector &amp; Committee Lead</span>
                                    <strong className="text-slate-800 text-sm">
                                        {selectedProject.sector || 'General'} — {selectedProject.kagawad || 'Barangay Council'}
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                    <span className="text-slate-400 block flex items-center gap-1">
                                        <Users size={12} /> Target Beneficiaries
                                    </span>
                                    <strong className="text-slate-800 text-sm">
                                        {selectedProject.target_beneficiaries || 'All Residents'}
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                    <span className="text-slate-400 block">Implementation Timeline</span>
                                    <strong className="text-slate-800">
                                        {formatDate(selectedProject.start_date)} → {formatDate(selectedProject.target_date)}
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                    <span className="text-slate-400 block">Current Status</span>
                                    <strong className="text-slate-800">{selectedProject.status}</strong>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            const target = selectedProject;
                                            setSelectedProject(null);
                                            onEdit(target);
                                        }}
                                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                                    >
                                        <Edit3 size={14} /> Edit Project Details
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                                >
                                    Close Spotlight
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
