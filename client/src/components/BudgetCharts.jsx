import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';

export default function BudgetCharts({ summary, sectorBreakdown = [] }) {
    const allocated = Number(summary.total_allocated || 0);
    const spent = Number(summary.total_spent || 0);
    const remaining = Math.max(0, allocated - spent);
    const utilizationRate = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;

    const maxSectorBudget = Math.max(
        ...sectorBreakdown.map((s) => Number(s.allocated || 0)),
        1
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Budget Utilization Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <PieChart size={18} className="text-blue-600" />
                            Budget Utilization Rate
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            FY 2026
                        </span>
                    </div>
                    <p className="text-xs text-slate-500">
                        Ratio ng nagastos na pondo laban sa kabuuang alokasyon
                    </p>
                </div>

                <div className="my-6">
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-3xl font-extrabold text-slate-900">
                            {utilizationRate}%
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">
                            ₱{remaining.toLocaleString()} Remaining
                        </span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-700"
                            style={{ width: `${utilizationRate}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                        <span className="text-slate-400 block">Disbursed (Spent)</span>
                        <span className="font-bold text-slate-800">
                            ₱{spent.toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">Unobligated Balance</span>
                        <span className="font-bold text-emerald-600">
                            ₱{remaining.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sector Allocation & Spending Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <BarChart3 size={18} className="text-emerald-600" />
                            Sectoral Budget Allocation vs. Actual Spending
                        </h3>
                        <p className="text-xs text-slate-500">
                            Distribusyon ng pondo bawat komite ng barangay
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-3 h-3 rounded-sm bg-blue-900 inline-block" /> Allocated
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Spent
                        </span>
                    </div>
                </div>

                <div className="space-y-4 mt-2">
                    {sectorBreakdown.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-8 text-center">
                            Walang sectoral data na maipapakita.
                        </p>
                    ) : (
                        sectorBreakdown.map((sec, i) => {
                            const allocPct = Math.round((Number(sec.allocated) / maxSectorBudget) * 100);
                            const spentPct = Math.round((Number(sec.spent) / maxSectorBudget) * 100);
                            return (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-slate-700">{sec.sector}</span>
                                        <span className="text-slate-500">
                                            ₱{Number(sec.spent).toLocaleString()} /{' '}
                                            <span className="text-slate-800">
                                                ₱{Number(sec.allocated).toLocaleString()}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-900 rounded-full transition-all duration-500"
                                                style={{ width: `${allocPct}%` }}
                                            />
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                style={{ width: `${spentPct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
