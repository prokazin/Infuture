import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

const Menu = () => {
  const navigate = useNavigate();
  const { hapticImpact } = useTelegram();

  const menuItems = [
    { icon: '🏠', label: 'Главная', path: '/' },
    { icon: '📱', label: 'Каталог', path: '/catalog' },
    { icon: '❤️', label: 'Избранное', path: '/favorites' },
    { icon: '🔍', label: 'Поиск', path: '/search' },
    { icon: '🛒', label: 'Корзина', path: '/cart' },
    { icon: '👤', label: 'Профиль', path: '/profile' },
  ];

  const handleNavigate = (path: string) => {
    hapticImpact('light');
    navigate(path);
  };

  return (
    <div className="px-4 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-4">Меню</h1>
        
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(item.path)}
              className="glass rounded-2xl p-6 text-center cursor-pointer hover:bg-card/60 transition-colors"
            >
              <span className="text-4xl block mb-2">{item.icon}</span>
              <p className="text-white font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Версия</p>
              <p className="text-white font-semibold">1.0.0</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Сделано с ❤️</p>
              <p className="text-xs text-primary">Infuture</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
