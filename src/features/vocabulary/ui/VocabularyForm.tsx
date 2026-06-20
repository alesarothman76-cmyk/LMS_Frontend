import React from 'react';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';

interface VocabularyFormProps {
    formState: { 
        prefix: string; 
        namespaceUri: string; 
        label: string; 
        // Additional property fields
        propertyLabel?: string; 
        propertyUri?: string; 
        localName?: string;
    };
    mutationError: string | null;
    mutationLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

// Added validation function inside or outside the component
const isValidUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

export const VocabularyForm: React.FC<VocabularyFormProps> = ({
    formState,
    mutationError,
    mutationLoading,
    onInputChange,
    onSubmit,
    onCancel
}) => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Add new vocabulary</h1>
                <p className="text-gray-500">Fill in the data below to create a new vocabulary.</p>
            </div>

            {mutationError && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {mutationError}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 border rounded-lg shadow-sm">
                {/* Core vocabulary fields */}
                <div className="space-y-4 border-b pb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Vocabulary details</h2>
                    <div>
                        <Label htmlFor="prefix" className="block mb-2">Prefix</Label>
                        <Input 
                            id="prefix" name="prefix" 
                            value={formState.prefix} 
                            onChange={onInputChange} 
                            placeholder="For example: dcterms"
                            required 
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="namespaceUri" className="block mb-2">Namespace URI</Label>
                        <Input 
                            id="namespaceUri" name="namespaceUri" 
                            value={formState.namespaceUri} 
                            onChange={onInputChange} 
                            placeholder="For example: http://purl.org/dc/terms/"
                            required 
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="label" className="block mb-2">Label</Label>
                        <Input 
                            id="label" name="label" 
                            value={formState.label} 
                            onChange={onInputChange} 
                            placeholder="Enter vocabulary label"
                            required 
                        />
                    </div>
                </div>

                {/* Attached property fields */}
                <div className="space-y-4 pt-2">
                    <h2 className="text-lg font-semibold text-gray-700">Initial property (Optional)</h2>
                    <div>
                        <Label htmlFor="propertyLabel" className="block mb-2">Property Label</Label>
                        <Input 
                            id="propertyLabel" name="propertyLabel" 
                            value={formState.propertyLabel || ''} 
                            onChange={onInputChange} 
                            placeholder="Enter property label"
                        />
                    </div>
                    <div>
                        <Label htmlFor="localName" className="block mb-2">Local Name</Label>
                        <Input 
                            id="localName" name="localName" 
                            value={formState.localName || ''} 
                            onChange={onInputChange} 
                            placeholder="Enter local name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="propertyUri" className="block mb-2">Property URI</Label>
                        <Input 
                            id="propertyUri" name="propertyUri" 
                            value={formState.propertyUri || ''} 
                            onChange={onInputChange} 
                            placeholder="For example: http://purl.org/dc/terms/title"
                        />
                        {formState.propertyUri && !isValidUrl(formState.propertyUri) && (
                            <p className="text-red-500 text-sm mt-1">
                                The URI must be a valid link starting with http:// or https://
                            </p>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                        type="button" variant="outline" 
                        onClick={onCancel}
                        disabled={mutationLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={mutationLoading}>
                        {mutationLoading ? 'Saving...' : 'Save vocabulary and property'}
                    </Button>
                </div>
            </form>
        </div>
    );
};