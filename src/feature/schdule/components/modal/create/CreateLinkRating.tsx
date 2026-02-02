import type { Link } from "@/feature/schdule/types/link";
import Star from "@/shared/components/star/Star";

interface Props {
  form: Link;
  setField: <K extends keyof Link>(key: K, value: Link[K]) => void;
}

function CreateLinkRating({ form,setField}:Props) {
  return (
    <section>
      <p className="font-semibold">별점</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            filled={form.rating >= rating}
            onClick={() =>
              setField('rating',rating)
            }
          />
        ))}
      </div>
    </section>
  );
}
export default CreateLinkRating