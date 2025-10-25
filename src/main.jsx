import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Post from "./pages/Post.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomeRedirect from "./pages/HomeRedirect.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SocialFeed from "./pages/SocialFeed.jsx";
import MyRoutines from "./pages/MyRoutines.jsx";
import NewRoutine from "./pages/NewRoutine.jsx";
import RoutineDetail from "@/pages/RoutineDetail";
import RoutineEdit from "@/pages/RoutineEdit"; // ✅ 새로 추가

function RouterError() {
  const err = useRouteError();
  console.error(err);
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>문제가 발생했어요 😥</h1>
      <p style={{ marginTop: 8, color: "#6b7280" }}>
        잠시 후 다시 시도해 주세요.
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouterError />,
    children: [
      { path: "/", element: <HomeRedirect /> },
      { path: "/landing", element: <LandingPage /> },
      { path: "/feed", element: <SocialFeed /> },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },

      {
        path: "/post",
        element: (
          <ProtectedRoute>
            <Post />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:postId",
        element: (
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        ),
      },

      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:userId",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },

      {
        path: "/routines",
        element: (
          <ProtectedRoute>
            <MyRoutines />
          </ProtectedRoute>
        ),
      },
      {
        path: "/routines/new",
        element: (
          <ProtectedRoute>
            <NewRoutine />
          </ProtectedRoute>
        ),
      },
      {
        path: "/routines/:id",
        element: (
          <ProtectedRoute>
            <RoutineDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/routines/edit/:id", // ✅ 수정 페이지
        element: (
          <ProtectedRoute>
            <RoutineEdit />
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: <div style={{ padding: 24 }}>페이지를 찾을 수 없어요</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
