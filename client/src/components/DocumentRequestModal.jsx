import React, { useState } from 'react';
import {
    X, FileCheck2, Send, CheckCircle2, Clock,
    Phone, Mail, Copy, Check, ArrowLeft, ArrowRight,
    FileText, Landmark, Home, ShieldCheck, Info
} from 'lucide-react';

const DOCUMENT_CATALOG = [
    {
        id: 'indigency',
        title: 'Certificate of Indigency',
        subtitle: 'For PhilHealth, Medical, Burial, or Educational Assistance',
        fee: 'Free (₱0.00)',
        requirements: 'Bring 1 Valid ID & Proof of Billing / Medical Abstract upon pickup.',
        icon: <FileText size={20} className="text-emerald-600" />
    },
    {
        id: 'cedula',
        title: 'Community Tax Certificate (Cedula)',
        subtitle: 'Annual residence tax certificate for adults (18+ yrs old)',
        fee: 'Starts at ₱5.00 + Income Tax',
        requirements: 'Bring 1 Valid Government-Issued ID upon pickup & payment.',
        icon: <Landmark size={20} className="text-amber-600" />
    },
    {
        id: 'residency',
        title: 'Certificate of Residency',
        subtitle: 'Official proof of permanent residence in Barangay Maunlad',
        fee: '₱30.00',
        requirements: 'Bring Valid ID showing Barangay Maunlad address or utility bill.',
        icon: <Home size={20} className="text-blue-600" />
    },
    {
        id: 'clearance',
        title: 'Barangay Clearance',
        subtitle: 'For Employment, Bank Account, Police/NBI Clearance, or Permit',
        fee: '₱50.00',
        requirements: 'Bring 1 Valid ID & Cedula upon pickup at Barangay Hall.',
        icon: <ShieldCheck size={20} className="text-indigo-600" />
    }
];

