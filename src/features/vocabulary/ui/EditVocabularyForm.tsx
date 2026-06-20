import React from 'react';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';

interface EditVocabularyFormProps {
    formState: { prefix: string; namespaceUri: string; label: string };
    loading: boolean;
    mutationLoading: boolean;
    error: string | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export const EditVocabularyForm: React.FC<EditVocabularyFormProps> = ({
    formState,
    loading,
    mutationLoading,
    error,
    onInputChange,
    onSubmit,
    onCancel
}) => {
    
    if (loading) return <div className="p-8 text-center">Loading vocabulary data...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Vocabulary</h1>
                <p className="text-gray-500">Modify the required fields and click save.</p>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 border rounded-lg shadow-sm">
                <div>
                    <Label htmlFor="prefix">Prefix</Label>
                    <Input 
                        id="prefix" name="prefix" 
                        value={formState.prefix} 
                        onChange={onInputChange} 
                        required 
                    />
                </div>
                
                <div>
                    <Label htmlFor="namespaceUri">Namespace URI</Label>
                    <Input 
                        id="namespaceUri" name="namespaceUri" 
                        value={formState.namespaceUri} 
                        onChange={onInputChange} 
                        required 
                    />
                </div>
                
                <div>
                    <Label htmlFor="label">Label</Label>
                    <Input 
                        id="label" name="label" 
                        value={formState.label} 
                        onChange={onInputChange} 
                        required 
                    />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                        type="button" variant="outline" 
                        onClick={onCancel}
                        disabled={mutationLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={mutationLoading}>
                        {mutationLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};