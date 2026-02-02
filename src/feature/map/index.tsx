import { useParams } from "react-router";
import BenchMark from "./components/benchmark/BenchMark";
import { useGetLink } from "../schdule/api/useGetLinks";
import { useGetBasePoint } from "./api/useGetBasePoint";
import LoadingSpinner from "@/shared/components/loading/LoadingSpinner";
import SEO from "@/shared/components/seo/SEO";
import { lazy, Suspense} from "react";
import useSetCategory from "./hooks/useSetCategory";

const KakaoMap = lazy(()=>import("./components/map/KakaoMap"))

function Maps() {
  const { id } = useParams();
  const { category,categoryChange} = useSetCategory()
  const { data: link , isLoading:linkLoading} = useGetLink(id ?? '',category)
  const { data: point, isLoading: pointLoading } = useGetBasePoint({
    meeting_id: id ?? "",
  });

  if (linkLoading || pointLoading) {
    return (
      <div className="flex-center">
        <LoadingSpinner/>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="지도"
        description="위 플랜에서 모은 링크를 지도로 한눈에 확인 가능해요"
        keyword="지도, 모임 지도, 모임 계획"
      />
      <div className="flex flex-col mt-5 md:gap-6 md:justify-between">
        <Suspense
          fallback={
            <>
              <div className="w-full aspect-3/4 rounded-lg overflow-hidden h-75 md:h-150 animate-pulse bg-gray-400"></div>
            </>
          }
        >
          {link && link?.length > 0 ? (
            <div className="w-full aspect-3/4 rounded-lg overflow-hidden h-75 md:h-150">
              <KakaoMap
                link={link ?? []}
                point={point}
             
              />
            </div>
          ) : (
            <div className="w-full bg-gray-100  flex-center aspect-3/4 rounded-lg overflow-hidden h-75 md:h-150">
              <b className="text-lg text-gray-500 font-semibold">
                아직 저장된 링크가 없습니다
              </b>
            </div>
          )}
        </Suspense>

        <BenchMark
          data={link ?? []}
          point={point}
          onCategoryChange={categoryChange}
        />
      </div>
    </>
  );
}
export default Maps

