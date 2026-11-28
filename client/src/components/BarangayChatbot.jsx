import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';

const QUICK_PROMPTS = [
    'Kailan ang date ng mga natapos na project?',
    'Magkano ang natitirang pondo at utilization rate?',
    'Ano requirements sa Barangay Clearance?',
    'Anong mga proyekto ang Ongoing?'
];

const PLANNED_2027_SUMMARY = [
    '• Q1 2027: Solar-Powered CCTV & Flood Early Warning System (₱350,000.00)',
    '• Q2 2027: Barangay Digital Health Records & Telemedicine Kiosk (₱220,000.00)',
    '• Q2 2027: Pook 1–5 Concrete Drainage Rehabilitation Phase II (₱480,000.00)',
    '• Q3 2027: Free Coding & Digital Literacy Hub for Out-of-School Youth (₱150,000.00)'
].join('\n');

const DOC_GUIDES = [
    {
        keys: ['indigency', 'mahirap', 'medical', 'ospital', 'burial', 'scholarship', 'philhealth'],
        reply:
            'Certificate of Indigency:\n• Fee: Free (₱0.00)\n• Requirements: 1 Valid ID + Proof of Billing o Medical Abstract upon pickup.\n• Details needed: Age, Civil Status, Est. Monthly Family Income, at Specific Assistance/Purpose.'
    },
    {
        keys: ['cedula', 'community tax', 'buwis', 'income tax'],
        reply:
            'Community Tax Certificate (Cedula):\n• Fee: Starts at ₱5.00 + Income Tax\n• Requirements: 1 Valid Government-Issued ID upon pickup & payment.\n• Details needed: Birthdate, Birthplace, Civil Status & Sex, Occupation, at Gross Annual Income.'
    },
    {
        keys: ['residency', 'tirahan', 'nakatira', 'address', 'purok'],
        reply:
            'Certificate of Residency:\n• Fee: ₱30.00\n• Requirements: Valid ID showing Barangay Maunlad address o utility bill.\n• Details needed: Age, Civil Status, Years Residing in Barangay, at Purpose.'
    },
    {
        keys: ['clearance', 'trabaho', 'employment', 'nbi', 'police', 'bank'],
        reply:
            'Barangay Clearance:\n• Fee: ₱50.00\n• Requirements: 1 Valid ID + Cedula upon pickup at Barangay Hall.\n• Details needed: Age, Civil Status, Cedula No. (optional), at Purpose.'
    }
];

function BantayAiFace({ size = 32 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
            aria-label="Bantay-AI Mascot Face"
        >
            {/* Outer Civic Shield Glow */}
            <circle cx="32" cy="32" r="30" fill="#0F172A" stroke="#34D399" strokeWidth="2.5" />

            {/* Salakot / Barangay Civic Hat */}
            <path
                d="M12 24C18 12 46 12 52 24C44 21 20 21 12 24Z"
                fill="#F59E0B"
                stroke="#FDE68A"
                strokeWidth="1.5"
            />
            <circle cx="32" cy="14" r="3" fill="#EF4444" />

            {/* Friendly Face Base */}
            <rect x="17" y="23" width="30" height="26" rx="13" fill="#FEF3C7" />

            {/* Visor / Smart Glasses Frame */}
            <rect x="19" y="29" width="26" height="10" rx="5" fill="#1E3A8A" />

            {/* Glowing Expressive Eyes */}
            <circle cx="26" cy="34" r="2.7" fill="#34D399" />
            <circle cx="38" cy="34" r="2.7" fill="#34D399" />
            <circle cx="26.8" cy="33.2" r="0.9" fill="#FFFFFF" />
            <circle cx="38.8" cy="33.2" r="0.9" fill="#FFFFFF" />

            {/* Warm Rosy Cheeks */}
            <circle cx="21.5" cy="40.5" r="2" fill="#FDA4AF" opacity="0.8" />
            <circle cx="42.5" cy="40.5" r="2" fill="#FDA4AF" opacity="0.8" />

            {/* Friendly Smile */}
            <path
                d="M27 42.5C29 45 35 45 37 42.5"
                stroke="#0F172A"
                strokeWidth="2.2"
                strokeLinecap="round"
            />

            {/* Mini Headset Mic */}
            <path
                d="M47 34C49 34 50 36 50 38C50 41 47 43 43 43.5"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="42.5" cy="43.5" r="1.8" fill="#38BDF8" />
        </svg>
    );
}

