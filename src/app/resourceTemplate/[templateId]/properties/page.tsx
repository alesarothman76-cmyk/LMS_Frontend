"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { resourceService } from '../../../../features/resourceTemplate/services/resourceService';

interface TemplatePropertyItem {
    propertyId: number;
    propertyName: string;
    isRequired: boolean;
    displayOrder: number;
    alternateLabel: string | null;
}

export default function ManageTemplatePropertiesPage() {
    const params = useParams();
    const templateId = Number(params.templateId);
    const router = useRouter();

    const [linkedProperties, setLinkedProperties] = useState<TemplatePropertyItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [newProperty, setNewProperty] = useState({
        propertyId: '',
        isRequired: false,
        displayOrder: '', 
        alternateLabel: ''
    });

    const fetchTemplateDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5005/api/ResourceTemplate/${templateId}`);
            setLinkedProperties(response.data.properties || response.data.value?.properties || []);
        } catch (error) {
            console.error("error", error);
            setActionError("فشل في جلب بيانات القالب من السيرفر.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
    const fetchTemplateDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5005/api/ResourceTemplate/${templateId}`);
            setLinkedProperties(response.data.properties || response.data.value?.properties || []);
        } catch (error) {
            console.error("error", error);
            setActionError("failed to fetch template details from server.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchTemplateDetails();
}, [templateId]);
    const handleAddProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProperty.propertyId) return;

        setIsAdding(true);
        setActionError(null);

        const finalDisplayOrder = newProperty.displayOrder !== '' 
            ? Number(newProperty.displayOrder) 
            : linkedProperties.length + 1;

        try {
            await axios.post(`http://localhost:5005/api/ResourceTemplate/${templateId}/properties`, {
                properties: [
                    {
                        propertyId: Number(newProperty.propertyId),
                        isRequired: newProperty.isRequired,
                        displayOrder: finalDisplayOrder,
                        alternateLabel: newProperty.alternateLabel || null
                    }
                ]
            });

            setNewProperty({
                propertyId: '',
                isRequired: false,
                displayOrder: '',
                alternateLabel: ''
            });

            await fetchTemplateDetails();
            alert("تم ربط الخاصية الجديدة بالقالب بنجاح!");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setActionError(axiosError.response?.data?.message || "failed to link the property. it might already be added to this template.");
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
        
        setLinkedProperties(prev => prev.map(p => p.propertyId === item.propertyId ? item : p));
        
        alert("تم تحديث إعدادات الخاصية في القالب بنجاح!");
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setActionError(axiosError.response?.data?.message || "failed to update the property details.");
    }
};

    const handleRemoveRow = async (propertyId: number) => {
        if (!confirm("هل أنت متأكد من فك ارتباط هذه الخاصية وإزالتها من القالب؟")) return;
        
        setActionError(null);
        try {
            await resourceService.removePropertyFromTemplate(templateId, propertyId);
            setLinkedProperties(prev => prev.filter(p => p.propertyId !== propertyId));
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setActionError(axiosError.response?.data?.message || "failed to remove the property from the template.");
        }
    };

    const handleLocalFieldChange = (propertyId: number, key: keyof TemplatePropertyItem, value: unknown) => {
        setLinkedProperties(prev => prev.map(item => 
            item.propertyId === propertyId ? { ...item, [key]: value } : item
        ));
    };

    if (isLoading) {
        return <div className="text-center my-32 font-bold text-gray-500">جاري تحميل خصائص الهيكل الحالية...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto my-12 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50" dir="rtl">
            
            {/* الهيدر والعناوين */}
            <div className="mb-8 text-right border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-black text-gray-900">لوحة إدارة خصائص القالب الشاملة</h1>
                <p className="text-gray-500 mt-2">يمكنك إضافة خصائص جديدة، تحديث خيارات الربط الحالي، أو إزالتها تماماً من القالب</p>
            </div>

            {/* عرض لوحة الأخطاء العامة */}
            {actionError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium text-right">
                    ⚠️ {actionError}
                </div>
            )}

            {/* 📥 قسم إضافة خاصية جديدة */}
            <form onSubmit={handleAddProperty} className="mb-10 p-6 bg-blue-50/20 border border-blue-100/70 rounded-2xl text-right">
                <h2 className="text-base font-black text-blue-700 mb-4">➕ ربط وإضافة خاصية جديدة للقالب</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">معرف الخاصية (Property ID) *</label>
                        <input 
                            type="number"
                            required
                            placeholder="رقم الخاصية بالـ DB"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-center font-bold text-sm focus:border-blue-500 transition-colors"
                            value={newProperty.propertyId}
                            onChange={e => setNewProperty({...newProperty, propertyId: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">تسمية بديلة داخل القالب (اختياري)</label>
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
                            <label className="block text-xs font-bold text-gray-600 mb-2">الترتيب</label>
                            <input 
                                type="number"
                                min="1"
                                placeholder={String(linkedProperties.length + 1)}
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
                                حقل مطلوب؟
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isAdding || !newProperty.propertyId}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md disabled:bg-gray-200 disabled:text-gray-400 transition-colors text-sm"
                        >
                            {isAdding ? "جاري الإدراج والربط..." : "ربط وإضافة الخاصية"}
                        </button>
                    </div>
                </div>
            </form>

            {/* 📋 جدول عرض وتعديل وحذف الخصائص الحالية */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50 text-gray-700 text-sm font-bold border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-center w-24">معرف الخاصية</th>
                            <th className="p-4 text-right">اسم الخاصية الأصلية</th>
                            <th className="p-4 text-center w-28">مطلوب؟</th>
                            <th className="p-4 text-center w-24">الترتيب</th>
                            <th className="p-4 text-right">التسمية البديلة (Alternate Label)</th>
                            <th className="p-4 text-center w-40">الإجراءات الفورية</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {linkedProperties.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                                    لا توجد أي خصائص مربوطة بهذا القالب حالياً. أدخل رقم خاصية في الصندوق العلوي للبدء.
                                </td>
                            </tr>
                        ) : (
                            linkedProperties.map((item) => (
                                <tr key={item.propertyId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-center font-mono font-bold text-gray-500">{item.propertyId}</td>
                                    
                                    <td className="p-4 font-bold text-gray-900 text-right">
                                        {item.propertyName || `خاصية نظام رقم #${item.propertyId}`}
                                    </td>
                                    
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox"
                                            className="w-5 h-5 rounded text-emerald-600 border-gray-300 cursor-pointer"
                                            checked={item.isRequired}
                                            onChange={(e) => handleLocalFieldChange(item.propertyId, 'isRequired', e.target.checked)}
                                        />
                                    </td>
                                    
                                    <td className="p-4 text-center">
                                        <input 
                                            type="number"
                                            className="w-16 p-2 text-center bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-blue-500"
                                            value={item.displayOrder}
                                            onChange={(e) => handleLocalFieldChange(item.propertyId, 'displayOrder', Number(e.target.value))}
                                        />
                                    </td>
                                    
                                    <td className="p-4 text-right">
                                        <input 
                                            type="text"
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-right"
                                            value={item.alternateLabel || ''}
                                            placeholder="لا توجد تسمية بديلة"
                                            onChange={(e) => handleLocalFieldChange(item.propertyId, 'alternateLabel', e.target.value || null)}
                                        />
                                    </td>
                                    
                                    <td className="p-4 text-center space-x-2 space-x-reverse">
                                        <button
                                            onClick={() => handleUpdateRow(item)}
                                            className="px-3 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors text-xs"
                                        >
                                            حفظ التعديل
                                        </button>
                                        <button
                                            onClick={() => handleRemoveRow(item.propertyId)}
                                            className="px-3 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-xs"
                                        >
                                            إزالة
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* زر العودة */}
            <div className="mt-8 text-right">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all text-sm"
                >
                    العودة لصفحة القوالب الرئيسية
                </button>
            </div>
        </div>
    );
}