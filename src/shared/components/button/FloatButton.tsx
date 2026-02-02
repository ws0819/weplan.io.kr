interface Props{
  type?: 'button' | 'submit'
  className?: string;
  onClick?:()=>void
}


function FloatButton({ type='button',className,onClick }:Props) {
  return (
    <button
      className={`flex-center w-12 h-12 rounded-full bg-primary text-4xl text-white cursor-pointer shadow-lg lg:hidden hover:bg-blue-700 transition ${className}`}
      type={type}
      onClick={onClick}
    >
      +
    </button>
  );
}
export default FloatButton