import React from 'react';
import { Wallet, TrendingUp, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

export default function SummaryCards({ summary }) {
    const allocated = Number(summary.total_allocated || 0);
    const spent = Number(summary.total_spent || 0);
    const pct = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;

    const formatPeso = (val) =>
        `₱${Number(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Featured Dark Gradient Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-200">
                        Total Allocated
                    </span>
                    <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
                        <Wallet size={18} className="text-emerald-400" />
                    </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight">
                    {formatPeso(allocated)}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-blue-200">
                    <span>FY 2026 General Fund</span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                        Verified <ArrowUpRight size={12} />
                    </span>
                </div>
            </div>

            {/* Card 2: Disbursed / Spent with Mini Bar */}
            <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Total Budget Spent
                    </span>
                    <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                        <TrendingUp size={18} />
                    </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                    {formatPeso(spent)}
                </div>
                <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Disbursement Rate</span>
                        <span className="text-emerald-600">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                </div>
            </div>

            {/* Card 3: Completed Projects */}
            <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Completed Outputs
                    </span>
                    <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                        <CheckCircle2 size={18} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {summary.completed_projects || 0}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Turned Over
                    </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3">
                    With official completion documentation
                </p>
            </div>

            {/* Card 4: Ongoing Projects */}
            <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Active / Ongoing
                    </span>
                    <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                        <Clock size={18} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {summary.ongoing_projects || 0}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        In Progress
                    </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3">
                    Currently under committee monitoring
                </p>
            </div>
        </div>
    );
}
