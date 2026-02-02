import Button from "../../../shared/components/button/Button";

interface Props {
  onClick:() => void
}

function GroupHeader({ onClick }:Props) {
  return (
    <header className="flex justify-between items-center border-b py-3 border-lightgray">
      <h1 className="text-lg lg:text-3xl font-semibold">내 모임</h1>
      <div className="flex gap-2 ">
        <div className="hidden sm:block">
          <Button
            variant="primary"
            size="md"
            disabled={false}
            onClick={onClick}
            aria-haspopup="dialog"
          >
            + 새 모임 만들기
          </Button>
        </div>
      </div>
    </header>
  );
}
export default GroupHeader