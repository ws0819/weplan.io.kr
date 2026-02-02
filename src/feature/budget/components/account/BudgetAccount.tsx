import { useGetLeader } from "../../api/userGetLeader";
import { useParams } from "react-router";
import { lazy, useState } from "react";
import LeaderUpload from "./LeaderUpload";
import BudgetLeaderCard from "./BudgetLeaderCard";

const SecretaryModal = lazy(() => import("../modal/SecretaryModal"));

function BudgetAccount() {
  const { id } = useParams()
  const { data} = useGetLeader(id ?? '')
  const [isSecretaryModal,setIsSecretaryModal] = useState(false);
 
  return (
    <>
      {data && data.length > 0 ? (
        <BudgetLeaderCard leader={ data[0]} onOpen={() => setIsSecretaryModal(true)} />
      ) : (
        <LeaderUpload onOpen={() => setIsSecretaryModal(true)} />
      )}

      {isSecretaryModal && (
        <SecretaryModal onClose={() => setIsSecretaryModal(false)} />
      )}
    </>
  );
}
export default BudgetAccount;
