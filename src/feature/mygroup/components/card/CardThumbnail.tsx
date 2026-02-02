import { isGradient, parseGradient } from "../../utill/getRandomGradient";

function CardThumbnail({ title,thumbnail }: {
  title:string,
  thumbnail: string | null
}) {
  const isImage = thumbnail && !isGradient(thumbnail);
  const gradient = isGradient(thumbnail) ? parseGradient(thumbnail!) : null;

  return (
    <>
      {isImage ? (
        <img
          src={thumbnail}
          alt={`${title}모임의 대표 이미지`}
          loading="eager"
          fetchPriority="high"
          className="h-45 w-full object-contain rounded-lg"
        />
      ) : (
        <div
          style={{
            background: `linear-gradient(135deg, ${gradient?.from} 0%, ${gradient?.to} 100%)`,
          }}
          className="h-45 w-full rounded-lg flex items-center justify-center"
        >
          <span className="text-white text-4xl font-semibold opacity-80">
            {title.charAt(0)}
          </span>
        </div>
      )}
    </>
  );
}
export default CardThumbnail;
