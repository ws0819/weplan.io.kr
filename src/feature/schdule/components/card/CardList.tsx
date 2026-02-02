import LinkCard from "@/feature/schdule/components/card/LinkCard";
import Button from "@/shared/components/button/Button";
import type { Link } from "../../types/link";

interface Props{
  onOpen: () => void
  data:Link[]
}

function CardList({ onOpen,data }:Props) {


    if (!data || data.length === 0) {
      return (
        <div className="my-7 flex-center flex-col gap-3 py-20 text-center border-2 border-dashed border-border">
          <span className="aspect-1 text-6xl">🔗</span>
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-lg mb-2">
              아직 붙여넣은 링크가 없습니다
            </p>
            <p className="text-gray-400 text-sm">새로운 링크를 생성해보세요!</p>
          </div>
          <Button variant="primary" size="lg" className="w-60"
            onClick={ onOpen }>
            +첫 번째 링크 추가하기
          </Button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-[80vh] justify-between overflow-y-hidden">
      <div className="overflow-y-auto flex-1">
        <ul className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-4 auto-rows-fr">
          {data &&
            data.map(({ id, memo, rating, title, url, category,images }) => (
              <li key={id}>
                <LinkCard
                  id={id ?? ""}
                  title={title}
                  memo={memo ?? ''}
                  rating={rating}
                  url={url}
                  thumbnail={images}
                  category={category}
                />
              </li>
            ))}
        </ul>
      </div>
      <div className="bg-gray-100 text-center w-full rounded-sm py-3">
        총 <span className="text-primary font-semibold">{data.length}</span>개의
        링크
      </div>
    </div>
  );
}
export default CardList