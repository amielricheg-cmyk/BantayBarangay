import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Edit3, Image as ImageIcon, X, Lock } from 'lucide-react';

export default function ProjectTable({ projects, isAdmin, onEdit }) {
    const [previewImg, setPreviewImg] = useState(null);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold flex items-center gap-1.5">
                        <Lock size={12} className="text-emerald-600" />
                        Immutable Public Ledger: Project deletion is permanently disabled for fiscal accountability.
                    </span>
                    <span className="font-bold text-slate-700">{projects.length} Records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider">
                                <th className="py-3.5 px-5 font-bold">Project Details & Output Photo</th>
                                <th className="py-3.5 px-4 font-bold">Sector & Lead</th>
                                <th className="py-3.5 px-4 font-bold">Schedule</th>
                                <th className="py-3.5 px-4 font-bold">Budget & Spent</th>
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
                                    <tr key={proj.id} className="hover:bg-slate-50/90 transition">
                                        <td className="py-4 px-5">
                                            <div className="flex items-start gap-3.5">
                                                {proj.image_url ? (
                                                    <div
                                                        onClick={() => setPreviewImg(proj)}
                                                        className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer shadow-xs"
                                                        title="Click to view full project photo"
                                                    >
                                                        <img
                                                            src={proj.image_url}
                                                            alt={proj.project_title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                                            <ImageIcon size={16} className="text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                                                        <ImageIcon size={16} />
                                                        <span className="text-[9px] mt-0.5">No Photo</span>
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="font-bold text-slate-900 leading-snug">
                                                        {proj.project_title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        Beneficiaries:{' '}
                                                        <span className="font-medium text-slate-700">
                                                            {proj.target_beneficiaries || 'All Residents'}
                                                        </span>
                                                    </div>
                                                    {proj.image_url && (
                                                        <button
                                                            onClick={() => setPreviewImg(proj)}
                                                            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                                                        >
                                                            <ImageIcon size={12} /> View Completion Proof
                                                        </button>
                                                    )}
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
                                                ₱{Number(proj.budget_allocated).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                                                Spent: ₱{Number(proj.budget_spent).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
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
                                            <td className="py-4 px-5 text-right">
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

            {/* Fullscreen Image Lightbox Modal */}
            {previewImg && (
                <div
                    onClick={() => setPreviewImg(null)}
                    className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm">{previewImg.project_title}</h4>
                                <p className="text-xs text-slate-300">
                                    Official Project Documentation • Status: {previewImg.status}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewImg(null)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-100 flex justify-center">
                            <img
                                src={previewImg.image_url}
                                alt={previewImg.project_title}
                                className="max-h-[70vh] rounded-xl object-contain shadow"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
