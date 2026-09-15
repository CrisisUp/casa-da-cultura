"use client";

import { useState } from "react";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { classNames } from "@/lib/utils";

interface AlertBannerProps {
  variant?: "info" | "warning" | "success";
  title: string;
  message: string;
  dismissible?: boolean;
}

export default function AlertBanner({
  variant = "info",
  title,
  message,
  dismissible = true,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  const iconStyles = {
    info: "text-blue-500",
    warning: "text-amber-500",
    success: "text-green-500",
  };

  return (
    <div
      className={classNames(
        "flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300",
        styles[variant]
      )}
      role="alert"
    >
      <Icon className={classNames("h-5 w-5 mt-0.5 shrink-0", iconStyles[variant])} />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm opacity-80 mt-0.5">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
