import { useState } from "react";
import AddItem from "../create/AddItem";
import type { BudgetItem } from "../../type/budget";
import BudgetItemList from "./BudgetItemList";
import BudgetItemHeader from "./BudgetItemHeader";

interface Props {
  data: BudgetItem[] | undefined;
}

function BudgetItems({ data }:Props) {
  const [isModalOpen , setIsModalOpen] = useState(false)

  return (
    <section className="mt-8 bg-white rounded-lg px-4 ">
      <BudgetItemHeader onClose={()=>setIsModalOpen(true)}/>

      {data && data?.length > 0 ? (
        <ul className="pt-4 flex flex-col gap-3">
          {data &&
            data.map(({ id, meetingId, name, amount, category }) => (
              <li
                className="flex justify-between items-center rouned-lg bg-gray-50 p-3"
                key={id}
              >
                <BudgetItemList id={ id! } name={name} amount={amount} category={category} meetingId={ meetingId } />
              </li>
            ))}
        </ul>
      ) : (
        <div className="py-4">
          <p>아직 등록된 예산이 없습니다.</p>
        </div>
      )}
      {isModalOpen && <AddItem onClose={()=>setIsModalOpen(false)} />}
    </section>
  );
}
export default BudgetItems