import React, { useState } from 'react';
import { Wrench, Plus, SlidersHorizontal, Star } from 'lucide-react';

// Modular imports
import { Integration, Tab, WizardStep } from './lab-integration/types';
import { MOCK_INTEGRATIONS, INSTRUMENT_TYPES, FORMATS, FIELDS } from './lab-integration/constants';
import { RegistryTab } from './lab-integration/components/RegistryTab';
import { SetupWizardTab } from './lab-integration/components/SetupWizardTab';
import { CalibrationTab } from './lab-integration/components/CalibrationTab';
import { ScoringTab } from './lab-integration/components/ScoringTab';

export const LabIntegrationBridge: React.FC = () => {
    const [tab, setTab] = useState<Tab>('registry');
    const [wizardStep, setWizardStep] = useState<WizardStep>(0);
    const [wizardData, setWizardData] = useState({
        type: INSTRUMENT_TYPES[0],
        endpoint: '',
        format: FORMATS[0],
        field: FIELDS[0].id,
        frequency: '15'
    });
    const [selectedInt, setSelectedInt] = useState<Integration>(MOCK_INTEGRATIONS[0]);
    const [calibAccepted, setCalibAccepted] = useState<Set<string>>(new Set());

    const toggleCalibAccept = (id: string) => setCalibAccepted(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-rose-600/20 p-2 rounded-lg"><Wrench className="w-5 h-5 text-rose-400" /></div>
                <div className="flex-1">
                    <h2 className="font-bold text-white text-sm tracking-wide">Instrument & Lab Integration Bridge</h2>
                    <p className="text-[10px] text-rose-500 font-mono uppercase tracking-widest">Connect external instruments and laboratory data sources</p>
                </div>
                <button onClick={() => { setTab('wizard'); setWizardStep(0); }}
                    className="flex items-center gap-1.5 bg-rose-700/30 hover:bg-rose-600/40 border border-rose-800/40 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                    <Plus className="w-3.5 h-3.5" /> New Integration
                </button>
            </div>

            <div className="flex border-b border-purple-900/20 bg-black/20 px-6 overflow-x-auto">
                {([['registry', 'Registry', Wrench], ['wizard', 'Setup Wizard', Plus], ['calibration', 'Calibration', SlidersHorizontal], ['scoring', 'Quality Scores', Star]] as [Tab, string, any][]).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`py-3 px-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${tab === id ? 'border-rose-500 text-rose-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {tab === 'registry' && (
                    <RegistryTab
                        integrations={MOCK_INTEGRATIONS}
                        setSelectedInt={setSelectedInt}
                        setTab={setTab}
                    />
                )}

                {tab === 'wizard' && (
                    <SetupWizardTab
                        wizardStep={wizardStep}
                        setWizardStep={setWizardStep}
                        wizardData={wizardData}
                        setWizardData={setWizardData}
                        setTab={setTab}
                    />
                )}

                {tab === 'calibration' && (
                    <CalibrationTab
                        selectedInt={selectedInt}
                        setSelectedInt={setSelectedInt}
                        calibAccepted={calibAccepted}
                        toggleCalibAccept={toggleCalibAccept}
                    />
                )}

                {tab === 'scoring' && (
                    <ScoringTab
                        integrations={MOCK_INTEGRATIONS}
                    />
                )}
            </div>
        </div>
    );
};

export default LabIntegrationBridge;
