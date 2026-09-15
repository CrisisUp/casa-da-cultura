"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { classNames } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-madeira"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={classNames(
            "block w-full rounded-xl border border-areia bg-white px-4 py-2.5 text-foreground placeholder-madeira/40 shadow-sm transition-all duration-200",
            "focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
