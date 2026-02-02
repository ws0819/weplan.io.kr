
interface Props {
  category: string;
  title: string;
  thumbnail: string
}

function LinkCardImage({ category, title, thumbnail }: Props) {

  return (
    <div className="relative h-40">
      <div className="absolute top-1 left-1 bg-black/50 text-white rounded-full h-fit w-fit py-1 px-2">
        {category}
      </div>
      <img
        src={thumbnail}
        alt={title}
        className="rounded-lg h-full w-full"
        height={80}
        loading="lazy"
        fetchPriority="high"
      />
    </div>
  );
}
export default LinkCardImage;
