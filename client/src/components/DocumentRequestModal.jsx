import React, { useState } from 'react';
import {
    X, FileCheck2, Send, CheckCircle2, Calendar, Clock,
    ArrowLeft, ArrowRight, FileText, Landmark, Home,
    ShieldCheck, Info, Search, CheckCheck
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

const PICKUP_TIME_SLOTS = [
    'Morning (8:00 AM – 11:00 AM)',
    'Afternoon (1:00 PM – 4:00 PM)',
    'Late Afternoon (4:00 PM – 5:00 PM)'
];

export default function DocumentRequestModal({
    isOpen,
    onClose,
    isAdmin,
    requests = [],
    onSubmitRequest,
    onMarkReady,
    onMarkPickedUp
}) {
    const [step, setStep] = useState(1);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [docQuery, setDocQuery] = useState('');

    // Common Resident Info + Self-Selected Pickup Schedule
    const [fullName, setFullName] = useState('');
    const [purokAddress, setPurokAddress] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTimeSlot, setPickupTimeSlot] = useState(PICKUP_TIME_SLOTS[0]);

    // Dynamic Document-Specific Details
    const [extraDetails, setExtraDetails] = useState({});
    const [lastReceipt, setLastReceipt] = useState(null);

    // Admin Filter State
    const [adminSearch, setAdminSearch] = useState('');

    if (!isOpen) return null;

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredCatalog = DOCUMENT_CATALOG.filter((doc) => {
        const q = docQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            doc.title.toLowerCase().includes(q) ||
            doc.subtitle.toLowerCase().includes(q)
        );
    });

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
        const refCode = `BM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
            pickupDate,
            pickupTimeSlot,
            status: 'Pending Processing',
            createdAt: new Date().toLocaleString('en-PH')
        };

        onSubmitRequest(newReq);
        setLastReceipt(newReq);
        setFullName('');
        setPurokAddress('');
        setPickupDate('');
        setPickupTimeSlot(PICKUP_TIME_SLOTS[0]);
        setExtraDetails({});
        setStep(1);
        setSelectedDoc(null);
    };

    const handleSetPickedUp = (item) => {
        if (typeof onMarkPickedUp === 'function') {
            onMarkPickedUp(item.id);
        } else if (typeof onMarkReady === 'function') {
            onMarkReady(item.id, 'Picked Up');
        }
    };

    const visibleAdminRequests = requests.filter((item) => {
        const q = adminSearch.trim().toLowerCase();
        if (!q) return true;
        return (
            (item.refCode || '').toLowerCase().includes(q) ||
            (item.fullName || '').toLowerCase().includes(q) ||
            (item.docType || '').toLowerCase().includes(q)
        );
    });

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
                                    ? 'Verify scheduled pickup slots and mark requests as Picked Up / Done once claimed.'
                                    : 'No login required • Choose your preferred pickup date & time slot at Barangay Hall.'}
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
                                        Request Scheduled! Reference No: {lastReceipt.refCode}
                                    </div>
                                    <p className="text-xs text-emerald-800">
                                        Proceed to Barangay Hall for <strong>{lastReceipt.docType}</strong> on{' '}
                                        <strong>{lastReceipt.pickupDate || 'your chosen date'}</strong> ({lastReceipt.pickupTimeSlot}).
                                        Present your Reference No. and valid ID upon pickup.
                                    </p>
                                </div>
                            )}

                            {/* STEP 1: CHOOSE DOCUMENT + BETTER GOV-INSPIRED QUICK SEARCH */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <p className="text-xs font-semibold text-slate-500">
                                            Piliin ang dokumentong kailangan mo upang lumabas ang form:
                                        </p>
                                        <div className="relative w-full sm:w-60">
                                            <Search
                                                size={14}
                                                className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                                            />
                                            <input
                                                type="text"
                                                value={docQuery}
                                                onChange={(e) => setDocQuery(e.target.value)}
                                                placeholder="Search certificate or service..."
                                                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {filteredCatalog.map((doc) => (
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

                                    {/* SPECIFIC FIELDS FOR CEDULA */}
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

                                    {/* Self-Selected Pickup Date & Time Slot (No Email/SMS Required) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                <Calendar size={12} className="text-blue-600" /> Preferred Pickup Date *
                                            </label>
                                            <input
                                                required
                                                type="date"
                                                min={todayStr}
                                                value={pickupDate}
                                                onChange={(e) => setPickupDate(e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                <Clock size={12} className="text-blue-600" /> Preferred Pickup Time *
                                            </label>
                                            <select
                                                required
                                                value={pickupTimeSlot}
                                                onChange={(e) => setPickupTimeSlot(e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600"
                                            >
                                                {PICKUP_TIME_SLOTS.map((slot) => (
                                                    <option key={slot} value={slot}>
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
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
                                            <Send size={14} /> Schedule &amp; Submit Request
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : (
                        /* ADMIN VIEW: SCHEDULED PICKUPS + PICKED UP / DONE STATUS CONTROL */
                        <div className="space-y-3">
                            <div className="relative">
                                <Search
                                    size={14}
                                    className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="text"
                                    value={adminSearch}
                                    onChange={(e) => setAdminSearch(e.target.value)}
                                    placeholder="Filter by Reference Code, Resident Name, or Document..."
                                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                                />
                            </div>

                            {visibleAdminRequests.length === 0 ? (
                                <p className="text-center text-slate-400 py-8 text-xs">
                                    No matching resident document requests found.
                                </p>
                            ) : (
                                visibleAdminRequests.map((item) => {
                                    const isClaimed =
                                        item.status === 'Picked Up' || item.status === 'Done';

                                    return (
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
                                                            isClaimed
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
                                                    Address: {item.purokAddress} • Pickup:{' '}
                                                    <strong className="text-slate-700">
                                                        {item.pickupDate || 'N/A'} ({item.pickupTimeSlot || 'Anytime'})
                                                    </strong>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {!isClaimed ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetPickedUp(item)}
                                                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                                                    >
                                                        <CheckCheck size={14} /> Mark Picked Up
                                                    </button>
                                                ) : (
                                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                                                        <CheckCircle2 size={13} /> Claimed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
