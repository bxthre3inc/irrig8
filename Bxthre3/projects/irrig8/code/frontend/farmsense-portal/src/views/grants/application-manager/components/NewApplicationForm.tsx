import React, { Save } from 'lucide-react';
import { Save as SaveIcon } from 'lucide-react';

interface NewApplicationFormProps {
    newForm: {
        grant: string;
        agency: string;
        ask: string;
        deadline: string;
        owner: string;
        notes: string;
    };
    handleFormChange: (key: any, value: string) => void;
    handleCreate: () => void;
    handleSaveDraft: () => void;
    setShowNew: (show: boolean) => void;
}

export const NewApplicationForm: React.FC<NewApplicationFormProps> = ({
    newForm,
    handleFormChange,
    handleCreate,
    handleSaveDraft,
    setShowNew
}) => {
    return (
        <div className="bg-slate-900 border border-indigo-800/40 rounded-xl p-5 space-y-3">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">New Application</p>
            <p className="text-[10px] text-slate-500">Fields prefilled from your grant profile. Every change saves automatically.</p>
            <div className="grid grid-cols-2 gap-3">
                <input placeholder="Grant title" value={newForm.grant}
                    onChange={e => handleFormChange('grant', e.target.value)}
                    className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none" />
                <input placeholder="Agency / Funder" value={newForm.agency}
                    onChange={e => handleFormChange('agency', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none" />
                <input placeholder="Ask amount (e.g. $2.4M)" value={newForm.ask}
                    onChange={e => handleFormChange('ask', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none" />
                <input type="date" value={newForm.deadline}
                    onChange={e => handleFormChange('deadline', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none" />
                <input placeholder="Owner / PI" value={newForm.owner}
                    onChange={e => handleFormChange('owner', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none" />
                <textarea placeholder="Notes…" value={newForm.notes}
                    onChange={e => handleFormChange('notes', e.target.value)} rows={2}
                    className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none" />
            </div>
            <div className="flex gap-2">
                <button onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    Submit to Pipeline
                </button>
                <button onClick={handleSaveDraft}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-300 border border-slate-700 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                    <SaveIcon className="w-3 h-3" /> Save Draft
                </button>
                <button onClick={() => setShowNew(false)} className="text-slate-500 text-xs px-3 py-2 hover:text-slate-300 transition-colors">Cancel</button>
            </div>
        </div>
    );
};
