import React from 'react';
import { PhoneCall, ShieldAlert, Flame, HeartPulse, ArrowLeft } from 'lucide-react';

export default function HotlinesPage({ onBack }) {
    const hotlines = [
        { title: 'Barangay Maunlad Emergency Desk (24/7)', number: '(02) 8911-4421 / 0917-555-0192', icon: <ShieldAlert className="text-blue-600" /> },
        { title: 'PNP Community Precinct 4', number: '117 / (02) 8722-0650', icon: <PhoneCall className="text-indigo-600" /> },
        { title: 'Bureau of Fire Protection (BFP)', number: '(02) 8426-0219', icon: <Flame className="text-rose-600" /> },
        { title: 'Barangay Health Center & Ambulance', number: '0918-442-8810', icon: <HeartPulse className="text-emerald-600" /> }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <button onClick={onBack} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900">Emergency & Rescue Hotlines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotlines.map((h, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-slate-50">{h.icon}</div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">{h.title}</h3>
                            <p className="text-lg font-extrabold text-blue-700 mt-1">{h.number}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
