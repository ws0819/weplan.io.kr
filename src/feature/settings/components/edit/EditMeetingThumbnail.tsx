import type { Meetings } from "@/feature/mygroup/types/group";
import { isGradient, parseGradient } from "@/feature/mygroup/utill/getRandomGradient";
import { FiImage } from "react-icons/fi";

interface Props {
  formData:Meetings
  setField: <K extends keyof Meetings>(
    key: K,
    value: Meetings[K]
  ) => void;
}

function EditMeetingThumbnail({ formData, setField }: Props) {
  
    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64string = reader.result as string;
        setField("thumbnail", base64string); // base64 저장
      };
      reader.readAsDataURL(file);
    };

    const isImage = formData.thumbnail && !isGradient(formData.thumbnail);
    const gradient = isGradient(formData.thumbnail) ? parseGradient(formData.thumbnail!) : null;
  
  
  return (
    <div>
      <label className="block font-semibold mb-2">썸네일 이미지</label>

      {isImage ? (
        <div className="mb-3">
          <img
            src={formData.thumbnail!}
            alt="미리보기"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      ) : (
        <div
          style={{
            background: `linear-gradient(135deg, ${gradient?.from} 0%, ${gradient?.to} 100%)`,
          }}
          className="h-45 w-full rounded-lg flex items-center justify-center mb-3"
        >
          <span className="text-white text-4xl font-semibold opacity-80">
            {formData.title.charAt(0)}
          </span>
        </div>
      )}

      {/* 파일 선택 */}
      <label
        htmlFor="thumbnail"
        className="block w-full border-2 border-dashed 
        overflow-x-hidden
        border-gray-300 rounded-lg py-8 text-center cursor-pointer hover:border-blue-500 transition"
      >
        <div className="flex flex-col items-center gap-2">
          <FiImage size={32} className="text-gray-400" />
          <p className="text-sm text-gray-600">
            {formData.thumbnail ? formData.thumbnail : "이미지를 선택하세요"}
          </p>
        </div>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={handleUploadImage}
          className="hidden"
        />
      </label>
    </div>
  );
}
export default EditMeetingThumbnail