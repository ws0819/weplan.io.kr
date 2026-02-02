import { useParams } from 'react-router';
import BudgetAccount from './components/account/BudgetAccount';
import BudgetChart from './components/chart/BudgetChart';
import BudgetHeader from './components/BudgetHeader';
import BudgetItems from './components/item/BudgetItems';
import { useGetBudgetItem } from './api/useGetBudgetItem';
import LoadingSpinner from '@/shared/components/loading/LoadingSpinner';
import SEO from '@/shared/components/seo/SEO';
import { useGetGroupData } from '@/app/route/api/useGetGroup';


function Budget() {
  const { id } = useParams();
  const { data, isLoading } = useGetBudgetItem(id ?? "");
  const { data:group,isLoading:gropLoading } = useGetGroupData(id);
  

  if (isLoading || gropLoading) {
    return (
      <div className="flex-center flex-col">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title='예산'
        description='위 플랜에서 예산을 등록하고 쉽게 확인해보세요'
        keyword='모임 예산, 예산, 모임'
      />
      <div className="flex flex-col justify-between my-5 bg-gray-50 rounded-lg p-4">
        <BudgetHeader data={group} />
        <BudgetAccount />
        <BudgetChart data={data} totalAmount={group.totalAmount} />
        <BudgetItems data={data} />
      </div>
    </>
  );
}
export default Budget