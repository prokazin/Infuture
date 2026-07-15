import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Menu from './pages/Menu';
import Favorites from './pages/Favorites';
import Search from './pages/Search';

function App() {
  const { tg, user, isReady } = useTelegram();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    console.log('📱 App mounted');
    console.log('🔧 isReady:', isReady);
    console.log('👤 User:', user);
    console.log('📦 Telegram:', tg);
    
    // Ждем готовности Telegram или показываем через 2 секунды
    const timer = setTimeout(() => {
      setShowApp(true);
      console.log('⏰ App showing after timeout');
    }, 2000);
    
    if (isReady) {
      setShowApp(true);
      clearTimeout(timer);
      console.log('✅ App showing (ready)');
    }
    
    return () => clearTimeout(timer);
  }, [isReady, user, tg]);

  // Если приложение не готово - показываем загрузку
  if (!showApp) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#181818',
        color: '#8B5CF6',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>∞</div>
        <div style={{ fontSize: '18px' }}>Загрузка Infuture...</div>
        <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          {isReady ? '✅ Telegram готов' : '⏳ Ожидание Telegram...'}
        </div>
        {user && (
          <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
            👤 {user.first_name}
          </div>
        )}
      </div>
    );
  }

  console.log('🚀 Rendering main app');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="menu" element={<Menu />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
