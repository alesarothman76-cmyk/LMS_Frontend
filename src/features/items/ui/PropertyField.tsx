"use client";

import React from "react";
import { Controller, type Control } from "react-hook-form";
import type { ResourcePropertyDto } from "../types";
import type { ItemFormValues } from "./ItemForm";

/**
 * Renders one form row for a single template property.
 *
 * The backend's ResourcePropertyDto has no data-type field (no literal/uri/
 * resource distinction) — every property is just a labeled slot for a value.
 * If your API later distinguishes value kinds (e.g. via CreateResourceValueDto.type
 * needing to be "Literal"/"Uri"/"ResourceLink"), this is the file to extend
 * with the right input per kind.
 */
export function PropertyField({
  property,
  index,
  control,
}: {
  property: ResourcePropertyDto;
  index: number;
  control: Control<ItemFormValues>;
}) {
  const fieldName = `values.${index}.valueText` as const;
  const label = property.alternateLabel ?? property.propertyId.toString();

  return (
    <div className="catalog-field">
      <div className="catalog-field__head">
        <label htmlFor={`prop-${property.propertyId}`} className="catalog-field__label">
          {label}
          {property.isRequired && React.createElement("span", { className: "catalog-field__required" }, "•required")}
        </label>
        <span className="catalog-field__order">#{property.displayOrder}</span>
      </div>

      <Controller
        name={fieldName}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <input
              id={`prop-${property.propertyId}`}
              type="text"
              className="catalog-input"
              placeholder="Enter value…"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
            {fieldState.error && (
              <p className="catalog-field__error">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
}