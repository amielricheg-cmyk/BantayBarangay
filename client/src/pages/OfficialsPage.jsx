import React from 'react';
import { Users, ArrowLeft } from 'lucide-react';

export default function OfficialsPage({ onBack }) {
    const officials = [
        { name: 'Hon. Juan Dela Cruz', role: 'Punong Barangay', committee: 'Overall Governance & Finance' },
        { name: 'Hon. Elena Reyes', role: 'Barangay Kagawad', committee: 'Peace, Order & Disaster Risk Reduction' },
        { name: 'Hon. Pedro Penduko', role: 'Barangay Kagawad', committee: 'Infrastructure & Public Works' },
        { name: 'Hon. Maria Santos', role: 'Barangay Kagawad', committee: 'Health, Sanitation & Social Services' },
        { name: 'Hon. Carlos Lakandula', role: 'SK Chairperson', committee: 'Education, Sports & Youth Development' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <button onClick={onBack} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="text-blue-600" /> Barangay Maunlad Council Directory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {officials.map((o, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[11px] font-bold uppercase text-emerald-600">{o.role}</span>
                        <h3 className="font-extrabold text-slate-900 text-base mt-0.5">{o.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{o.committee}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
