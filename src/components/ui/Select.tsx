"use client";

import { classNames } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={classNames(
            "block w-full h-9 rounded-lg border border-border bg-surface px-3  text-foreground shadow-sm transition-colors",
            "focus:border-terracota focus:outline-none focus:ring-1 focus:ring-terracota",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;