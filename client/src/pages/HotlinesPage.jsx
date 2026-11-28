import React from 'react';
import { ArrowLeft, Phone } from 'lucide-react';

const HOTLINES = [
    {
        code: 'DESK',
        accent: 'bg-blue-950 text-white',
        agency: 'Barangay Maunlad Emergency Desk (24/7)',
        number: '(02) 8911-4421 / 0917-555-0192',
        tel: 'tel:09175550192'
    },
    {
        code: 'PNP',
        accent: 'bg-indigo-900 text-white',
        agency: 'PNP Community Precinct 4',
        number: '117 / (02) 8722-0650',
        tel: 'tel:117'
    },
    {
        code: 'BFP',
        accent: 'bg-rose-700 text-white',
        agency: 'Bureau of Fire Protection (BFP)',
        number: '(02) 8426-0219',
        tel: 'tel:0284260219'
    },
    {
        code: 'MED',
        accent: 'bg-emerald-700 text-white',
        agency: 'Barangay Health Center & Ambulance',
        number: '0918-442-8810',
        tel: 'tel:09184428810'
    }
];

export default function HotlinesPage({ onBack }) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            <button
                type="button"
                onClick={onBack}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
                <ArrowLeft size={14} /> Back to Dashboard
            </button>

            <div>
                <h1 className="text-2xl font-black text-slate-900">
                    Emergency &amp; Rescue Hotlines
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                    Direct 24/7 barangay response, police, fire, and medical assistance numbers.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HOTLINES.map((item) => (
                    <a
                        key={item.agency}
                        href={item.tel}
                        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500 shadow-xs flex items-center justify-between gap-4 transition group"
                    >
                        <div className="flex items-center gap-3.5">
                            <span
                                className={`w-12 h-12 rounded-xl ${item.accent} font-mono font-extrabold text-xs tracking-wider flex items-center justify-center shrink-0`}
                            >
                                {item.code}
                            </span>
                            <div>
                                <div className="text-xs font-bold text-slate-500">
                                    {item.agency}
                                </div>
                                <div className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                                    {item.number}
                                </div>
                            </div>
                        </div>
                        <Phone size={15} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </a>
                ))}
            </div>
        </div>
    );
}
