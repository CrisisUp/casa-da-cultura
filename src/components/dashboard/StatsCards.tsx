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
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Estatísticas gerais">
      {stats.map((stat) => (
        <article
          key={stat.title}
          className="group relative overflow-hidden organic-card cultural-card p-6 transition-all duration-500 hover:shadow-xl hover:shadow-terracota/10 hover:-translate-y-1 hover:border-terracota/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-madeira/70 dark:text-areia/70 group-hover:text-madeira dark:group-hover:text-areia transition-colors">
                {stat.title}
              </h3>
              <p className="mt-2 text-4xl font-bold text-foreground dark:text-foreground transition-all duration-500 group-hover:scale-105 group-hover:text-terracota font-[family-name:var(--font-playfair)]">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-16 w-16 items-center justify-center organic-badge ${stat.color} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}
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
        </article>
      ))}
    </section>
  );
}
