import React, { useState, useMemo } from 'react';
import { VocabularyDto } from '../../../features/vocabulary/types';

// Import UI components
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';

interface VocabularyListProps {
    vocabularies: VocabularyDto[];
    loading: boolean;
    error: string | null;
    onCreate: () => void;
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    onRefresh: () => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({
    vocabularies,
    loading,
    error,
    onCreate,
    onEdit,
    onDelete,
    onRefresh
}) => {
    const [searchPrefix, setSearchPrefix] = useState('');

    // Filter vocabularies based on the entered Prefix (case-insensitive)
    const filteredVocabularies = useMemo(() => {
        if (!searchPrefix.trim()) return vocabularies;
        return vocabularies.filter(voc => 
            voc.prefix.toLowerCase().includes(searchPrefix.toLowerCase())
        );
    }, [vocabularies, searchPrefix]);

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Loading vocabularies...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Page Header and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Vocabulary Management</h1>
                    <p className="text-gray-500">List of all vocabularies registered in the system.</p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                    <Button variant="outline" onClick={onRefresh}>Refresh</Button>
                    <Button onClick={onCreate}>Add New Vocabulary</Button>
                </div>
            </div>

            {/* Search field added above the table */}
            <div className="mb-6">
                <div className="max-w-md">
                    <label htmlFor="search-prefix" className="block text-sm font-medium text-gray-700 mb-2">
                        Search by Prefix
                    </label>
                    <Input 
                        id="search-prefix"
                        type="text" 
                        placeholder="Enter prefix to search..." 
                        value={searchPrefix}
                        onChange={(e) => setSearchPrefix(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Prefix</th>
                            <th className="p-4 font-semibold text-gray-700">Label</th>
                            <th className="p-4 font-semibold text-gray-700">Namespace URI</th>
                            <th className="p-4 font-semibold text-gray-700 text-center">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredVocabularies.map((voc) => (
                            <tr key={voc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">{voc.prefix}</td>
                                <td className="p-4 text-gray-700">{voc.label}</td>
                                <td className="p-4 text-sm text-gray-500 truncate max-w-xs font-mono">
                                    {voc.namespaceUri}
                                </td>
                                <td className="p-4 text-center space-x-2 space-x-reverse">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => onEdit(voc.id)}
                                    >
                                        See Propreties
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => onDelete(voc.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredVocabularies.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-gray-500">
                                    No vocabularies match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};