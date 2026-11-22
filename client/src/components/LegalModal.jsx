import React from 'react';
import { X, Scale, FileSignature, ShieldCheck } from 'lucide-react';

export default function LegalModal({ type, onClose }) {
    if (!type) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
                <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        {type === 'terms' ? (
                            <Scale size={18} className="text-blue-400" />
                        ) : (
                            <FileSignature size={18} className="text-emerald-400" />
                        )}
                        <h3 className="font-bold text-sm sm:text-base">
                            {type === 'terms'
                                ? 'Terms & Conditions of Public Portal Use'
                                : 'Software Development & Cloud Deployment Agreement'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {type === 'terms' ? (
                        <>
                            <p className="font-bold text-slate-900">1. Public Data Transparency (RA 7160 & Full Disclosure Policy)</p>
                            <p>
                                All financial allocations, disbursements, and project completion photos published on the
                                Bantay-Barangay Portal are official public records of Barangay Maunlad intended for
                                citizen oversight and community verification.
                            </p>

                            <p className="font-bold text-slate-900">2. Immutable Financial Records (No-Delete Policy)</p>
                            <p>
                                To prevent tampering and ensure audit integrity, published barangay budget entries cannot
                                be deleted once encoded. Authorized officials may only append updates, expenditure
                                adjustments, and photographic completion proofs.
                            </p>

                            <p className="font-bold text-slate-900">3. Citizen Reporting & Moderation</p>
                            <p>
                                Residents are encouraged to submit constructive feedback and photographic incident reports.
                                Barangay administrators reserve the right to remove spam, profanity, or malicious entries,
                                with every moderation action permanently logged in the public audit trail.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                                <p className="font-bold text-slate-900">PARTIES TO THIS AGREEMENT:</p>
                                <p><strong>Client / LGU Entity:</strong> Barangay Maunlad Council</p>
                                <p><strong>Lead Systems Developer:</strong> Amiel Riche Laurio Guteza (Civic Tech Solutions)</p>
                            </div>

                            <p className="font-bold text-slate-900">1. Scope of System Deliverables</p>
                            <p>
                                The Developer agrees to deliver the full-stack Bantay-Barangay Financial & Project
                                Tracking System, including Role-Based Access Control (JWT & Bcrypt), Immutable Audit
                                Logging, Excel Fiscal Export, and Resident Incident Reporting.
                            </p>

                            <p className="font-bold text-slate-900">2. Production Hosting, SSL & Security Provisioning</p>
                            <p>
                                Upon final turnover and acceptance, the production system shall be deployed on{' '}
                                <strong>Amazon Web Services (AWS Lightsail / EC2)</strong> provisioned with a dedicated
                                static IP, automated database backups, and an active <strong>SSL/TLS (HTTPS)</strong>{' '}
                                security certificate purchased and configured for official barangay domain access.
                            </p>

                            <p className="font-bold text-slate-900">3. Intellectual Property & Maintenance</p>
                            <p>
                                Barangay Maunlad retains full ownership of all encoded fiscal data and citizen reports.
                                The Developer provides 6 months of post-deployment technical support and security patching.
                            </p>
                        </>
                    )}
                </div>

                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" /> Verified Governance Document
                    </span>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                        I Understand & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
