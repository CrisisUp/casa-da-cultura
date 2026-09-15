"use client";

import { useState } from "react";
import { classNames } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export default function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
    onChange?.(tabId);
  }

  return (
    <div>
      {/* Tab headers */}
      <div className="flex gap-1 rounded-xl bg-areia/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={classNames(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-white text-foreground shadow-sm"
                : "text-madeira/60 hover:text-madeira hover:bg-white/50"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
