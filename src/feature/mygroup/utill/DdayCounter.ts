export function dDayCounter(date:string | Date) {
  
  const today = new Date()
  const target = new Date(date)

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
   if (diffDays > 0) {
     return `D-${diffDays}`;
   } else if (diffDays === 0) {
     return "D-Day";
   } else {
     return `D+${Math.abs(diffDays)}`;
   }
}