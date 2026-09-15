import { LucideIcon } from "lucide-react";

interface Stat {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-areia transition-all duration-500 hover:shadow-xl hover:shadow-terracota/10 hover:-translate-y-1 hover:border-terracota/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-madeira/70 group-hover:text-madeira transition-colors">
                {stat.title}
              </p>
              <p className="mt-2 text-4xl font-bold text-foreground transition-all duration-500 group-hover:scale-105 group-hover:text-terracota font-[family-name:var(--font-display)]">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${stat.color} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}
            >
              <stat.icon className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Decoração animada */}
          <div
            className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full ${stat.color} opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20`}
          />
          <div
            className={`absolute -top-4 -left-4 h-16 w-16 rounded-full ${stat.color} opacity-5 transition-all duration-700 group-hover:scale-125 group-hover:opacity-10`}
          />
        </div>
      ))}
    </div>
  );
}
