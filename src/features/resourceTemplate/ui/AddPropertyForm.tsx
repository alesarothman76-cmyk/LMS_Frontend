"use client";

import React, { useState } from 'react';

export interface PropertyItem {
    id: string | number;
    name: string; 
}

interface AddPropertyFormProps {
    availableProperties: PropertyItem[];
    onAddProperty: (newProperty: {
        propertyId: string;
        isRequired: boolean;
        displayOrder: string;
        alternateLabel: string;
    }) => Promise<void>;
    isAdding: boolean;
    totalProperties: number;
}

export default function AddPropertyForm({ 
    availableProperties, 
    onAddProperty, 
    isAdding, 
    totalProperties 
}: AddPropertyFormProps) {
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
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <h2 className="text-base font-black text-zinc-900 mb-6 flex items-center gap-2">
                <span className="bg-zinc-200 w-8 h-8 rounded-full flex items-center justify-center text-sm">+</span> 
                Link New Property
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div>
                    <label className="block text-xs font-bold text-zinc-600 mb-2">Select Property *</label>
                    <select 
                        required
                        className="w-full p-3 bg-white border border-zinc-200 rounded-xl outline-none font-bold text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all cursor-pointer"
                        value={newProperty.propertyId}
                        onChange={e => setNewProperty({...newProperty, propertyId: e.target.value})}
                    >
                        <option value="" disabled>-- Choose a property --</option>
                        {availableProperties.map(prop => (
                            <option key={prop.id} value={prop.id}>
                                {prop.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-600 mb-2">Alternate Label (Optional)</label>
                    <input 
                        type="text"
                        placeholder="Label"
                        className="w-full p-3 bg-white border border-zinc-200 rounded-xl outline-none text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                        value={newProperty.alternateLabel}
                        onChange={e => setNewProperty({...newProperty, alternateLabel: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-600 mb-2">Order</label>
                        <input 
                            type="number"
                            min="1"
                            placeholder={String(totalProperties + 1)}
                            className="w-full p-3 bg-white border border-zinc-200 rounded-xl outline-none font-bold text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all text-center"
                            value={newProperty.displayOrder}
                            onChange={e => setNewProperty({...newProperty, displayOrder: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center justify-center pb-3">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-zinc-700 hover:text-zinc-900 select-none">
                            <input 
                                type="checkbox"
                                className="w-5 h-5 rounded text-zinc-900 border-zinc-300 cursor-pointer accent-zinc-900"
                                checked={newProperty.isRequired}
                                onChange={e => setNewProperty({...newProperty, isRequired: e.target.checked})}
                            />
                            Required
                        </label>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isAdding || !newProperty.propertyId}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:shadow-none transition-all text-sm cursor-pointer border-0"
                    >
                        {isAdding ? "Linking..." : "Link Property"}
                    </button>
                </div>
            </div>
        </form>
    );
}