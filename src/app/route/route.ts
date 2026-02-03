import { createBrowserRouter, redirect} from "react-router";
import { lazy } from "react";
import Privacy from "@/feature/mypage/components/priovacy";
import Terms from "@/feature/mypage/components/Terms";
import KakaoCallback from "@/feature/callback/kakaoCallBack";

const Onboard = lazy(()=>import("../../feature/onboard"))
const Login = lazy(()=>import("../../feature/login"))
const Root = lazy(()=>import("."))
const MyGroup = lazy(() => import("../../feature/mygroup"))
const MyPage = lazy(() => import("../../feature/mypage"))
const Schedule = lazy(()=> import("../../feature/schdule"))
const Maps = lazy(() => import("../../feature/map"));
const Budget = lazy(() => import("../../feature/budget"));
const Invite = lazy(() => import("@/feature/invite"));
const Settings = lazy(() => import("../../feature/settings"))

export const router = createBrowserRouter([
  {
    path: "/onboard",
    Component: Onboard,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/privacy",
    Component: Privacy,
  },
  {
    path: "/terms",
    Component: Terms,
  },
  {
    path: "/invite/:token",
    Component: Invite,
  },
  {
    path: "/auth/kakao/callback",
    Component: KakaoCallback,
  },
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "mygroup",
        Component: MyGroup,
      },

      {
        path: "mypage",
        Component: MyPage,
      },
      {
        path: "meeting/:id",
        children: [
          {
            index: true,
            loader: ({ params }) => {
              return redirect(`/meeting/${params.id}/schedule`);
            },
          },
          {
            path: "schedule",
            Component: Schedule,
          },
          {
            path: "map",
            Component: Maps,
          },
          {
            path: "budget",
            Component: Budget,
          },
          {
            path: "settings",
            Component: Settings,
          },
        ],
      },
    ],
  },
]);