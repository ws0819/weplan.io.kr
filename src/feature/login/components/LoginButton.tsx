interface Props{
  title:string
  color: string,
  icon: string
  onClick:() => void
}

function LoginButton({ title, color, icon, onClick }: Props) {
  
  return (
    <button
      className={`rounded-lg py-1 px-7 h-12 flex items-center gap-5 w-81 z-9 ${color} `}
      onClick={onClick}
      type='button'
    >
      <img src={icon} alt={title} className="w-10 h-10" />
      <p className="text-2xl"> {title}로 계속하기</p>
    </button>
  );
}
export default LoginButton