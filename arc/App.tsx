import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
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
  const { tg, initDataUnsafe } = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      
      if (tg.BackButton) {
        tg.BackButton.onClick(() => {
          window.history.back();
        });
      }
    }
  }, [tg]);

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
