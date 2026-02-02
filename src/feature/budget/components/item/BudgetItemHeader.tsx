import Button from "@/shared/components/button/Button";

interface Props{
  onClose:()=>void
}

function BudgetItemHeader({ onClose}:Props) {
  return (
    <div className="flex justify-between py-4 border-b border-border">
      <h1 className="flex justify-between text-lg font-semibold">예산항목</h1>
      <Button
        variant="secondary"
        size="sm"
        className="w-14"
        onClick={onClose}
      >
        추가
      </Button>
    </div>
  );
}
export default BudgetItemHeader