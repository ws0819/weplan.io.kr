import type { Chart } from "../../type/budget";

interface Props{
  chartData: Chart[],
  total:number | undefined
}

function ChartDetail({ chartData, total }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {chartData &&
        chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
              />
              <span className="font-semibold">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold">{item.value.toLocaleString()}원</p>
              <p className="text-xs text-text/60">
                {total && ((item.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
export default ChartDetail