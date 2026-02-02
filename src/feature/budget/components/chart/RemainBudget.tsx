interface Props{
  total: number | undefined
  totalAmount:number
}

function RemainBudget({ total,totalAmount}:Props) {
  const remainBudget = totalAmount - total
  return (
    <div className="mt-6 text-center p-4 bg-background rounded-lg">
      <p className="text-sm text-text/60 mb-1">남은 예산</p>
      <p className="text-3xl font-semibold text-sageGreen">
        {remainBudget.toLocaleString()}원
      </p>
    </div>
  );
}
export default RemainBudget