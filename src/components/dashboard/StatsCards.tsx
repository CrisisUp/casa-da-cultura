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
          className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="mt-1 text-4xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Decoração */}
          <div
            className={`absolute -bottom-4 -right-4 h-20 w-20 rounded-full ${stat.color} opacity-10`}
          />
        </div>
      ))}
    </div>
  );
}
