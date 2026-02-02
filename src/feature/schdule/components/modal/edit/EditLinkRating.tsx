import type { LinkCard } from "@/feature/schdule/types/link";

interface Props {
  formData: LinkCard;
  setField: <K extends keyof LinkCard>(key: K, value: LinkCard[K]) => void;
}

function EditLinkRating({ formData,setField}:Props) {
  return (
    <div>
      <label className="block font-semibold mb-2 text-sm">별점</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setField('rating',star)}
            className="text-4xl transition-colors"
            style={{
              color: star <= formData.rating ? "#fbbf24" : "#e5e7eb",
            }}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
export default EditLinkRating