interface Props{
  filled: boolean | number,
  onClick?: () => void
  index?:number
}

function Star({ filled = false, onClick,index }: Props) {
  const starPath =
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${index}점`}
      className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
    >
      {filled ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#FFD700"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={starPath} />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={starPath} />
        </svg>
      )}
    </button>
  );
}
export default Star