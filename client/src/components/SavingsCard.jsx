import React, { useState, useEffect } from 'react';
import {
    PiggyBank, ShieldAlert, Building2, TrendingUp,
    CalendarRange, PlusCircle, Image as ImageIcon, CheckCircle2, Trash2
} from 'lucide-react';

export default function SavingsCard({ summary, isAdmin = false }) {
    const [selectedYear, setSelectedYear] = useState('FY 2026');

    const [usageLogs, setUsageLogs] = useState(() => {
        const saved = localStorage.getItem('bb_savings_usage_logs');
        return saved ? JSON.parse(saved) : [];
    });

    const [showForm, setShowForm] = useState(false);
    const [usageYear, setUsageYear] = useState('FY 2026');
    const [usedFor, setUsedFor] = useState('');
    const [amountUsed, setAmountUsed] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        localStorage.setItem('bb_savings_usage_logs', JSON.stringify(usageLogs));
    }, [usageLogs]);

    const allocated2026 = Number(summary?.total_allocated || 0);
    const spent2026 = Number(summary?.total_spent || 0);
    const rawRemaining2026 = Math.max(0, allocated2026 - spent2026);

    const usedIn2026 = usageLogs
        .filter((u) => u.year === 'FY 2026')
        .reduce((acc, u) => acc + Number(u.amount || 0), 0);

    const netSavings2026 = Math.max(0, rawRemaining2026 - usedIn2026);

    const yearConfigs = {
        'FY 2026': {
            label: 'FY 2026 Remaining / Savings',
            totalSavings: netSavings2026,
            note: 'Current fiscal year (2026): Allocated minus Spent, less recorded savings usage.',
            emergencyShare: netSavings2026 * 0.4,
            infraShare: netSavings2026 * 0.4,
            communityShare: netSavings2026 * 0.2
        },
        'FY 2027': {
            label: 'FY 2027 Budget & Savings',
            totalSavings: 0,
            note: 'Zero muna dahil 2026 pa lang—wala pang pondo o naitalang savings para sa FY 2027.',
            emergencyShare: 0,
            infraShare: 0,
            communityShare: 0
        },
        'FY 2028': {
            label: 'FY 2028 Budget & Savings',
            totalSavings: 0,
            note: 'Zero muna dahil 2026 pa lang—wala pang pondo o naitalang savings para sa FY 2028.',
            emergencyShare: 0,
            infraShare: 0,
            communityShare: 0
        }
    };

    const current = yearConfigs[selectedYear] || yearConfigs['FY 2026'];
    const yearReports = usageLogs.filter((u) => u.year === selectedYear);

    const formatPeso = (val) =>
        `₱${Number(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

    const handlePhotoFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAddUsage = (e) => {
        e.preventDefault();
        const parsedAmt = Number(amountUsed);
        if (!usedFor.trim() || !parsedAmt || parsedAmt <= 0) return;

        const newEntry = {
            id: Date.now(),
            year: usageYear,
            usedFor: usedFor.trim(),
            amount: parsedAmt,
            photoUrl: photoUrl || '',
            dateRecorded: new Date().toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        };

        setUsageLogs((prev) => [newEntry, ...prev]);
        setUsedFor('');
        setAmountUsed('');
        setPhotoUrl('');
        setShowForm(false);
        setSelectedYear(usageYear);
    };

    const handleDeleteUsage = (id) => {
        setUsageLogs((prev) => prev.filter((u) => u.id !== id));
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                        <PiggyBank size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                                {current.label}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                Reserve Pool
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{current.note}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-500">FY:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-extrabold text-slate-900 outline-none focus:border-emerald-600"
                    >
                        <option value="FY 2026">FY 2026</option>
                        <option value="FY 2027">FY 2027</option>
                        <option value="FY 2028">FY 2028</option>
                    </select>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => {
                                setUsageYear(selectedYear);
                                setShowForm((prev) => !prev);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold inline-flex items-center gap-1 transition"
                        >
                            <PlusCircle size={13} /> {showForm ? 'Close' : 'Log Savings Used'}
                        </button>
                    )}
                </div>
            </div>

            {isAdmin && showForm && (
                <form
                    onSubmit={handleAddUsage}
                    className="p-3.5 rounded-xl bg-slate-50 border border-emerald-200 space-y-2.5 text-xs"
                >
                    <div className="font-bold text-slate-900">
                        Admin: Record Savings Utilization &amp; Photo Proof
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                                Fiscal Year
                            </label>
                            <select
                                value={usageYear}
                                onChange={(e) => setUsageYear(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-bold"
                            >
                                <option value="FY 2026">FY 2026</option>
                                <option value="FY 2027">FY 2027</option>
                                <option value="FY 2028">FY 2028</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                                Saan Ginamit / Purpose *
                            </label>
                            <input
                                required
                                type="text"
                                value={usedFor}
                                onChange={(e) => setUsedFor(e.target.value)}
                                placeholder="e.g. Emergency Flood Relief & Drainage Repair"
                                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                                Amount Used (₱) *
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                step="0.01"
                                value={amountUsed}
                                onChange={(e) => setAmountUsed(e.target.value)}
                                placeholder="e.g. 25000"
                                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-700">Photo Proof:</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoFile}
                                className="text-[11px] text-slate-600"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] self-start sm:self-auto"
                        >
                            Save Report
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] text-emerald-200 font-semibold">
                        <span className="inline-flex items-center gap-1">
                            <CalendarRange size={12} /> {selectedYear} Savings
                        </span>
                        <TrendingUp size={13} className="text-emerald-300" />
                    </div>
                    <div className="text-xl font-black mt-1 tracking-tight">
                        {formatPeso(current.totalSavings)}
                    </div>
                    <p className="text-[10px] text-emerald-100/80 mt-1">
                        {selectedYear === 'FY 2026'
                            ? 'Live remaining fund from 2026 budget'
                            : 'Zero muna for upcoming fiscal year'}
                    </p>
                </div>

                <div className="rounded-xl bg-rose-50/70 border border-rose-200/70 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                        <ShieldAlert size={13} /> Emergency Savings (40%)
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                        {formatPeso(current.emergencyShare)}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Disaster, relief &amp; quick response
                    </p>
                </div>

                <div className="rounded-xl bg-blue-50/70 border border-blue-200/70 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-blue-800 font-bold text-[11px]">
                        <Building2 size={13} /> New Infrastructure (40%)
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                        {formatPeso(current.infraShare)}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Drainage, streetlights &amp; facilities
                    </p>
                </div>

                <div className="rounded-xl bg-amber-50/70 border border-amber-200/70 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-[11px]">
                        <PiggyBank size={13} /> Community Reserve (20%)
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                        {formatPeso(current.communityShare)}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Health supplies &amp; youth programs
                    </p>
                </div>
            </div>

            {yearReports.length > 0 && (
                <div className="pt-2.5 border-t border-slate-200/80 space-y-2">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        {selectedYear} Savings Utilization Report ({yearReports.length})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {yearReports.map((item) => (
                            <div
                                key={item.id}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3"
                            >
                                {item.photoUrl ? (
                                    <img
                                        src={item.photoUrl}
                                        alt={item.usedFor}
                                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                                        <ImageIcon size={13} />
                                        <span className="text-[8px] mt-0.5">No Photo</span>
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="font-bold text-slate-900 text-xs truncate">
                                            {item.usedFor}
                                        </div>
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUsage(item.id)}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0"
                                                title="Remove entry"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-[11px] font-black text-emerald-700">
                                        Used: {formatPeso(item.amount)} •{' '}
                                        <span className="font-normal text-slate-500">{item.dateRecorded}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
