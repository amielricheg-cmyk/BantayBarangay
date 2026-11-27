import React, { useState } from 'react';
import {
    ArrowRight, ShieldCheck, Calendar, FileText, Code2,
    CheckCircle2, Lock, Server, Scale
} from 'lucide-react';

const DEFAULT_MOMENTS = [
    {
        url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
        caption: 'Bayanihan Relief & Evacuation Kit Distribution'
    },
    {
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        caption: 'Barangay Maunlad Clean-Up Drive & Drainage Declogging'
    },
    {
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        caption: 'SK Youth Digital Literacy & Computer Training'
    },
    {
        url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
        caption: 'Libreng Konsulta at Gamot sa Barangay Health Center'
    },
    {
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
        caption: 'Barangay General Assembly & Public Budget Hearing'
    }
];

const PLANNED_2027 = [
    {
        title: 'Solar-Powered CCTV & Flood Early Warning System',
        sector: 'Peace, Order & Disaster Risk',
        estimatedBudget: '₱350,000.00',
        quarter: 'Q1 2027'
    },
    {
        title: 'Barangay Digital Health Records & Telemedicine Kiosk',
        sector: 'Health & Sanitation',
        estimatedBudget: '₱220,000.00',
        quarter: 'Q2 2027'
    },
    {
        title: 'Pook 1–5 Concrete Drainage Rehabilitation Phase II',
        sector: 'Infrastructure & Public Works',
        estimatedBudget: '₱480,000.00',
        quarter: 'Q2 2027'
    },
    {
        title: 'Free Coding & Digital Literacy Hub for Out-of-School Youth',
        sector: 'Education & Youth (SK)',
        estimatedBudget: '₱150,000.00',
        quarter: 'Q3 2027'
    }
];

