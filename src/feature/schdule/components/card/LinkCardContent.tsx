import Star from "@/shared/components/star/Star";

interface Props{
  title: string;
  rating: number;
  memo:string
}
function LinkCardContent({ title,rating,memo}:Props) {
  return (
    <section>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-lg">{title}</h2>
          <span className="flex">
            {[1, 2, 3, 4, 5].map((index) => (
              <Star filled={rating} index={ index} />
            ))}
          </span>
        </div>
        <div className="bg-gray-100 min-h-20 rounded-sm p-4 text-sm text-darkgray h-full ">
          {memo ? (
            <p className="whitespace-pre-wrap">{memo}</p>
          ) : (
            <p className="text-darkgray">등록된 메모가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
export default LinkCardContent