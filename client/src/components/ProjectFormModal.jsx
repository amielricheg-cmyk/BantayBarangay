import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../services/api';

export default function ProjectFormModal({ initialData, onClose, onSave }) {
    const [form, setForm] = useState({
        project_title: initialData?.project_title || '',
        sector_id: initialData?.sector_id || 1,
        budget_allocated: initialData?.budget_allocated || '',
        budget_spent: initialData?.budget_spent || '',
        status: initialData?.status || 'Ongoing',
        target_beneficiaries: initialData?.target_beneficiaries || '',
        start_date: initialData?.start_date ? initialData.start_date.split('T')[0] : '',
        target_date: initialData?.target_date ? initialData.target_date.split('T')[0] : '',
        image_url: initialData?.image_url || ''
    });
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const compressed = await compressImage(file);
            setForm((prev) => ({ ...prev, image_url: compressed }));
        } catch (err) {
            alert('Hindi ma-process ang image. Pumili ng ibang litrato.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
                <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                    <h3 className="font-bold text-base">
                        {initialData ? 'Edit Project & Completion Photo' : 'Add New Barangay Project'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-sm">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
                        <input
                            required
                            type="text"
                            value={form.project_title}
                            onChange={(e) => setForm({ ...form, project_title: e.target.value })}
                            placeholder="Halimbawa: Pook 4 Solar Streetlight Installation"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Sector Committee *</label>
                            <select
                                value={form.sector_id}
                                onChange={(e) => setForm({ ...form, sector_id: Number(e.target.value) })}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600 bg-white"
                            >
                                <option value={1}>Infrastructure & Public Works</option>
                                <option value={2}>Health & Sanitation</option>
                                <option value={3}>Education & Youth (SK)</option>
                                <option value={4}>Peace, Order & Disaster Risk</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Project Status *</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600 bg-white"
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Done">Done (Completed)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Budget Allocated (₱) *</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={form.budget_allocated}
                                onChange={(e) => setForm({ ...form, budget_allocated: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Actual Budget Spent (₱) *</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={form.budget_spent}
                                onChange={(e) => setForm({ ...form, budget_spent: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Target Completion Date</label>
                            <input
                                type="date"
                                value={form.target_date}
                                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Target Beneficiaries</label>
                        <input
                            type="text"
                            value={form.target_beneficiaries}
                            onChange={(e) => setForm({ ...form, target_beneficiaries: e.target.value })}
                            placeholder="Halimbawa: 500 Households in Zone 3"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-600"
                        />
                    </div>

                    {/* Official Project Photo Upload */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                            <ImageIcon size={15} className="text-blue-600" />
                            Project Documentation / Completion Photo (Visible to Residents)
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition">
                                <Upload size={14} />
                                {uploading ? 'Compressing...' : 'Choose Project Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                            {form.image_url && (
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, image_url: '' })}
                                    className="text-xs text-rose-600 font-semibold hover:underline"
                                >
                                    Remove Photo
                                </button>
                            )}
                        </div>
                        {form.image_url && (
                            <img
                                src={form.image_url}
                                alt="Preview"
                                className="mt-3 h-32 w-full object-cover rounded-xl border border-slate-200"
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow"
                        >
                            {initialData ? 'Save Changes' : 'Publish Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
