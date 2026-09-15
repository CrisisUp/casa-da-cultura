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
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia">
      <h3 className="mb-6 text-lg font-semibold text-foreground font-[family-name:var(--font-display)]">
        Artistas por Gênero
      </h3>

      {data.length === 0 ? (
        <p className="text-madeira/60 text-center py-8">
          Nenhum artista cadastrado ainda
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-madeira">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-foreground font-[family-name:var(--font-display)]">
                  {item.value}
                </span>
              </div>
              <div className="h-3 rounded-full bg-areia overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${COLORS[index % COLORS.length]} transition-all duration-700 ease-out group-hover:brightness-110`}
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
