"use client";

import { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
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
            } finally {
                 setIsLoading(false);
            }
        };
        fetchVocabularies();
    }, []);

    useEffect(() => {
        const results = Object.values(selectionMap).map(sel => {
            // Find the property across all available vocabularies since dropdown is removed
            let foundProp: Property | undefined;
            for (const vocab of data) {
                foundProp = vocab.properties.find(p => Number(p.id) === Number(sel.propertyId));
                if (foundProp) break;
            }

            const fallbackLabel = foundProp?.label || '';
            const altLabel = sel.alternateLabel && sel.alternateLabel.trim() !== '' ? sel.alternateLabel.trim() : fallbackLabel;
            
            return {
                ...sel,
                propertyId: Number(sel.propertyId),
                alternateLabel: altLabel
            };
        });

        onChange(results);
    }, [selectionMap, data, onChange]);

    const toggleProperty = (prop: Property) => {
        setSelectionMap(prev => {
            const propIdNum = Number(prop.id);
            const exists = !!prev[propIdNum];
            const newMap = { ...prev };
            if (exists) {
                delete newMap[propIdNum];
            } else {
                newMap[propIdNum] = {
                    propertyId: propIdNum,
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
            const idNum = Number(id);
            const item = prev[idNum];
            if (!item) return prev;
            return { ...prev, [idNum]: { ...item, [field]: value } };
        });
    };

    if (isLoading) return <div className="p-4 text-zinc-500 animate-pulse border border-zinc-200 rounded-xl bg-zinc-50">Loading vocabularies...</div>;

    return (
        <div className="w-full border border-gray-300 rounded-xl h-64 overflow-y-auto p-4 bg-white shadow-sm">
            {data.map((vocab) => (
                <div key={vocab.id} className="mb-4">
                    <h3 className="font-bold text-xs uppercase text-blue-600 border-b mb-2 pb-1">
                        {vocab.label}
                    </h3>
                    <div className="space-y-1">
                        {vocab.properties?.map((prop) => {
                            const selected = !!selectionMap[prop.id];
                            const sel = selectionMap[prop.id];
                            
                            const altLabelId = `alt-label-${prop.id}`;
                            const displayOrderId = `display-order-${prop.id}`;

                            return (
                                <div key={prop.id} className={`p-3 rounded-xl border transition-all ${selected ? 'bg-white border-zinc-300 shadow-sm' : 'border-transparent hover:bg-zinc-100'}`}>
                                    <div className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            id={`prop-checkbox-${prop.id}`}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                                            checked={selected}
                                            onChange={() => toggleProperty(prop)}
                                        />
                                        <div className="flex-1">
                                            <label 
                                                htmlFor={`prop-checkbox-${prop.id}`} 
                                                className="text-sm text-gray-700 select-none cursor-pointer font-medium"
                                            >
                                                {prop.label} ({prop.localName})
                                            </label>

                                            {selected && (
                                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <label htmlFor={altLabelId} className="block text-gray-500 mb-1">
                                                            Alternate Label
                                                        </label>
                                                        <input
                                                            id={altLabelId}
                                                            type="text"
                                                            placeholder="Enter alternate label"
                                                            value={sel?.alternateLabel ?? ''}
                                                            onChange={(e) => updateField(prop.id, 'alternateLabel', e.target.value || null)}
                                                            className="w-full p-1 border rounded"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={displayOrderId} className="block text-gray-500 mb-1">
                                                            Display Order
                                                        </label>
                                                        <input
                                                            id={displayOrderId}
                                                            type="number"
                                                            placeholder="0"
                                                            value={sel?.displayOrder ?? 0}
                                                            onChange={(e) => updateField(prop.id, 'displayOrder', Number(e.target.value))}
                                                            className="w-full p-1 border rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};