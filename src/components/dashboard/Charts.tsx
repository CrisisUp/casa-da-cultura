"use client";

interface ChartData {
  name: string;
  value: number;
}

interface ChartsProps {
  data: ChartData[];
}

const COLORS = [
  "from-terracota to-terracota-dark",
  "from-oliva to-oliva-dark",
  "from-ambar to-ambar-dark",
  "from-barro to-madeira",
  "from-terracota-light to-terracota",
  "from-oliva-light to-oliva",
];

export default function Charts({ data }: ChartsProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <section className="cultural-card" aria-label="Artistas por Gênero">
      <header className="mb-6">
        <h3 className="cultural-section-title">
          Artistas por Gênero
        </h3>
      </header>

      {data.length === 0 ? (
        <p className="text-madeira/60 dark:text-areia/70 text-center py-8">
          Nenhum artista cadastrado ainda
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <article key={item.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-madeira dark:text-areia/80">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
                  {item.value}
                </span>
              </div>
              <div className="h-3 rounded-full bg-areia dark:bg-areia/30 overflow-hidden" role="progressbar" aria-valuenow={item.value} aria-valuemin={0} aria-valuemax={maxValue}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${COLORS[index % COLORS.length]} transition-all duration-700 ease-out group-hover:brightness-110`}
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
