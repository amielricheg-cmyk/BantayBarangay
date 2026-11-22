import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, Users, Lock, LogOut, Home } from 'lucide-react';

export default function Navbar({ view, setView, adminUser, onLogout }) {
    const [imgError, setImgError] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div
                    onClick={() => setView('landing')}
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

                    <button
                        onClick={() => setView('dashboard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            view === 'dashboard'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                        }`}
                    >
                        <Home size={14} /> <span className="hidden sm:inline">Portal</span>
                    </button>

                    <button
                        onClick={() => setView('hotlines')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            view === 'hotlines'
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60'
                        }`}
                    >
                        <PhoneCall size={14} /> <span className="hidden sm:inline">Hotlines</span>
                    </button>

                    <button
                        onClick={() => setView('officials')}
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
                            onClick={onLogout}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow transition"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => setView('login')}
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
