import { useEffect } from "react";
import CreateGroup from "./CreateGroup"

interface Props{
  open: boolean,
  onClose: () =>void
}

function CreateGroupModal({ open, onClose }: Props) {

 useEffect(() => {
   if (!open) return;

   const handleEscKey = (e: KeyboardEvent) => {
     if (e.key === "Escape") {
       onClose();
     }
   };

   window.addEventListener("keydown", handleEscKey);

   // 클린업
   return () => {
     window.removeEventListener("keydown", handleEscKey);
   };
 }, [open, onClose]);
  
  if (!open) return null;

  return (
    <div
      className="bg-black/50 fixed inset-0 h-screen w-screen z-9 flex-center flex-col p-4"
    >
      <div className="bg-white rounded-2xl p-3 lg:p-8 w-full max-w-md shadow-2xl" >
        <CreateGroup onClose={onClose} />
      </div>
    </div>
  );
}
export default CreateGroupModal