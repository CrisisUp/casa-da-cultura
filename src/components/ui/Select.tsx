"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { classNames } from "@/lib/utils";

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
            className="block text-sm font-medium text-madeira"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={classNames(
            "block w-full rounded-lg border border-areia px-3 py-2 text-foreground shadow-sm transition-colors",
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
