export const CATEGORY_COLORS: Record<string, string> = {
  숙박: "#FF6B9D", // 핑크
  식비: "#FFA07A", // 코랄
  교통비: "#FFD93D", // 옐로우
  관광: "#6BCB77", // 그린
  쇼핑: "#4D96FF", // 블루
  기타: "#9D84B7", // 퍼플
  // 기본값
  default: "#95E1D3", // 민트
} as const;

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}
