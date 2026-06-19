"use client";

import React, { useState } from 'react';

interface AddPropertyFormProps {
    onAddProperty: (newProperty: {
        propertyId: string;
        isRequired: boolean;
        displayOrder: string;
        alternateLabel: string;
    }) => Promise<void>;
    isAdding: boolean;
    totalProperties: number;
}

export default function AddPropertyForm({ onAddProperty, isAdding, totalProperties }: AddPropertyFormProps) {
    const [newProperty, setNewProperty] = useState({
        propertyId: '',
        isRequired: false,
        displayOrder: '', 
        alternateLabel: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProperty.propertyId) return;
        
        await onAddProperty(newProperty);
        
        setNewProperty({
            propertyId: '',
            isRequired: false,
            displayOrder: '',
            alternateLabel: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-blue-50/20 border border-blue-100/70 rounded-2xl text-right">
            <h2 className="text-base font-black text-blue-700 mb-4">➕ Link and add a new property to the template</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-2">Property ID *</label>
                    <input 
                        type="number"
                        required
                        placeholder="Property ID from DB"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-center font-bold text-sm focus:border-blue-500 transition-colors"
                        value={newProperty.propertyId}
                        onChange={e => setNewProperty({...newProperty, propertyId: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-2">Alternate label in template (optional)</label>
                    <input 
                        type="text"
                        placeholder="Alternate Label"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-right text-sm focus:border-blue-500 transition-colors"
                        value={newProperty.alternateLabel}
                        onChange={e => setNewProperty({...newProperty, alternateLabel: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">Display order</label>
                        <input 
                            type="number"
                            min="1"
                            placeholder={String(totalProperties + 1)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-center font-bold text-sm focus:border-blue-500 transition-colors"
                            value={newProperty.displayOrder}
                            onChange={e => setNewProperty({...newProperty, displayOrder: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center justify-center pb-3">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700 select-none">
                            <input 
                                type="checkbox"
                                className="w-4 h-4 rounded text-blue-600 border-gray-300 cursor-pointer"
                                checked={newProperty.isRequired}
                                onChange={e => setNewProperty({...newProperty, isRequired: e.target.checked})}
                            />
                            Required field?
                        </label>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isAdding || !newProperty.propertyId}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md disabled:bg-gray-200 disabled:text-gray-400 transition-colors text-sm cursor-pointer"
                    >
                        {isAdding ? "Linking and adding..." : "Link and add property"}
                    </button>
                </div>
            </div>
        </form>
    );
}