"use client";

import React from 'react';
import { TemplatePropertyItem } from '../types';

interface PropertiesTableProps {
    properties: TemplatePropertyItem[];
    onFieldChange: (propertyId: number, key: keyof TemplatePropertyItem, value: unknown) => void;
    onUpdateRow: (item: TemplatePropertyItem) => Promise<void>;
    onRemoveRow: (propertyId: number) => Promise<void>;
}

export default function PropertiesTable({ properties, onFieldChange, onUpdateRow, onRemoveRow }: PropertiesTableProps) {
    return (
        <div className="overflow-hidden border border-zinc-200 rounded-2xl shadow-sm bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50 text-zinc-600 text-xs uppercase tracking-wider font-bold border-b border-zinc-200">
                        <tr>
                            <th className="p-4 pl-6">Property Name</th>
                            <th className="p-4 text-center w-28">Required</th>
                            <th className="p-4 text-center w-32">Display Order</th>
                            <th className="p-4 text-left">Alternate Label</th>
                            <th className="p-4 text-center w-48">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-sm">
                        {properties.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-zinc-500 font-medium bg-zinc-50/50">
                                    No properties are linked to this template yet.
                                </td>
                            </tr>
                        ) : (
                            properties.map((item) => (
                                <tr key={item.propertyId} className="hover:bg-zinc-50/80 transition-colors">
                                    <td className="p-4 font-bold text-zinc-900 pl-6">
                                        {item.propertyName || `Property #${item.propertyId}`}
                                    </td>
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox"
                                            className="w-5 h-5 rounded text-zinc-900 border-zinc-300 cursor-pointer accent-zinc-900"
                                            checked={item.isRequired}
                                            onChange={(e) => onFieldChange(item.propertyId, 'isRequired', e.target.checked)}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input 
                                            type="number"
                                            className="w-20 p-2 text-center bg-zinc-50 border border-zinc-200 rounded-lg font-bold outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                                            value={item.displayOrder}
                                            onChange={(e) => onFieldChange(item.propertyId, 'displayOrder', Number(e.target.value))}
                                        />
                                    </td>
                                    <td className="p-4 text-left">
                                        <input 
                                            type="text"
                                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 text-left"
                                            value={item.alternateLabel || ''}
                                            placeholder="Default label"
                                            onChange={(e) => onFieldChange(item.propertyId, 'alternateLabel', e.target.value || null)}
                                        />
                                    </td>
                                    <td className="p-4 flex gap-2 justify-center">
                                        <button
                                            onClick={() => onUpdateRow(item)}
                                            className="px-3 py-2 bg-zinc-100 text-zinc-800 font-bold rounded-lg hover:bg-zinc-200 transition-colors text-xs cursor-pointer border-0"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => onRemoveRow(item.propertyId)}
                                            className="px-3 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors text-xs cursor-pointer border-0"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}