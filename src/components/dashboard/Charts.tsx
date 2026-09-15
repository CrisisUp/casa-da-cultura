"use client";

interface ChartData {
  name: string;
  value: number;
}

interface ChartsProps {
  data: ChartData[];
}

const COLORS = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-emerald-600",
  "from-red-500 to-red-600",
  "from-rose-500 to-rose-600",
];

export default function Charts({ data }: ChartsProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        Artistas por Gênero
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhum artista cadastrado ainda
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {item.value}
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
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
