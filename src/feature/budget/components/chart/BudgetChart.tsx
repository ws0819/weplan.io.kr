import type { BudgetItem } from "../../type/budget";
import { useChart } from "../../hooks/useChart";
import { lazy, Suspense } from "react";


const DonutChart = lazy(()=>import("./DonutChart"))
const RemainBudget = lazy(() => import("./RemainBudget"))
const ChartDetail = lazy(()=>import("./ChartDetail"))

interface Props{
  data: BudgetItem[] | undefined
  totalAmount:number
}


function BudgetChart({ data,totalAmount }: Props) {
  const { chartData, total} = useChart(data)

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold text-titleText mb-4">
        카테고리별 예산
      </h2>

      {chartData && chartData.length > 0 ? (
        <>
          <Suspense
            fallback={
              <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <div className="w-32 h-32 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            }
          >
            <DonutChart chartData={chartData} />
            <RemainBudget total={total} totalAmount={ totalAmount} />
            <ChartDetail chartData={chartData} total={total} />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-12 text-text/60">
          <p>예산 데이터가 없습니다</p>
        </div>
      )}
    </div>
  );
}
export default BudgetChart