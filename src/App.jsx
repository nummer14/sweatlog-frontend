import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      <main>
        {/* 이 Outlet 컴포넌트가 페이지를 바꾸는 핵심입니다. */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;