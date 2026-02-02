import { FiImage } from "react-icons/fi";
import type { MeetingsFormData } from "../../types/group";

interface Props {
  formData: MeetingsFormData;
  setField: <K extends keyof MeetingsFormData>(
    key: K,
    value: MeetingsFormData[K],
  ) => void;
}

function UploadThumbnail({ formData, setField }: Props) {
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64string = reader.result as string;
      setField("thumbnail", base64string);
    };
    reader.readAsDataURL(file);
  };

  const hasImage =
    formData.thumbnail && formData.thumbnail.startsWith("data:image");

  return (
    <div>
      <label className="block font-semibold mb-2 text-sm">
        썸네일 이미지 (선택)
      </label>

      {hasImage ? (
        <div className="relative">
          <img
            src={formData.thumbnail ?? ""}
            alt="미리보기"
            className="w-full h-32 sm:h-40 lg:h-48 object-contain rounded-lg border border-gray-300"
            // 모바일: h-32 (128px)
            // 태블릿: sm:h-40 (160px)
            // 데스크톱: lg:h-48 (192px)
          />
        </div>
      ) : (
        <label
          htmlFor="thumbnail"
          className="block w-full border-2 border-dashed border-gray-300 rounded-lg py-6 sm:py-8 text-center cursor-pointer hover:border-blue-500 transition"
        >
          <div className="flex flex-col items-center gap-2">
            <FiImage size={32} className="text-gray-400" />
            <p className="text-sm text-gray-600">이미지를 선택하세요</p>
            <p className="text-xs text-gray-400">클릭하여 파일 선택</p>
          </div>
          <input
            onChange={handleUploadImage}
            type="file"
            id="thumbnail"
            accept="image/*"
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default UploadThumbnail;
