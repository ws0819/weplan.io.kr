import { sweetDelete } from "@/shared/utill/swir";
import { useParams } from "react-router";
import { useUDLink } from "../../api/useUDLinks";

interface Props{
  id: string
  url:string
  onEdit: () => void
}

function LinkCardButtonWrap({ id,url,onEdit }: Props) {
  const { id: meeting_id } = useParams();
  const { mutate } = useUDLink();
  const handleDelete = () => {
    sweetDelete(() => {
      mutate({
        meeting_id: meeting_id ?? "",
        id,
        op: "d",
      });
    });
  };

    const handleCopyLink = () => {
      window.open(url, "_blank", "noopener,noreferrer");
    };
  
  
  return (
    <section className="flex flex-col justify-between items-center">
      <div className="flex gap-2 w-full">
        <button
          className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 border border-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors"
          onClick={onEdit}
        >
          수정
        </button>
        <button
          className="flex-1 py-2 px-3 bg-red-50 text-red-600 border border-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
          onClick={handleDelete}
        >
          삭제
        </button>
        <button
          className="py-2 px-3 bg-green-50 text-green-600 border border-green-600 rounded-lg font-semibold text-sm hover:bg-green-100 transition-colors"
          onClick={handleCopyLink}
        >
          🔗
        </button>
      </div>
    </section>
  );
}
export default LinkCardButtonWrap