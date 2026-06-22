import { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { mockVocabularies } from '../mock/vocabularies';
import { PropertyToTemplateInput } from '../types';

export interface Property {
    id: number;
    label: string;
    localName: string;
}

export interface Vocabulary {
    id: number;
    label: string;
    properties: Property[];
}

interface Props {
    onChange: (properties: PropertyToTemplateInput[]) => void;
}

export const TemplatePropertySelector = ({ onChange }: Props) => {
    const [data, setData] = useState<Vocabulary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVocabId, setSelectedVocabId] = useState<number | ''>('');
    const [selectionMap, setSelectionMap] = useState<Record<number, PropertyToTemplateInput>>({});

    useEffect(() => {
        const fetchVocabularies = async () => {
            try {
                const response = await resourceService.getVocabulariesWithProperties();
                const fetched = response as Vocabulary[] | undefined;
                if (!fetched || fetched.length === 0) {
                    setData([]);
                } else {
                    setData(fetched);
                }
            } catch (err) {
                console.error("Error loading vocabularies, falling back to mock data", err);
                setData(mockVocabularies);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVocabularies();
    }, []);

    useEffect(() => {
        if (!selectedVocabId) {
            onChange([]);
            return;
        }
        const vocab = data.find(v => v.id === selectedVocabId);
        if (!vocab) {
            onChange([]);
            return;
        }

        const results = Object.values(selectionMap).map(sel => {
            const prop = vocab.properties.find(p => p.id === sel.propertyId);
            const fallbackLabel = prop?.label || '';
            const altLabel = sel.alternateLabel && sel.alternateLabel.trim() !== '' ? sel.alternateLabel.trim() : fallbackLabel;
            return {
                ...sel,
                alternateLabel: altLabel
            };
        });

        onChange(results);
    }, [selectionMap, selectedVocabId, data, onChange]);

    const handleVocabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedVocabId(val ? Number(val) : '');
        setSelectionMap({}); // Clear selections when changing vocab
    };

    const toggleProperty = (prop: Property) => {
        setSelectionMap(prev => {
            const exists = !!prev[prop.id];
            const newMap = { ...prev };
            if (exists) {
                delete newMap[prop.id];
            } else {
                newMap[prop.id] = {
                    propertyId: prop.id,
                    isRequired: false,
                    displayOrder: Object.keys(prev).length + 1,
                    alternateLabel: prop.label
                };
            }
            return newMap;
        });
    };

    const updateField = (id: number, field: keyof PropertyToTemplateInput, value: string | number | boolean | null) => {
        setSelectionMap(prev => {
            const item = prev[id];
            if (!item) return prev;
            return { ...prev, [id]: { ...item, [field]: value } };
        });
    };

    if (isLoading) return <div className="p-4 text-zinc-500 animate-pulse border border-zinc-200 rounded-xl bg-zinc-50">Loading vocabularies...</div>;

    const selectedVocab = data.find(v => v.id === selectedVocabId);

    return (
        <div className="w-full border border-zinc-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-6">
            <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">1. Select Vocabulary</label>
                <select 
                    value={selectedVocabId} 
                    onChange={handleVocabChange}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all cursor-pointer"
                >
                    <option value="">-- Choose a vocabulary --</option>
                    {data.map(vocab => (
                        <option key={vocab.id} value={vocab.id}>{vocab.label}</option>
                    ))}
                </select>
            </div>

            {selectedVocab && (
                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">2. Select Properties</label>
                    <div className="h-64 overflow-y-auto pr-2 space-y-2 border border-zinc-100 rounded-xl p-2 bg-zinc-50/50">
                        {selectedVocab.properties?.map((prop) => {
                            const selected = !!selectionMap[prop.id];
                            const sel = selectionMap[prop.id];
                            return (
                                <div key={prop.id} className={`p-3 rounded-xl border transition-all ${selected ? 'bg-white border-zinc-300 shadow-sm' : 'border-transparent hover:bg-zinc-100'}`}>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                                            checked={selected}
                                            onChange={() => toggleProperty(prop)}
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-bold text-zinc-800 select-none cursor-pointer" onClick={() => toggleProperty(prop)}>
                                                {prop.label} <span className="text-zinc-400 font-normal ml-1">({prop.localName})</span>
                                            </span>
                                        </div>
                                    </div>

                                    {selected && (
                                        <div className="mt-4 pl-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                            <div className="sm:col-span-1">
                                                <label className="block text-zinc-500 font-bold mb-1">Alternate Label</label>
                                                <input
                                                    value={sel?.alternateLabel ?? ''}
                                                    onChange={(e) => updateField(prop.id, 'alternateLabel', e.target.value)}
                                                    placeholder={prop.label}
                                                    className="w-full p-2.5 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all bg-zinc-50 font-medium text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-zinc-500 font-bold mb-1">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={sel?.displayOrder ?? 0}
                                                    onChange={(e) => updateField(prop.id, 'displayOrder', Number(e.target.value))}
                                                    className="w-full p-2.5 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all bg-zinc-50 text-center font-bold text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700 font-bold hover:text-zinc-900 transition-colors select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={sel?.isRequired ?? false}
                                                        onChange={(e) => updateField(prop.id, 'isRequired', e.target.checked)}
                                                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                                                    />
                                                    Required property
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};