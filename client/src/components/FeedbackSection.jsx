import React, { useState } from 'react';
import { MessageSquare, Send, Image as ImageIcon, Trash2 } from 'lucide-react';
import { compressImage } from '../services/api';

export default function FeedbackSection({ comments = [], isAdmin, onSubmitComment, onDeleteComment }) {
    const [residentName, setResidentName] = useState('');
    const [text, setText] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file, 800, 0.7);
            setPhotoBase64(compressed);
        } catch {
            alert('Hindi ma-process ang photo.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSubmitting(true);
        try {
            const payload = photoBase64
                ? JSON.stringify({ text: text.trim(), image: photoBase64 })
                : text.trim();
            await onSubmitComment(residentName.trim() || 'Anonymous Resident', payload);
            setResidentName('');
            setText('');
            setPhotoBase64('');
        } finally {
            setSubmitting(false);
        }
    };

    const parseComment = (rawMsg) => {
        if (!rawMsg) return { text: '', image: null };

        const tagMatch = rawMsg.match(/\[IMAGE_URL:(data:image\/[^\]]+)\]/);
        if (tagMatch) {
            return {
                text: rawMsg.replace(tagMatch[0], '').trim(),
                image: tagMatch[1]
            };
        }

        try {
            const parsed = JSON.parse(rawMsg);
            if (parsed && typeof parsed === 'object' && parsed.text) {
                return { text: parsed.text, image: parsed.image || null };
            }
        } catch {
            // Plain text fallback
        }
        return { text: rawMsg, image: null };
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-600" />
                    {isAdmin
                        ? 'Resident Feedbacks & Incident Reports (Admin Monitoring)'
                        : 'Resident Feedback, Suggestions & Incident Reporting'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                    {isAdmin
                        ? 'Maaaring burahin ng Admin ang mga spam o walang kabuluhang mensahe. Lahat ng pagbura ay naka-record sa Audit Trail.'
                        : 'May nais bang i-report o isuhestiyon sa barangay? Mag-iwan ng mensahe at mag-attach ng larawan.'}
                </p>
            </div>

            {!isAdmin && (
                <form onSubmit={handleSubmit} className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={residentName}
                            onChange={(e) => setResidentName(e.target.value)}
                            placeholder="Your Name (Optional)"
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                        <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-3.5 py-2 text-sm">
                            <ImageIcon size={16} className="text-blue-600 shrink-0" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            required
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Isulat ang iyong concern o suhestiyon dito..."
                            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                        <button
                            disabled={submitting}
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition"
                        >
                            <Send size={15} /> {submitting ? 'Sending...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Recent Community Messages ({comments.length})
                </h4>
                {comments.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">Wala pang komento o suhestiyon.</p>
                ) : (
                    comments.map((c) => {
                        const { text: msgText, image } = parseComment(c.message);
                        return (
                            <div
                                key={c.id}
                                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row justify-between gap-4 overflow-hidden"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-sm text-slate-900">
                                            {c.resident_name || 'Anonymous Resident'}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            • {new Date(c.created_at).toLocaleString('en-PH')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 mt-1 break-words whitespace-pre-wrap">
                                        {msgText}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 shrink-0">
                                    {image && (
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                                Attached Evidence
                                            </span>
                                            <img
                                                src={image}
                                                alt="Incident Evidence"
                                                className="w-28 h-20 object-cover rounded-lg border border-slate-300 shadow-xs"
                                            />
                                        </div>
                                    )}

                                    {isAdmin && (
                                        <button
                                            onClick={() => onDeleteComment(c.id)}
                                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1 text-xs font-bold"
                                            title="Delete spam or inappropriate comment"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
