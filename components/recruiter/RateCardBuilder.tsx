'use client';

import React, { useState } from 'react';
import { RateCardItem, ContractType } from '../../lib/recruiterTypes';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Copy,
  Edit,
  Download,
  Printer,
  Check,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

export const RateCardBuilder: React.FC = () => {
  const [rateCards, setRateCards] = useState<RateCardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<RateCardItem, 'id'>>({
    jobTitle: '',
    seniority: 'Senior',
    location: '',
    contractType: 'C2C',
    minPayRate: 0,
    maxPayRate: 0,
    targetPayRate: 0,
    targetBillRate: 0,
    targetMarginPercent: 25,
    currency: 'USD',
  });

  const handleSave = () => {
    if (!formData.jobTitle) return;

    if (editingId) {
      setRateCards((prev) =>
        prev.map((card) => (card.id === editingId ? { ...formData, id: editingId } : card))
      );
      setEditingId(null);
    } else {
      const newCard: RateCardItem = {
        ...formData,
        id: `rc-${Date.now()}`,
      };
      setRateCards((prev) => [...prev, newCard]);
    }

    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      seniority: 'Senior',
      location: '',
      contractType: 'C2C',
      minPayRate: 0,
      maxPayRate: 0,
      targetPayRate: 0,
      targetBillRate: 0,
      targetMarginPercent: 25,
      currency: 'USD',
    });
  };

  const handleEdit = (card: RateCardItem) => {
    setFormData({
      jobTitle: card.jobTitle,
      seniority: card.seniority,
      location: card.location,
      contractType: card.contractType,
      minPayRate: card.minPayRate,
      maxPayRate: card.maxPayRate,
      targetPayRate: card.targetPayRate,
      targetBillRate: card.targetBillRate,
      targetMarginPercent: card.targetMarginPercent,
      currency: card.currency,
    });
    setEditingId(card.id);
    setIsAdding(true);
  };

  const handleDuplicate = (card: RateCardItem) => {
    const dupCard: RateCardItem = {
      ...card,
      id: `rc-${Date.now()}`,
      jobTitle: `${card.jobTitle} (Copy)`,
    };
    setRateCards((prev) => [...prev, dupCard]);
  };

  const handleDelete = (id: string) => {
    setRateCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleExportCsv = () => {
    const headers = ['Job Title', 'Seniority', 'Location', 'Contract Type', 'Min Pay', 'Max Pay', 'Target Pay', 'Target Bill', 'Margin %'];
    const rows = rateCards.map((c) => [
      `"${c.jobTitle}"`,
      c.seniority,
      `"${c.location}"`,
      c.contractType,
      c.minPayRate,
      c.maxPayRate,
      c.targetPayRate,
      c.targetBillRate,
      c.targetMarginPercent,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PayScope_Recruit_Rate_Cards.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCards = rateCards.filter(
    (card) =>
      card.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Recruiter Tool
            </span>
            <span className="text-slate-400 text-xs font-semibold">{rateCards.length} Rate Cards</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>Rate Card Builder</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create standard rate cards by role, seniority, location, and target margin for quick client quoting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              resetForm();
              setEditingId(null);
              setIsAdding(!isAdding);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role Rate Card</span>
          </button>

          {rateCards.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Form Drawer */}
      {isAdding && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-indigo-100 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {editingId ? 'Edit Rate Card' : 'Create New Role Rate Card'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Job Title *</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Data Analyst"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Seniority</label>
              <select
                value={formData.seniority}
                onChange={(e) => setFormData({ ...formData, seniority: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Principal">Principal</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Toronto / Remote"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contract Type</label>
              <select
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
              >
                <option value="C2C">C2C</option>
                <option value="W2">W2</option>
                <option value="1099">1099</option>
                <option value="Incorporated">Incorporated</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Pay Rate ($/hr)</label>
              <input
                type="number"
                value={formData.minPayRate || ''}
                onChange={(e) => setFormData({ ...formData, minPayRate: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 60"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Bill Rate ($/hr)</label>
              <input
                type="number"
                value={formData.targetBillRate || ''}
                onChange={(e) => setFormData({ ...formData, targetBillRate: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 90"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? 'Update Rate Card' : 'Save Rate Card'}</span>
            </button>
          </div>
        </div>
      )}

      {rateCards.length === 0 ? (
        /* Zero Initial State */
        <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 mx-auto bg-white text-slate-400 rounded-2xl flex items-center justify-center border">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-extrabold text-slate-900 text-base">No rate cards yet</h4>
            <p className="text-xs text-slate-500">
              Create your first role rate card for quick client quoting.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role Rate Card</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Role / Seniority</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Pay Rate</th>
                <th className="p-3.5">Target Bill Rate</th>
                <th className="p-3.5">Target Margin</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{card.jobTitle}</td>
                  <td className="p-3.5 text-slate-600">{card.location || 'Unspecified'}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{card.contractType}</td>
                  <td className="p-3.5 font-bold text-slate-900">${card.minPayRate}/hr</td>
                  <td className="p-3.5 font-extrabold text-indigo-700">${card.targetBillRate}/hr</td>
                  <td className="p-3.5 font-extrabold text-emerald-600">{card.targetMarginPercent}%</td>
                  <td className="p-3.5 text-right space-x-1">
                    <button onClick={() => handleEdit(card)} className="p-1 text-slate-500 hover:text-slate-900">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(card.id)} className="p-1 text-rose-500 hover:text-rose-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