const hasAny = (text, keywords) => keywords.some((kw) => text.includes(kw));

const formatDateShort = (dateStr) => {
    if (!dateStr) return 'N/A';
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return String(dateStr).split('T')[0];
    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function BarangayChatbot({ summary = {}, projects = [] }) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Kumusta! Ako si Bantay-AI ng Barangay Maunlad. Itanong mo lang ang kahit ano—schedule/petsa ng mga proyekto, natitirang pondo, detalye ng specific project, requirements sa dokumento, o 2027 plans!'
        }
    ]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (open) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    const formatPeso = (val) =>
        `₱${Number(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

    const findSpecificProject = (q) => {
        if (!projects.length) return null;
        const stopWords = new Set([
            'kailan', 'kelan', 'when', 'date', 'petsa', 'schedule', 'magkano', 'budget',
            'project', 'proyekto', 'yung', 'ang', 'mga', 'ng', 'sa', 'na', 'natapos',
            'done', 'ongoing', 'status', 'sino', 'ano', 'what', 'how', 'much', 'the', 'for'
        ]);

        const queryTokens = q
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length >= 4 && !stopWords.has(w));

        if (queryTokens.length === 0) return null;

        let bestMatch = null;
        let bestScore = 0;

        for (const p of projects) {
            const haystack = `${p.project_title || ''} ${p.sector || ''} ${p.target_beneficiaries || ''}`.toLowerCase();
            let score = 0;
            for (const token of queryTokens) {
                if (haystack.includes(token)) score += 1;
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = p;
            }
        }

        return bestScore > 0 ? bestMatch : null;
    };

    const generateReply = (rawQuestion) => {
        const q = rawQuestion.toLowerCase().trim();

        const allocated = Number(summary.total_allocated || 0);
        const spent = Number(summary.total_spent || 0);
        const remaining = allocated - spent;
        const utilization = allocated > 0 ? ((spent / allocated) * 100).toFixed(1) : '0.0';
        const doneProjects = projects.filter((p) => p.status === 'Done');
        const ongoingProjects = projects.filter((p) => p.status === 'Ongoing');

        // 1. Specific document checks
        for (const doc of DOC_GUIDES) {
            if (hasAny(q, doc.keys)) {
                return doc.reply;
            }
        }

        // 2. General documents / requirements / fees
        if (hasAny(q, ['dokumento', 'document', 'requirements', 'req', 'fee', 'bayad', 'magkano ang kuha', 'certificate', 'certs'])) {
            return (
                'Available Barangay Documents & Fees:\n' +
                '• Certificate of Indigency — Free (₱0.00)\n' +
                '• Community Tax Certificate (Cedula) — Starts at ₱5.00 + Income Tax\n' +
                '• Certificate of Residency — ₱30.00\n' +
                '• Barangay Clearance — ₱50.00\n\n' +
                'Magtanong ka ng partikular na dokumento (hal. "requirements sa clearance") para sa kumpletong detalye.'
            );
        }

        // 3. Document pickup workflow
        if (hasAny(q, ['pickup', 'pick up', 'time slot', 'reference', 'ref code', 'claimed', 'picked up']) && !hasAny(q, ['proyekto', 'project'])) {
            return (
                'Self-Service Document Pickup Workflow:\n' +
                '1. Buksan ang Request Barangay Docs at piliin ang dokumento.\n' +
                '2. Piliin ang Preferred Pickup Date at Time Slot (8:00 AM–11:00 AM, 1:00 PM–4:00 PM, o 4:00 PM–5:00 PM).\n' +
                '3. I-save ang Reference Code at dalhin kasama ng valid ID sa Barangay Hall.\n' +
                '4. Kapag na-claim na, mamarkahan ito ng Admin bilang Picked Up / Done.'
            );
        }

        // 4. Specific project lookup (e.g., "kailan matatapos ang drainage", "magkano sa streetlight")
        const specificProj = findSpecificProject(q);
        if (specificProj && !hasAny(q, ['lahat', 'all projects', 'mga proyekto', 'mga natapos'])) {
            return (
                `Detalye ng Proyekto:\n` +
                `• Title: ${specificProj.project_title}\n` +
                `• Status: ${specificProj.status}\n` +
                `• Schedule: Start ${formatDateShort(specificProj.start_date)} → Target ${formatDateShort(specificProj.target_date)}\n` +
                `• Budget: ${formatPeso(specificProj.budget_allocated)} allocated | ${formatPeso(specificProj.budget_spent)} spent\n` +
                `• Sector & Lead: ${specificProj.sector || 'General'} (${specificProj.kagawad || 'Barangay Council'})\n` +
                `• Beneficiaries: ${specificProj.target_beneficiaries || 'All Residents'}`
            );
        }

        // 5. Dates / Schedules of projects (e.g., "kailan ang date ng mga natapos na project")
        if (hasAny(q, ['kailan', 'kelan', 'when', 'date', 'petsa', 'schedule', 'sched', 'deadline', 'target', 'start', 'timeline'])) {
            let targetList = projects;
            let label = 'Schedule ng Lahat ng Proyekto';

            if (hasAny(q, ['natapos', 'done', 'completed', 'tapos', 'turned over'])) {
                targetList = doneProjects;
                label = 'Schedule ng Mga Natapos (Done) na Proyekto';
            } else if (hasAny(q, ['ongoing', 'kasalukuyan', 'ginagawa', 'in progress'])) {
                targetList = ongoingProjects;
                label = 'Schedule ng Mga Ongoing na Proyekto';
            }

            if (!targetList.length) {
                return 'Walang nakitang proyekto sa kategoryang iyon.';
            }

            const dateLines = targetList
                .map(
                    (p) =>
                        `• ${p.project_title} [${p.status}]\n  Start: ${formatDateShort(p.start_date)} | Target: ${formatDateShort(p.target_date)}`
                )
                .join('\n');

            return `${label} (${targetList.length}):\n${dateLines}`;
        }

        // 6. Highest / Lowest budget project
        if (hasAny(q, ['pinakamahal', 'pinakamalaki', 'highest', 'largest', 'pinakamura', 'pinakamaliit', 'lowest', 'smallest'])) {
            if (!projects.length) return 'Wala pang proyekto sa ledger.';
            const sorted = [...projects].sort(
                (a, b) => Number(b.budget_allocated || 0) - Number(a.budget_allocated || 0)
            );
            const picked = hasAny(q, ['pinakamura', 'pinakamaliit', 'lowest', 'smallest'])
                ? sorted[sorted.length - 1]
                : sorted[0];

            return (
                `Proyektong Hinahanap Mo:\n` +
                `• ${picked.project_title} (${picked.status})\n` +
                `• Allocated: ${formatPeso(picked.budget_allocated)} | Spent: ${formatPeso(picked.budget_spent)}\n` +
                `• Schedule: ${formatDateShort(picked.start_date)} → ${formatDateShort(picked.target_date)}`
            );
        }

        // 7. Budget, savings, spent, or utilization rate
        if (hasAny(q, ['savings', 'ipon', 'natitira', 'remaining', 'pondo', 'budget', 'allocated', 'spent', 'nagastos', 'utilization', 'rate', 'percent'])) {
            return (
                `Live Fiscal Summary (Barangay Maunlad):\n` +
                `• Total Allocated: ${formatPeso(allocated)}\n` +
                `• Total Spent: ${formatPeso(spent)} (${utilization}% utilization)\n` +
                `• Remaining / Savings: ${formatPeso(remaining)}\n` +
                `• Projects: ${doneProjects.length} Done • ${ongoingProjects.length} Ongoing (${projects.length} total)`
            );
        }

        // 8. General project list
        if (hasAny(q, ['proyekto', 'project', 'ledger', 'ongoing', 'done', 'completed', 'tapos', 'listahan', 'ilan'])) {
            if (!projects.length) {
                return 'Wala pang naka-load na proyekto sa live ledger sa ngayon.';
            }

            let matched = projects;
            if (hasAny(q, ['ongoing', 'in progress', 'kasalukuyan'])) {
                matched = ongoingProjects;
            } else if (hasAny(q, ['done', 'completed', 'tapos', 'turned over', 'natapos'])) {
                matched = doneProjects;
            }

            const lines = matched
                .map(
                    (p) =>
                        `• ${p.project_title} [${p.status}] — ${formatPeso(p.budget_spent)} / ${formatPeso(p.budget_allocated)} (${formatDateShort(p.start_date)} – ${formatDateShort(p.target_date)})`
                )
                .join('\n');

            return `Mga Proyekto (${matched.length} records):\n${lines}`;
        }

        // 9. 2027 Annual Investment Program (AIP)
        if (hasAny(q, ['2027', 'aip', 'planned', 'plano', 'susunod na taon', 'pipeline'])) {
            return `Proposed FY 2027 AIP (₱1,200,000.00 Total):\n${PLANNED_2027_SUMMARY}`;
        }

        // 10. Officials, developer, hall hours, hotlines, or audit policy
        if (hasAny(q, ['kapitan', 'official', 'opisyal', 'kagawad', 'council', 'sino ang namumuno'])) {
            return 'Ang kasalukuyang Punong Barangay ay si Hon. Juan Dela Cruz kasama ang Barangay Council. Makikita ang buong listahan sa Officials tab sa top navigation bar.';
        }

        if (hasAny(q, ['developer', 'gumawa', 'creator', 'programmer', 'amiel'])) {
            return 'Ang Bantay-Barangay Transparency Portal ay binuo ni Amiel Riche Laurio Guteza (BSIT-3A, TUP-Manila) para sa transparent na pagsubaybay ng pondo at serbisyo ng barangay.';
        }

        if (hasAny(q, ['oras', 'hours', 'bukas', 'hall', 'hotline', 'emergency', 'tulong', 'sunog', 'pulis', 'ambulansya'])) {
            return 'Ang Barangay Hall ay bukas Mon–Fri, 8:00 AM – 5:00 PM. Para sa emergency at quick response numbers, buksan ang Hotlines tab sa navigation bar.';
        }

        if (hasAny(q, ['delete', 'burahin', 'audit', 'tamper', 'security', 'bawal'])) {
            return 'Para sa transparency at auditability, nakatala sa audit logs ang lahat ng galaw ng admin at hindi nabubura ang records mula sa public ledger.';
        }

        // 11. Greeting or general fallback with live snapshot
        return (
            `Nandito ako para tumulong! Narito ang mabilis na buod ng Barangay Maunlad:\n` +
            `• Live Savings: ${formatPeso(remaining)} (${utilization}% ng ${formatPeso(allocated)} ang nagamit)\n` +
            `• Projects: ${doneProjects.length} Done, ${ongoingProjects.length} Ongoing\n\n` +
            `Subukang itanong:\n` +
            `– "Kailan ang date ng mga natapos na project?"\n` +
            `– "Magkano ang budget sa drainage?"\n` +
            `– "Ano requirements sa Indigency o Clearance?"`
        );
    };

    const handleSend = (textToSend) => {
        const trimmed = (textToSend ?? input).trim();
        if (!trimmed) return;

        const userMsg = { sender: 'user', text: trimmed };
        const aiMsg = { sender: 'ai', text: generateReply(trimmed) };

        setMessages((prev) => [...prev, userMsg, aiMsg]);
        if (textToSend === undefined) {
            setInput('');
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {open && (
                <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3.5 bg-gradient-to-r from-blue-950 via-blue-900 to-emerald-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <BantayAiFace size={36} />
                            <div>
                                <div className="text-xs font-extrabold flex items-center gap-1">
                                    Bantay-AI Assistant <Sparkles size={12} className="text-amber-300" />
                                </div>
                                <div className="text-[10px] text-blue-100">
                                    Live Fiscal, Schedule &amp; Service Guide
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    <div className="p-3.5 max-h-72 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-end gap-2 ${
                                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {msg.sender === 'ai' && <BantayAiFace size={26} />}
                                <div
                                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
                        {QUICK_PROMPTS.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => handleSend(prompt)}
                                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Itanong ang petsa, pondo, proyekto, o docs..."
                            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
                        />
                        <button
                            type="submit"
                            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
                            aria-label="Send message"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="ml-auto flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-slate-900 hover:bg-blue-900 border border-emerald-400/50 text-white font-bold text-xs shadow-xl transition"
            >
                <BantayAiFace size={30} />
                <span>{open ? 'Close Bantay-AI' : 'Ask Bantay-AI'}</span>
            </button>
        </div>
    );
}
