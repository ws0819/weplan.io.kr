interface Props{
  title:string
  icon: string
  description: string
}

function Slide({ title,icon,description}:Props) {
  return (
    <>
      <div className="flex-center w-32 h-32 rounded-full bg-secondary/30 p-7">
        <span className="text-7xl">{icon}</span>
      </div>
 
      <span className="mt-8 flex flex-col items-center gap-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-center text-sm md:text-base">{description}</p>
      </span>
    </>
  );
}
export default Slide