
import { useState } from 'react';
import LinkCardButtonWrap from './LinkCardButtonWrap';
import LinkCardImage from './LinkCardImage';
import LinkCardContent from './LinkCardContent';
import EditLinkModal from '../modal/edit/EditLinkModal';

interface Props{
  id:string
  title: string;
  memo: string;
  rating: number;
  url: string
  category: string
  thumbnail:string
} 

function LinkCard({ id,title, memo, rating, url, category,thumbnail }: Props) {
  const [isEditModal, setIsEditModal] = useState(false);
  return (
    <>
      <article className="flex flex-col min-h-90 w-full h-full justify-between gap-2 p-3 bg-white rounded-lg">
        <div className="shrink-0">
          <LinkCardImage category={category} title={title} thumbnail={thumbnail} />
        </div>
        <div className="flex-1 p-3 overflow-y-hidden">
          <LinkCardContent title={title} rating={rating} memo={memo} />
        </div>

        <div className="shrink-0 p-3">
          <LinkCardButtonWrap
            id={id}
            url={url}
            onEdit={() => setIsEditModal(true)}
          />
        </div>
      </article>

      {isEditModal && (
        <EditLinkModal
          id={id}
          title={title}
          memo={memo}
          rating={rating}
          url={url}
          category={category}
          onClose={() => setIsEditModal(false)}
        />
      )}
    </>
  );
}
export default LinkCard