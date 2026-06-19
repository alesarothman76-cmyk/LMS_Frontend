// features/resourceTemplate/component/TemplatePropertySelector.tsx

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

    // فصل تحديث الحالة عن إشعار المكون الأب، وتشغيل onChange بأمان عند استقرار selectionMap
    useEffect(() => {
        if (Object.keys(selectionMap).length > 0) {
            onChange(Object.values(selectionMap));
        } else {
            onChange([]);
        }
    }, [selectionMap, onChange]);

    const toggleProperty = (id: number) => {
        setSelectionMap(prev => {
            const exists = !!prev[id];
            const newMap = { ...prev };
            if (exists) {
                delete newMap[id];
            } else {
                newMap[id] = {
                    propertyId: id,
                    isRequired: false,
                    displayOrder: Object.keys(prev).length,
                    alternateLabel: null
                };
            }
            return newMap;
        });
    };

    const updateField = (id: number, field: keyof PropertyToTemplateInput, value: string | number | boolean | null) => {
        setSelectionMap(prev => {
            const item = prev[id];
            if (!item) return prev;
            const updated = { ...item, [field]: value } as PropertyToTemplateInput;
            return { ...prev, [id]: updated };
        });
    };

    if (isLoading) return <p>Loading...</p>;

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
                            return (
                                <div key={prop.id} className="flex items-start space-x-3 p-1 hover:bg-blue-50 rounded transition">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={selected}
                                            onChange={() => toggleProperty(prop.id)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 select-none">
                                                {prop.label} ({prop.localName})
                                            </span>
                                        </div>

                                        {selected && (
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <label className="block text-gray-500">Alternate Label</label>
                                                    <input
                                                        value={sel?.alternateLabel ?? ''}
                                                        onChange={(e) => updateField(prop.id, 'alternateLabel', e.target.value || null)}
                                                        className="w-full p-1 border rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-500">Display Order</label>
                                                    <input
                                                        type="number"
                                                        value={sel?.displayOrder ?? 0}
                                                        onChange={(e) => updateField(prop.id, 'displayOrder', Number(e.target.value))}
                                                        className="w-full p-1 border rounded"
                                                    />
                                                </div>
                                            </div>
                                        )}
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