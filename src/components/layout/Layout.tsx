import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomMenu from '../common/BottomMenu';
import { useTelegram } from '../../hooks/useTelegram';
import { useEffect } from 'react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tg } = useTelegram();

  useEffect(() => {
    if (tg?.BackButton) {
      const showBack = location.pathname !== '/';
      if (showBack) {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    }
  }, [location, tg]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide safe-area-top">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="pb-20"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomMenu />
    </div>
  );
};

export default Layout;
