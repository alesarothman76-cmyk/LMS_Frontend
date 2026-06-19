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
        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-700 text-sm font-bold border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-left pl-8">Original property name</th>
                            <th className="p-4 text-center w-28">Required?</th>
                            <th className="p-4 text-center w-24">Display order</th>
                            <th className="p-4 text-left">Alternate label</th>
                            <th className="p-4 text-center w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {properties.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-400 font-medium bg-gray-50/50">
                                    No properties are linked to this template yet. Enter a property ID above to get started.
                                </td>
                            </tr>
                        ) : (
                            properties.map((item) => (
                                <tr key={item.propertyId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900 text-left pl-8">
                                        {item.propertyName || `System property #${item.propertyId}`}
                                    </td>
                                    <td className="p-4 text-center">
                                        <label htmlFor={`required-${item.propertyId}`} className="sr-only">Required</label>
                                        <input 
                                            type="checkbox"
                                            className="w-5 h-5 rounded text-emerald-600 border-gray-300 cursor-pointer"
                                            id={`required-${item.propertyId}`}
                                            title="Required?"
                                            checked={item.isRequired}
                                            onChange={(e) => onFieldChange(item.propertyId, 'isRequired', e.target.checked)}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <label htmlFor={`displayOrder-${item.propertyId}`} className="sr-only">Display Order</label>
                                        <input 
                                            type="number"
                                            className="w-16 p-2 text-center bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-blue-500"
                                            id={`displayOrder-${item.propertyId}`}
                                            title="Display Order"
                                            value={item.displayOrder}
                                            onChange={(e) => onFieldChange(item.propertyId, 'displayOrder', Number(e.target.value))}
                                        />
                                    </td>
                                    <td className="p-4 text-left">
                                        <input 
                                            type="text"
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-left"
                                            id={`alternateLabel-${item.propertyId}`}
                                            title="Alternate Label"
                                            value={item.alternateLabel || ''}
                                            placeholder="No alternate label"
                                            onChange={(e) => onFieldChange(item.propertyId, 'alternateLabel', e.target.value || null)}
                                        />
                                    </td>
                                    <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => onUpdateRow(item)}
                                            className="px-3 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors text-xs cursor-pointer"
                                        >
                                            Save changes
                                        </button>
                                        <button
                                            onClick={() => onRemoveRow(item.propertyId)}
                                            className="px-3 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-xs cursor-pointer"
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