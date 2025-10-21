import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Post from "./pages/Post.jsx";
import PostDetail from './pages/PostDetail.jsx';
import MyProfile from "./pages/MyProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomeRedirect from "./pages/HomeRedirect.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SocialFeed from "./pages/SocialFeed.jsx";
import MyRoutines from "./pages/MyRoutines.jsx";
import NewRoutine from "./pages/NewRoutine.jsx";

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeRedirect />,
      },
      {
        path: "/landing",
        element: <LandingPage />,
      },
      {
        path: "/feed",
        element: <SocialFeed />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/post",
        element: (
          <ProtectedRoute>
            <Post />
          </ProtectedRoute>
        ),
      },
      {
        path: '/post/:postId', // 게시물 '상세 보기' 페이지
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
        path: "/profile/:userId", // 다른 사용자 프로필
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
