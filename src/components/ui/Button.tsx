"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { classNames } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-terracota text-white hover:bg-terracota-dark focus:ring-terracota shadow-sm hover:shadow-md":
              variant === "primary",
            "bg-areia text-madeira hover:bg-areia/80 focus:ring-madeira border border-areia":
              variant === "secondary",
            "bg-danger text-white hover:bg-danger-dark focus:ring-danger shadow-sm":
              variant === "danger",
            "bg-transparent text-madeira hover:bg-areia focus:ring-madeira":
              variant === "ghost",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
