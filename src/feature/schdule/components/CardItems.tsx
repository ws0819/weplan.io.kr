import { useParams } from "react-router";
import CardList from "./card/CardList";
import TabNavigate from "./TabNavigate";
import { useGetLink } from "../api/useGetLinks";
import { useState } from "react";


interface Props{
  onOpen : () => void
}

function CardItems({ onOpen }: Props) {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const { data } = useGetLink(id!, category);

  const categoryChange = (tab: string) => {
    setCategory(tab === '전체' ? '' : tab)
  }

  return (
    <section className="flex-1 relative">
      <TabNavigate onClick={onOpen} onCategoryChange={ categoryChange} />
      <CardList onOpen={onOpen} data={ data ?? [] } />
    </section>
  );
}
export default CardItems