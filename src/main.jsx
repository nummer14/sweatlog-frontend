import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Post from './pages/Post.jsx';

// 라우터 설정: 어떤 주소에 어떤 페이지를 보여줄지 정의합니다.
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 모든 페이지는 <App />(헤더 포함)을 껍데기로 사용합니다.
    children: [
      // App.jsx의 <Outlet/> 자리에 아래 페이지들이 들어갑니다.
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/post', element: <Post /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);