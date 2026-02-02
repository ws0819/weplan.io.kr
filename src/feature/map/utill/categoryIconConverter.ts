export function categoryIconConverter(category:string) {
  switch (category) {
    case "숙소": return "🏨"
    case "맛집": return "🍽️";
    case "카페": return "☕";
    case "관광": return "🧳"
    case "쇼핑": return "👜"
    case "액티비티": return "🪂"
    case "기타": return "🎸"
    default : return "❓"
  }
}