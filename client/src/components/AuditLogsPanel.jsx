import React from 'react';
import { History, FileSpreadsheet } from 'lucide-react';

export default function AuditLogsPanel({ showAuthLogs, showSystemLogs, authLogs = [], systemLogs = [] }) {
    if (!showAuthLogs && !showSystemLogs) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {showAuthLogs && (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-md border border-slate-800">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                        <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                            <History size={16} /> Persistent Admin Login & Logout History
                        </h3>
                        <span className="text-[11px] text-slate-400">Database Archived</span>
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1 text-xs">
                        {authLogs.length === 0 ? (
                            <p className="text-slate-400 italic">No recorded login sessions yet.</p>
                        ) : (
                            authLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80"
                                >
                                    <div>
                                        <span
                                            className={`font-bold mr-2 ${
                                                log.action_type === 'LOGIN'
                                                    ? 'text-emerald-400'
                                                    : 'text-amber-400'
                                            }`}
                                        >
                                            [{log.action_type}]
                                        </span>
                                        <span className="font-medium text-slate-200">{log.admin_name}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400">
                                        {new Date(log.created_at).toLocaleString('en-PH', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showSystemLogs && (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-md border border-slate-800">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                        <h3 className="font-bold text-sm flex items-center gap-2 text-blue-400">
                            <FileSpreadsheet size={16} /> Project Modification Audit Trail
                        </h3>
                        <span className="text-[11px] text-slate-400">Immutable Record</span>
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1 text-xs">
                        {systemLogs.length === 0 ? (
                            <p className="text-slate-400 italic">No project modifications recorded.</p>
                        ) : (
                            systemLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80"
                                >
                                    <div className="truncate pr-2">
                                        <span className="font-bold text-blue-400 mr-2">[{log.action_type}]</span>
                                        <span className="text-slate-200">{log.description}</span>
                                        <span className="text-slate-400 ml-1">by {log.performed_by}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 shrink-0">
                                        {new Date(log.timestamp).toLocaleDateString('en-PH', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
