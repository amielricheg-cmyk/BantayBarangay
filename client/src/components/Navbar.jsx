import React, { useState, useRef, useEffect } from 'react';
import {
    ShieldCheck, PhoneCall, Users, Lock, LogOut,
    Home, ChevronDown, FileCheck2, Landmark, Clock
} from 'lucide-react';

export default function Navbar({
    view,
    setView,
    adminUser,
    onLogout,
    onOpenDocRequests
}) {
    const [imgError, setImgError] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setInfoOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const todayLabel = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const navigateAndClose = (targetView) => {
        setView(targetView);
        setInfoOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
            {/* Top Civic Utility Strip */}
            <div className="bg-blue-950/90 border-b border-blue-900/60 text-[11px] text-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{todayLabel} • Barangay Maunlad Civic Portal</span>
                    <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                        <Clock size={11} /> Hall Hours: Mon–Fri, 8:00 AM – 5:00 PM
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div
                    onClick={() => navigateAndClose('landing')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    {!imgError ? (
                        <img
                            src="/logo.png"
                            alt="Barangay Maunlad Seal"
                            onError={() => setImgError(true)}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow-md group-hover:scale-105 transition bg-white"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                            <ShieldCheck size={22} className="text-white" />
                        </div>
                    )}
                    <div>
                        <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none">
                            Barangay Maunlad
                        </h1>
                        <p className="text-xs text-blue-300 font-medium mt-0.5">
                            Bantay-Barangay Transparency Portal
                        </p>
                    </div>
                </div>

                <nav className="flex items-center gap-2 sm:gap-3">
                    {adminUser && (
                        <div className="hidden md:flex flex-col items-end mr-2 text-right">
                            <span className="text-xs font-bold text-emerald-400">
                                {adminUser.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Active Session • JWT Secured
                            </span>
                        </div>
                    )}

                    {/* BetterGov-Style Civic Info Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setInfoOpen((prev) => !prev)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                infoOpen
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <Landmark size={14} className="text-emerald-400" />
                            <span className="hidden sm:inline">Barangay Info</span>
                            <ChevronDown
                                size={13}
                                className={`transition-transform ${infoOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {infoOpen && (
                            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 p-2 z-50 space-y-1">
                                <button
                                    type="button"
                                    onClick={() => navigateAndClose('landing')}
                                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 transition block"
                                >
                                    <div className="text-xs font-extrabold text-slate-900">
                                        About Barangay Maunlad
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Full Disclosure overview, 2027 AIP &amp; community gallery
                                    </div>
                                </button>

                                {typeof onOpenDocRequests === 'function' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setInfoOpen(false);
                                            onOpenDocRequests();
                                        }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 transition flex items-start gap-2.5"
                                    >
                                        <FileCheck2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-extrabold text-slate-900">
                                                Document Pickup Scheduler
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                Indigency, Cedula, Residency &amp; Clearance
                                            </div>
                                        </div>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => navigateAndClose('hotlines')}
                                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-50 transition flex items-start gap-2.5"
                                >
                                    <PhoneCall size={15} className="text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-extrabold text-slate-900">
                                            Emergency Hotlines
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            Quick response contacts &amp; barangay desk
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigateAndClose('officials')}
                                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 transition flex items-start gap-2.5"
                                >
                                    <Users size={15} className="text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-extrabold text-slate-900">
                                            Barangay Officials
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            Punong Barangay, Kagawads &amp; sector leads
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => navigateAndClose('dashboard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            view === 'dashboard'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                        }`}
                    >
                        <Home size={14} /> <span className="hidden sm:inline">Portal</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigateAndClose('hotlines')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            view === 'hotlines'
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60'
                        }`}
                    >
                        <PhoneCall size={14} /> <span className="hidden sm:inline">Hotlines</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigateAndClose('officials')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            view === 'officials'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                        }`}
                    >
                        <Users size={14} /> <span className="hidden sm:inline">Officials</span>
                    </button>

                    {adminUser ? (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow transition"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigateAndClose('login')}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow transition"
                        >
                            <Lock size={14} /> Official Login
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
