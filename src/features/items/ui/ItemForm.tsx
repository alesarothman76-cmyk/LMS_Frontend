"use client";

import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Kept Shadcn UI primitives for Select and Button
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useResourceTemplate } from "../hooks/useResourceTemplate";
import { useResourceTemplates } from "../hooks/useResourceTemplates";
import { PropertyField } from "./PropertyField";
import { ItemDto } from "../types";

const valueSchema = z.object({
  id: z.number().optional(),
  propertyId: z.number(),
  valueText: z.string().nullable(),
  valueUri: z.string().nullable(),
  valueResourceId: z.number().nullable(),
  type: z.string(),
  language: z.string().nullable(),
});

const itemFormSchema = z.object({
  templateId: z.number({ message: "Choose a template to continue" }),
  values: z.array(valueSchema),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

function buildValueDefaultsFromTemplate(properties: { propertyId: number; displayOrder: number }[]) {
  const ordered = [...properties].sort((a, b) => a.displayOrder - b.displayOrder);

  return ordered.map((p) => ({
    propertyId: p.propertyId,
    valueText: null,
    valueUri: null,
    valueResourceId: null,
    type: "Literal",
    language: null,
  }));
}

export function ItemForm({
  initialItem,
  onSubmit,
  isSubmitting,
  submitLabel = "Save item",
}: {
  initialItem?: ItemDto;
  onSubmit: (values: ItemFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}) {
  const { data: templates, isLoading: templatesLoading } = useResourceTemplates();

  const {
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      templateId: initialItem?.templateId,
      values: initialItem?.values ?? [],
    },
  });

  // Watch field via useWatch to keep React Compiler happy and avoid stale UI bails
  const selectedTemplateId = useWatch({
    control,
    name: "templateId",
  });
  
  const { data: template, isLoading: templateLoading } = useResourceTemplate(selectedTemplateId);
  const { fields, replace } = useFieldArray({ control, name: "values" });

  useEffect(() => {
    if (!template) return;
    const isHydratingExisting =
      initialItem?.templateId === template.id && fields.length > 0;
    if (isHydratingExisting) return;
 // If the template has changed or we are creating a new item, reset the values to match the template
    replace(buildValueDefaultsFromTemplate(template.properties));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  // Backend rejects clearing a value for a property the template marks as
  // required (ResourceRepository.RemoveValueAsync throws). Catch that here,
  // before the request goes out, so the user gets a field-level error
  // instead of a generic "couldn't save" failure.
  const handleFormSubmit = handleSubmit((values) => {
    let hasMissingRequired = false;

    values.values.forEach((value, index) => {
      const property = template?.properties.find((p) => p.propertyId === value.propertyId);
      if (!property?.isRequired) return;

      const isBlank =
        (!value.valueText || value.valueText.trim() === "") &&
        (!value.valueUri || value.valueUri.trim() === "") &&
        value.valueResourceId == null;

      if (isBlank) {
        hasMissingRequired = true;
        setError(`values.${index}.valueText`, {
          type: "required",
          message: "This field is required",
        });
      }
    });

    if (hasMissingRequired) return;

    onSubmit(values);
  });

  return (
    <form onSubmit={handleFormSubmit} className="catalog-form">
      
      {/* Template Selection using Shadcn Select component directly */}
      <div className="catalog-field">
        <div className="catalog-field__head">
          <label htmlFor="templateId" className="catalog-field__label">
            Template
          </label>
        </div>

        <Select
          disabled={templatesLoading || !!initialItem}
          value={selectedTemplateId ? String(selectedTemplateId) : undefined}
          onValueChange={(val) => {
            const numVal = Number(val);
            setValue("templateId", numVal, { shouldValidate: true });
            clearErrors("templateId");
          }}
        >
          <SelectTrigger id="templateId" className="catalog-input">
            <SelectValue placeholder="Select a template…" />
          </SelectTrigger>
          <SelectContent>
            {templates?.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {errors.templateId && (
          <p className="catalog-field__error">{errors.templateId.message}</p>
        )}
        {initialItem && (
          <p className="catalog-field__hint">Template can&apos;t change after an item is created.</p>
        )}
      </div>

      {templateLoading && selectedTemplateId && (
        <p className="catalog-empty">Loading template fields…</p>
      )}

      {/* Dynamic EAV field values map list */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const property = template?.properties.find((p) => p.propertyId === field.propertyId);
          if (!property) return null;

          return (
            <PropertyField
              key={field.id}
              property={property}
              index={index}
              control={control}
            />
          );
        })}
      </div>

      {/* Saving action triggered via Shadcn Button component */}
      <div className="catalog-form__actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}