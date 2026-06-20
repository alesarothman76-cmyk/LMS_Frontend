import React from 'react';
import { VocabularyDto } from '../types';

// Import UI components
import { Button } from '../../../shared/ui/button';

interface VocabularyDetailsProps {
    vocabulary: VocabularyDto | null;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
}

export const VocabularyDetails: React.FC<VocabularyDetailsProps> = ({
    vocabulary,
    loading,
    error,
    onRetry
}) => {
    if (loading) {
        return <div className="p-8 text-center text-gray-600">Loading details...</div>;
    }

    if (error) {
        return (
            <div className="p-6 max-w-2xl mx-auto text-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
                <Button onClick={onRetry} variant="outline">Try again</Button>
            </div>
        );
    }

    if (!vocabulary) {
        return <div className="p-8 text-center text-gray-500">The requested vocabulary was not found.</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg border shadow-sm mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{vocabulary.label}</h1>
            <p className="text-gray-500 text-sm mb-6">Detailed information for the selected vocabulary</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Prefix
                    </span>
                    <span className="text-lg font-medium text-gray-900">{vocabulary.prefix}</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Namespace URI
                    </span>
                    <span className="text-sm font-mono text-blue-600 break-words">
                        {vocabulary.namespaceUri}
                    </span>
                </div>
            </div>

            {/* Display properties associated with this vocabulary if any */}
            <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Linked Properties</h2>
                {vocabulary.properties && vocabulary.properties.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 font-semibold text-gray-700">Property Label</th>
                                    <th className="p-3 font-semibold text-gray-700">URI Identifier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {vocabulary.properties.map((prop) => (
                                    <tr key={prop.id} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-900">{prop.label}</td>
                                        <td className="p-3 font-mono text-gray-600 break-all">{prop.uri}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No properties are associated with this vocabulary.</p>
                )}
            </div>
        </div>
    );
};