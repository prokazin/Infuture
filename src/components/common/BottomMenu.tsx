import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';

const menuItems = [
  { path: '/', icon: '🏪', label: 'Магазин' },
  { path: '/catalog', icon: '📂', label: 'Категории' },
  { path: '/', icon: '∞', label: 'Infuture', isLogo: true },
  { path: '/cart', icon: '🛒', label: 'Корзина' },
  { path: '/menu', icon: '☰', label: 'Меню' },
];

const BottomMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hapticSelection } = useTelegram();

  const handleNavigate = (path: string) => {
    hapticSelection();
    navigate(path);
  };

  return (
    <div className="glass fixed bottom-0 left-0 right-0 safe-area-bottom z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLogo = item.isLogo;

          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-200 ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {isActive && !isLogo && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-full"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className={`relative z-10 text-2xl ${isActive && !isLogo ? 'text-black' : ''}`}>
                {item.icon}
              </span>
              {!isLogo && (
                <span className={`text-[10px] mt-0.5 relative z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomMenu;