export default function LandingPage({
    summary,
    projects = [],
    onEnterResident,
    onEnterLogin,
    onOpenLegal
}) {
    const [activeTab, setActiveTab] = useState('2027');

    const uploadedMoments = projects
        .filter((p) => p.image_url)
        .map((p) => ({ url: p.image_url, caption: p.project_title }));

    const allMoments = [...uploadedMoments, ...DEFAULT_MOMENTS];
    const rowOne = [...allMoments, ...allMoments];
    const rowTwo = [...allMoments.slice().reverse(), ...allMoments.slice().reverse()];

    return (
        <div className="bg-[#FAF9F6] text-slate-900">
            {/* 1. HERO SECTION WITH COMMUNITY PHOTO + LIGHTER BLUE GRADIENT */}
            <section className="relative overflow-hidden bg-slate-900 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80')`
                    }}
                />
                {/* Lighter Blue Gradient so Community Photo Shines Through */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/65 via-blue-950/60 to-[#FAF9F6]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-24">
                    <div className="max-w-4xl space-y-5">
                        <div>
                            <span className="text-xs font-bold tracking-[0.18em] uppercase text-blue-100 drop-shadow">
                                PONDO NATIN • KARAPATAN NATIN • KINABUKASAN NATIN
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white drop-shadow-sm">
                            <span className="block">Bawat Piso, May Resibo.</span>
                            <span className="block text-emerald-300 mt-1">
                                Bawat Proyekto, May Progreso!
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-100 max-w-2xl leading-relaxed drop-shadow-xs">
                            Pera ng Bayan, Dapat Alam ng Mamamayan! Subaybayan ang pondo, badyet, at
                            aktwal na larawan ng mga proyektong pang-kaunlaran ng Barangay Maunlad nang
                            hayag at direkta.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <a
                                href="#planned-2027"
                                onClick={() => setActiveTab('2027')}
                                className="px-6 py-3.5 rounded-full bg-white text-slate-950 hover:bg-blue-50 font-bold text-sm flex items-center gap-2 shadow-xl transition"
                            >
                                What&apos;s planned for 2027 <ArrowRight size={16} />
                            </a>
                            <button
                                onClick={onEnterResident}
                                className="px-6 py-3.5 rounded-full bg-blue-950/80 hover:bg-blue-950 text-white border border-white/35 backdrop-blur-md font-bold text-sm transition"
                            >
                                Where the 2026 budget went
                            </button>
                        </div>
                    </div>

                    {/* Floating Quick Metrics Strip */}
                    <div className="mt-14 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-900">
                        <div className="border-b sm:border-b-0 sm:border-r border-slate-200 pb-4 sm:pb-0 sm:pr-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                2026 Monitored Allocation
                            </span>
                            <div className="text-3xl sm:text-4xl font-black text-slate-950 mt-1">
                                ₱{Number(summary.total_allocated || 580000).toLocaleString('en-PH')}
                            </div>
                            <p className="text-xs text-emerald-600 font-semibold mt-1">
                                100% Full Disclosure Compliant (RA 7160)
                            </p>
                        </div>

                        <div className="border-b sm:border-b-0 sm:border-r border-slate-200 pb-4 sm:pb-0 sm:pr-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                2027 Proposed AIP Budget
                            </span>
                            <div className="text-3xl sm:text-4xl font-black text-blue-900 mt-1">
                                ₱1,200,000
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Open for Resident Deliberation &amp; Review
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Active &amp; Verified Projects
                            </span>
                            <div className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1">
                                {(Number(summary.completed_projects || 0) + Number(summary.ongoing_projects || 0)) || 5}{' '}
                                Programs
                            </div>
                            <button
                                onClick={onEnterResident}
                                className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                            >
                                Inspect live ledger &amp; photos <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* BetterGov / Naga Inspired Multi-Color Civic Strip */}
                <div className="h-1.5 w-full grid grid-cols-5">
                    <div className="bg-rose-600" />
                    <div className="bg-emerald-500" />
                    <div className="bg-amber-400" />
                    <div className="bg-blue-600" />
                    <div className="bg-indigo-800" />
                </div>
            </section>

            {/* 2. BARANGAY MAUNLAD IN ACTION — ANIMATED PHOTO SLIDESHOW */}
            <section className="py-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                        Barangay Maunlad in action
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                        Moments from the barangay&apos;s programs, projects, and communities.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="animate-marquee-left gap-4">
                        {rowOne.map((item, idx) => (
                            <div
                                key={`r1-${idx}`}
                                className="relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-slate-200 shrink-0 group"
                            >
                                <img
                                    src={item.url}
                                    alt={item.caption}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3.5">
                                    <p className="text-xs font-semibold text-white line-clamp-1">
                                        {item.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="animate-marquee-right gap-4">
                        {rowTwo.map((item, idx) => (
                            <div
                                key={`r2-${idx}`}
                                className="relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-slate-200 shrink-0 group"
                            >
                                <img
                                    src={item.url}
                                    alt={item.caption}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3.5">
                                    <p className="text-xs font-semibold text-white line-clamp-1">
                                        {item.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. WHAT'S PLANNED FOR 2027 */}
            <section id="planned-2027" className="py-14 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                                <Calendar size={13} /> Annual Investment Program (AIP)
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                                What&apos;s Planned for 2027
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Proposed community development projects slated for FY 2027 budget enactment.
                            </p>
                        </div>

                        <div className="inline-flex rounded-xl bg-slate-100 p-1">
                            <button
                                onClick={() => setActiveTab('2027')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                                    activeTab === '2027'
                                        ? 'bg-slate-900 text-white shadow'
                                        : 'text-slate-600'
                                }`}
                            >
                                2027 Pipeline (₱1.20M)
                            </button>
                            <button
                                onClick={onEnterResident}
                                className="px-4 py-2 rounded-lg text-xs font-bold text-blue-700 hover:bg-white transition"
                            >
                                View 2026 Live Ledger →
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PLANNED_2027.map((plan, index) => (
                            <div
                                key={index}
                                className="rounded-2xl p-5 bg-[#FAF9F6] border border-slate-200/90 hover:border-blue-400 transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                                        <span className="text-blue-700">{plan.quarter}</span>
                                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                            Proposed
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                                        {plan.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1.5">{plan.sector}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-200/80">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                        Estimated Allocation
                                    </span>
                                    <span className="text-base font-extrabold text-slate-900">
                                        {plan.estimatedBudget}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. ABOUT THE DEVELOPER, CLOUD SECURITY & GOVERNANCE AGREEMENTS */}
            <footer className="bg-slate-950 text-slate-300 pt-14 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-slate-800">
                    <div className="lg:col-span-5 space-y-3">
                        <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <Code2 size={16} /> About the Developer
                        </div>
                        <h3 className="text-xl font-extrabold text-white">
                            Amiel Riche Laurio Guteza
                        </h3>
                        <p className="text-xs text-blue-300 font-semibold">
                            Lead Full-Stack Civic Tech Developer • BSIT-3A, TUP-Manila
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Engineered to empower local barangay constituents with real-time fiscal
                            transparency, immutable audit trails, and direct citizen-to-council
                            incident reporting under the Philippine Full Disclosure Policy.
                        </p>
                    </div>

                    <div className="lg:col-span-4 space-y-3">
                        <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <Server size={16} /> Production Security &amp; Cloud Readiness
                        </div>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li className="flex items-start gap-2">
                                <Lock size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>
                                    <strong className="text-slate-200">SSL/TLS Encrypted Deployment:</strong>{' '}
                                    Ready for production offload on <strong className="text-white">AWS Lightsail / EC2</strong> with HTTPS SSL certificate &amp; custom domain.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>
                                    <strong className="text-slate-200">Anti-Tampering Ledger:</strong>{' '}
                                    Project deletion is permanently disabled to guarantee public accountability.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3 space-y-3">
                        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                            <Scale size={16} /> Governance &amp; Contracts
                        </div>
                        <div className="flex flex-col gap-2 text-xs">
                            <button
                                onClick={() => onOpenLegal('terms')}
                                className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center justify-between transition"
                            >
                                <span>Terms &amp; Conditions</span>
                                <FileText size={14} className="text-blue-400" />
                            </button>
                            <button
                                onClick={() => onOpenLegal('contract')}
                                className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center justify-between transition"
                            >
                                <span>Developer–Barangay Contract</span>
                                <CheckCircle2 size={14} className="text-emerald-400" />
                            </button>
                            <button
                                onClick={onEnterLogin}
                                className="text-left px-3.5 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 font-semibold transition"
                            >
                                Official Council Access →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span>© 2026 Bantay-Barangay Transparency Portal • Barangay Maunlad. All Rights Reserved.</span>
                    <span>Architected for AWS Cloud Deployment • HTTPS/SSL Ready</span>
                </div>
            </footer>
        </div>
    );
}
