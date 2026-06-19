"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { resourceService } from '../../../../../features/resourceTemplate/services/resourceService';
import { TemplatePropertyItem } from '../../../../../features/resourceTemplate/types';
import { useTemplateDetails } from '../../../../../features/resourceTemplate/hooks/useTemplateDetails';
import AddPropertyForm from '../../../../../features/resourceTemplate/ui/AddPropertyForm';
import PropertiesTable from '../../../../../features/resourceTemplate/ui/PropertiesTable';

export default function ManageTemplatePropertiesPage() {
    const params = useParams();
    const templateId = Number(params.templateId);
    const router = useRouter();

    const { linkedProperties, isLoading, actionError, refresh, setActionError, setLinkedProperties } = useTemplateDetails(templateId);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddProperty = async (newProp: { propertyId: string; isRequired: boolean; displayOrder: string; alternateLabel: string }) => {
        setIsAdding(true);
        setActionError(null);

        const finalDisplayOrder = newProp.displayOrder !== '' 
            ? Number(newProp.displayOrder) 
            : linkedProperties.length + 1;

        try {
            await resourceService.addPropertiesToTemplate(templateId, [
            {
                propertyId: Number(newProp.propertyId),
                isRequired: newProp.isRequired,
                displayOrder: finalDisplayOrder,
                alternateLabel: newProp.alternateLabel || null
            }
        ]);

            await refresh();
            alert("Property linked to template successfully!");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setActionError(axiosError.response?.data?.message || "Failed to link the property. It may already be added to this template.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdateRow = async (item: TemplatePropertyItem) => {
        setActionError(null);
        try {
            await resourceService.updatePropertyInTemplate(templateId, item.propertyId, {
                isRequired: item.isRequired,
                displayOrder: item.displayOrder,
                alternateLabel: item.alternateLabel
            });
            await refresh();
            alert("Property settings updated successfully!");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setActionError(axiosError.response?.data?.message || "Failed to update the property details.");
        }
    };

    const handleRemoveRow = async (propertyId: number) => {
        if (!confirm("Are you sure you want to unlink and remove this property from the template?")) return;

        setActionError(null);
        try {
            await resourceService.removePropertyFromTemplate(templateId, propertyId);
            await refresh();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setActionError(axiosError.response?.data?.message || "Failed to remove the property from the template.");
        }
    };

    const handleLocalFieldChange = (propertyId: number, key: keyof TemplatePropertyItem, value: unknown) => {
        setLinkedProperties((prev: TemplatePropertyItem[]) => prev.map((item) => 
            item.propertyId === propertyId ? { ...item, [key]: value } : item
        ));
    };

    // حالة التحميل المعياري (Early Return)
    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto my-32 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50 text-center">
                <div className="font-bold text-gray-500 animate-pulse">Loading current template properties...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto my-12 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50">
            {/* Header and title */}
            <div className="mb-8 text-right border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-black text-gray-900">Template Properties Management Panel</h1>
                <p className="text-gray-500 mt-2">Add new properties, update existing links, or remove them from the template.</p>
            </div>

            {/* General error panel */}
            {actionError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium text-right">
                    ⚠️ {actionError}
                </div>
            )}

            {/* Add property section component */}
            <AddPropertyForm 
                onAddProperty={handleAddProperty} 
                isAdding={isAdding} 
                totalProperties={linkedProperties.length} 
            />

            {/* Table of current properties component */}
            <PropertiesTable 
                properties={linkedProperties}
                onFieldChange={handleLocalFieldChange}
                onUpdateRow={handleUpdateRow}
                onRemoveRow={handleRemoveRow}
            />
            
            {/* Back button */}
            <div className="mt-8 text-right">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all text-sm cursor-pointer"
                >
                    Back to template main page
                </button>
            </div>
        </div>
    );
}