export default function DocumentRequestModal({
    isOpen,
    onClose,
    isAdmin,
    requests = [],
    onSubmitRequest,
    onMarkReady
}) {
    // Step 1 = Choose Document Type | Step 2 = Fill Specific Form
    const [step, setStep] = useState(1);
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Common Resident Info
    const [fullName, setFullName] = useState('');
    const [purokAddress, setPurokAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    // Dynamic Document-Specific Details
    const [extraDetails, setExtraDetails] = useState({});
    const [lastReceipt, setLastReceipt] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    if (!isOpen) return null;

    const updateExtra = (key, val) => {
        setExtraDetails((prev) => ({ ...prev, [key]: val }));
    };

    const handleSelectDoc = (doc) => {
        setSelectedDoc(doc);
        setExtraDetails({});
        setStep(2);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const refCode = `BB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Buuin ang summary string ng specific details para makita agad ng Admin
        const formattedSpecifics = Object.entries(extraDetails)
            .filter(([, v]) => v && String(v).trim() !== '')
            .map(([k, v]) => `${k}: ${v}`)
            .join(' • ');

        const newReq = {
            id: Date.now(),
            refCode,
            fullName: fullName.trim(),
            purokAddress: purokAddress.trim(),
            docType: selectedDoc.title,
            purpose: extraDetails['Purpose'] || extraDetails['Occupation'] || 'Official Transaction',
            specificDetails: formattedSpecifics,
            contactNumber: contactNumber.trim(),
            email: email.trim(),
            status: 'Pending Processing',
            createdAt: new Date().toLocaleString('en-PH')
        };

        onSubmitRequest(newReq);
        setLastReceipt(newReq);
        setFullName('');
        setPurokAddress('');
        setContactNumber('');
        setEmail('');
        setExtraDetails({});
        setStep(1);
        setSelectedDoc(null);
    };

    const copyPickupNotice = (reqItem) => {
        const text = `Barangay Maunlad Notice (${reqItem.refCode}): Hello ${reqItem.fullName}, your ${reqItem.docType} is now READY FOR PICKUP at Barangay Hall. Please bring your valid ID.`;
        navigator.clipboard?.writeText(text);
        setCopiedId(reqItem.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-blue-900 to-emerald-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FileCheck2 size={20} className="text-emerald-400" />
                        <div>
                            <h3 className="font-extrabold text-sm sm:text-base">
                                {isAdmin
                                    ? 'Resident Document Requests Queue (Admin Pickup Manager)'
                                    : step === 1
                                    ? 'Step 1: Select Barangay Document to Request'
                                    : `Step 2: ${selectedDoc?.title} Application`}
                            </h3>
                            <p className="text-[11px] text-blue-100">
                                {isAdmin
                                    ? 'Review specific form details, mark Ready for Pickup, and send SMS/Email alerts.'
                                    : 'No login required • Fill out required details & pick up at Barangay Hall.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[82vh] overflow-y-auto space-y-5 text-sm">
                    {!isAdmin ? (
                        <>
                            {lastReceipt && step === 1 && (
                                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                                    <div className="font-extrabold text-sm flex items-center gap-1.5">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                        Request Submitted! Reference No: {lastReceipt.refCode}
                                    </div>
                                    <p className="text-xs text-emerald-800">
                                        We will text/email <strong>{lastReceipt.contactNumber}</strong>
                                        {lastReceipt.email ? ` / ${lastReceipt.email}` : ''} once your{' '}
                                        <strong>{lastReceipt.docType}</strong> is ready for pickup at Barangay Hall.
                                    </p>
                                </div>
                            )}

                            {/* STEP 1: CHOOSE DOCUMENT BUTTONS */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold text-slate-500">
                                        Piliin sa ibaba kung anong dokumento ang iyong ire-request upang lumabas ang tamang form:
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {DOCUMENT_CATALOG.map((doc) => (
                                            <button
                                                key={doc.id}
                                                type="button"
                                                onClick={() => handleSelectDoc(doc)}
                                                className="text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 transition flex flex-col justify-between group"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-white transition">
                                                            {doc.icon}
                                                        </div>
                                                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                            {doc.fee}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700">
                                                        {doc.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {doc.subtitle}
                                                    </p>
                                                </div>

                                                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                                                    <span>Fill out form</span>
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: DYNAMIC FORM BASED ON SELECTED DOCUMENT */}
                            {step === 2 && selectedDoc && (
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                                        >
                                            <ArrowLeft size={14} /> Change Document Type
                                        </button>
                                        <span className="text-xs font-bold text-slate-500">
                                            Fee: <strong className="text-slate-800">{selectedDoc.fee}</strong>
                                        </span>
                                    </div>

                                    {/* Pickup Requirements Reminder Box */}
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                                        <Info size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Pickup Reminder:</strong> {selectedDoc.requirements}
                                        </span>
                                    </div>

                                    {/* Common Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Full Name (Buong Pangalan) *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="e.g. Estela Llanera Cabarles"
                                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Complete Address / Purok *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={purokAddress}
                                                onChange={(e) => setPurokAddress(e.target.value)}
                                                placeholder="e.g. Purok 1, Mabuhay St."
                                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>

                                    {/* SPECIFIC FIELDS FOR CERTIFICATE OF INDIGENCY */}
                                    {selectedDoc.id === 'indigency' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Age *
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    min="1"
                                                    max="120"
                                                    value={extraDetails['Age'] || ''}
                                                    onChange={(e) => updateExtra('Age', e.target.value)}
                                                    placeholder="e.g. 54"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Civil Status *
                                                </label>
                                                <select
                                                    required
                                                    value={extraDetails['Civil Status'] || ''}
                                                    onChange={(e) => updateExtra('Civil Status', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Est. Monthly Family Income *
                                                </label>
                                                <select
                                                    required
                                                    value={extraDetails['Monthly Income'] || ''}
                                                    onChange={(e) => updateExtra('Monthly Income', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Below ₱5,000">Below ₱5,000</option>
                                                    <option value="₱5,000 - ₱10,000">₱5,000 - ₱10,000</option>
                                                    <option value="No Fixed Income">No Fixed Income</option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-3">
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Specific Assistance / Purpose (e.g., PhilHealth, Hospital Bill, Scholarship, Burial) *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Purpose'] || ''}
                                                    onChange={(e) => updateExtra('Purpose', e.target.value)}
                                                    placeholder="e.g. PhilHealth Requirement / Medical Assistance"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* SPECIFIC FIELDS FOR CEDULA (COMMUNITY TAX CERTIFICATE) */}
                                    {selectedDoc.id === 'cedula' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Date of Birth *
                                                </label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={extraDetails['Birthdate'] || ''}
                                                    onChange={(e) => updateExtra('Birthdate', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Place of Birth *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Birthplace'] || ''}
                                                    onChange={(e) => updateExtra('Birthplace', e.target.value)}
                                                    placeholder="City / Province"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Civil Status &amp; Sex *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Status & Sex'] || ''}
                                                    onChange={(e) => updateExtra('Status & Sex', e.target.value)}
                                                    placeholder="e.g. Single / Female"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Profession / Occupation *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Occupation'] || ''}
                                                    onChange={(e) => updateExtra('Occupation', e.target.value)}
                                                    placeholder="e.g. Student / Vendor / Employee"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Height &amp; Weight (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={extraDetails['Height/Weight'] || ''}
                                                    onChange={(e) => updateExtra('Height/Weight', e.target.value)}
                                                    placeholder="e.g. 165cm / 58kg"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Gross Annual Income (₱) *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Annual Income'] || ''}
                                                    onChange={(e) => updateExtra('Annual Income', e.target.value)}
                                                    placeholder="e.g. ₱0 (Student) or ₱180,000"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* SPECIFIC FIELDS FOR CERTIFICATE OF RESIDENCY */}
                                    {selectedDoc.id === 'residency' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Age *
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={extraDetails['Age'] || ''}
                                                    onChange={(e) => updateExtra('Age', e.target.value)}
                                                    placeholder="e.g. 28"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Civil Status *
                                                </label>
                                                <select
                                                    required
                                                    value={extraDetails['Civil Status'] || ''}
                                                    onChange={(e) => updateExtra('Civil Status', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Years Residing in Barangay *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Length of Stay'] || ''}
                                                    onChange={(e) => updateExtra('Length of Stay', e.target.value)}
                                                    placeholder="e.g. 8 years / Since 2018"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div className="sm:col-span-3">
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Purpose of Residency Certificate *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Purpose'] || ''}
                                                    onChange={(e) => updateExtra('Purpose', e.target.value)}
                                                    placeholder="e.g. School Enrollment, Voter Registration, Driver's License"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* SPECIFIC FIELDS FOR BARANGAY CLEARANCE */}
                                    {selectedDoc.id === 'clearance' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/70">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Age *
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={extraDetails['Age'] || ''}
                                                    onChange={(e) => updateExtra('Age', e.target.value)}
                                                    placeholder="e.g. 24"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Civil Status *
                                                </label>
                                                <select
                                                    required
                                                    value={extraDetails['Civil Status'] || ''}
                                                    onChange={(e) => updateExtra('Civil Status', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Cedula No. (If Available)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={extraDetails['Cedula No.'] || ''}
                                                    onChange={(e) => updateExtra('Cedula No.', e.target.value)}
                                                    placeholder="Optional"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                            <div className="sm:col-span-3">
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Purpose of Barangay Clearance *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={extraDetails['Purpose'] || ''}
                                                    onChange={(e) => updateExtra('Purpose', e.target.value)}
                                                    placeholder="e.g. Local Employment, NBI/Police Clearance, Bank Requirement"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Details for Pickup Notification */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                <Phone size={12} className="text-blue-600" /> Mobile Number (For Pickup SMS Alert) *
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
                                                placeholder="09XX-XXX-XXXX"
                                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                <Mail size={12} className="text-blue-600" /> Email Address (Optional)
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="resident@email.com"
                                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow"
                                        >
                                            <Send size={14} /> Submit {selectedDoc.title} Request
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : (
                        /* ADMIN VIEW: SHOW ALL SUBMITTED SPECIFIC DETAILS */
                        <div className="space-y-3">
                            {requests.length === 0 ? (
                                <p className="text-center text-slate-400 py-8 text-xs">
                                    No resident document requests submitted yet.
                                </p>
                            ) : (
                                requests.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                    {item.refCode}
                                                </span>
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {item.fullName}
                                                </span>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                                                        item.status === 'Ready for Pickup'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-800 font-bold">
                                                {item.docType}
                                            </p>
                                            {item.specificDetails && (
                                                <p className="text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                                                    {item.specificDetails}
                                                </p>
                                            )}
                                            <p className="text-slate-500">
                                                Address: {item.purokAddress} • Contact: <strong>{item.contactNumber}</strong>
                                                {item.email ? ` • ${item.email}` : ''}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {item.status !== 'Ready for Pickup' && (
                                                <button
                                                    onClick={() => onMarkReady(item.id)}
                                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                                                >
                                                    <Clock size={13} /> Mark Ready for Pickup
                                                </button>
                                            )}
                                            <button
                                                onClick={() => copyPickupNotice(item)}
                                                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                                            >
                                                {copiedId === item.id ? (
                                                    <>
                                                        <Check size={13} className="text-emerald-400" /> Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={13} /> Copy SMS/Email Notice
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
