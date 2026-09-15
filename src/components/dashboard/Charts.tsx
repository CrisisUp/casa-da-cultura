"use client";

interface ChartData {
  name: string;
  value: number;
}

interface ChartsProps {
  data: ChartData[];
}

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
];

export default function Charts({ data }: ChartsProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Artistas por Gênero
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhum artista cadastrado ainda
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600 truncate">
                {item.name}
              </span>
              <div className="flex-1">
                <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-lg ${COLORS[index % COLORS.length]} transition-all duration-500`}
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className="w-8 text-sm font-medium text-gray-900 text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
