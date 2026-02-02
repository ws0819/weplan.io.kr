import { Link } from 'react-router';
import Logout from './components/Logout';
import MyPageHeader from './components/MyPageHeader';
import MyPageMyInfo from "./components/MyPageMyInfo";
import ProfileButton from "./components/ProfileButton";
import { BUTTON_TITLE } from "./constant/buttonTitle";

function MyPage() {
  return (
    <div className="mt-10 p-5 bg-white rounded-lg">
      <MyPageHeader />
      <main>
        <MyPageMyInfo />
        <ul className="flex flex-col gap-4 py-4 border-b border-lightgray">
          {BUTTON_TITLE.map(({path,title}, index) => (
            <Link to={`/${path}`}>
              <li key={index}>
                <ProfileButton>{title}</ProfileButton>
              </li>
            </Link>
          ))}
        </ul>
        <div className="mt-4 flex flex-col items-center gap-1">
          <Logout />
          <button className="text-lightgray text-sm border-b">회원탈퇴</button>
        </div>
      </main>
    </div>
  );
}
export default MyPage