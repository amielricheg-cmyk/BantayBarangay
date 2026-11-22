import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';

const OFFICIALS = [
    'Hon. Juan Dela Cruz (Punong Barangay)',
    'Hon. Elena Reyes (Kagawad - Peace & Disaster)',
    'Hon. Pedro Penduko (Kagawad - Infrastructure)',
    'Hon. Maria Santos (Kagawad - Health)',
    'Hon. Carlos Lakandula (SK Chairperson)'
];

export default function AdminLoginPage({ onLoginSuccess, onBack }) {
    const [selectedOfficial, setSelectedOfficial] = useState(OFFICIALS[0]);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiService.loginAdmin(selectedOfficial, password);
            localStorage.setItem('bb_admin_token', res.token);
            localStorage.setItem('bb_admin_user', JSON.stringify(res.admin));
            onLoginSuccess(res.admin);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200">
                <button
                    onClick={onBack}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6"
                >
                    <ArrowLeft size={14} /> Back to Portal
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-950 text-emerald-400 flex items-center justify-center shadow">
                        <ShieldCheck size={26} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Official Admin Login</h2>
                        <p className="text-xs text-slate-500">
                            Protected by JWT Encryption & Audit Logging
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Barangay Official Account
                        </label>
                        <select
                            name="username"
                            autoComplete="username"
                            value={selectedOfficial}
                            onChange={(e) => setSelectedOfficial(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm font-medium outline-none focus:border-blue-600 bg-white"
                        >
                            {OFFICIALS.map((off) => (
                                <option key={off} value={off}>
                                    {off}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Security Passcode / Password
                        </label>
                        <div className="relative">
                            <KeyRound
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                required
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password (e.g. admin123)"
                                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                    >
                        <Lock size={16} />
                        {loading ? 'Verifying Credentials...' : 'Authenticate & Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
