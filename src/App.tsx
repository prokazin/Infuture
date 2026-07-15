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
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    try {
      console.log('📱 App mounted');
      console.log('🔧 isReady:', isReady);
      console.log('👤 User:', user);
      console.log('📦 Telegram:', tg);
      
      setDebugInfo({
        isReady,
        hasUser: !!user,
        hasTg: !!tg,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      
      const timer = setTimeout(() => {
        setShowApp(true);
        console.log('⏰ App showing after timeout');
      }, 3000);
      
      if (isReady && tg) {
        setShowApp(true);
        clearTimeout(timer);
        console.log('✅ App showing (ready)');
      }
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('❌ App error:', err);
      setError(String(err));
      setShowApp(true);
    }
  }, [isReady, user, tg]);

  // Если ошибка - показываем её
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#181818',
        color: '#ff6b6b',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: 'white' }}>Ошибка приложения</h2>
        <pre style={{ 
          background: '#2A2A2A', 
          padding: '15px', 
          borderRadius: '8px',
          color: '#ff6b6b',
          fontSize: '12px',
          maxWidth: '100%',
          overflow: 'auto'
        }}>
          {error}
        </pre>
      </div>
    );
  }

  // Если приложение не готово - показываем загрузку с отладкой
  if (!showApp) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#181818',
        color: '#8B5CF6',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>∞</div>
        <div style={{ fontSize: '18px', color: 'white' }}>Загрузка Infuture...</div>
        
        <div style={{ 
          marginTop: '20px',
          background: '#2A2A2A',
          padding: '15px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>
            📊 Статус:
          </div>
          <div style={{ color: isReady ? '#4CAF50' : '#FFA726', fontSize: '14px' }}>
            {isReady ? '✅ Telegram готов' : '⏳ Ожидание Telegram...'}
          </div>
          {user && (
            <div style={{ color: '#4CAF50', fontSize: '14px', marginTop: '5px' }}>
              👤 {user.first_name}
            </div>
          )}
          <div style={{ color: '#666', fontSize: '11px', marginTop: '10px', wordBreak: 'break-all' }}>
            URL: {window.location.href}
          </div>
        </div>
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
