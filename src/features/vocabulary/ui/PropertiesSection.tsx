import React from 'react';
import { Button } from '../../../shared/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '../../../shared/ui/dialog';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';

export interface PropertyItem {
    id?: number;
    label: string;
    uri: string;
    localName?: string; // ✅ Add this
}

interface PropertiesSectionProps {
    properties: PropertyItem[];
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    propForm: { label: string; uri: string; localName: string };
    setPropForm: React.Dispatch<React.SetStateAction<{ label: string; uri: string; localName: string }>>;
    editingPropId: number | null;
    handleOpenCreateDialog: () => void;
    handleOpenEditDialog: (prop: PropertyItem) => void;
    handlePropSubmit: (e: React.FormEvent) => void;
    handleDeleteProperty: (id: number) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
    properties,
    isDialogOpen,
    setIsDialogOpen,
    propForm,
    editingPropId,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handlePropSubmit,
    handleDeleteProperty,
    handleInputChange
}) => {
    return (
        <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Linked Properties</h2>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenCreateDialog}>+ Add New Property</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingPropId ? 'Edit Property' : 'Add New Property'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePropSubmit} className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="propLabel">Property Label</Label>
                                <Input 
                                    id="propLabel" name="label" 
                                    value={propForm.label} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            {/* ✅ localName field */}
                            <div>
                                <Label htmlFor="propLocalName">Local Name</Label>
                                <Input 
                                    id="propLocalName" name="localName" 
                                    value={propForm.localName} 
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="propUri">URI Identifier</Label>
                                <Input 
                                    id="propUri" name="uri" 
                                    value={propForm.uri} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {properties && properties.length > 0 ? (
                <div className="border rounded-lg overflow-hidden bg-white">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 font-semibold text-gray-700">Property Label</th>
                                <th className="p-3 font-semibold text-gray-700">Local Name</th>
                                <th className="p-3 font-semibold text-gray-700">URI Identifier</th>
                                <th className="p-3 font-semibold text-gray-700 text-center">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {properties.map((prop) => (
                                <tr key={prop.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-900">{prop.label}</td>
                                    <td className="p-3 text-gray-600">{prop.localName || '-'}</td>
                                    <td className="p-3 font-mono text-gray-600 break-all">{prop.uri}</td>
                                    <td className="p-3 text-center space-x-2">
                                        <Button 
                                            variant="outline" size="sm" 
                                            onClick={() => handleOpenEditDialog(prop)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="destructive" size="sm" 
                                            onClick={() => prop.id && handleDeleteProperty(prop.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 italic py-4">No properties are currently associated with this vocabulary.</p>
            )}
        </div>
    );
};