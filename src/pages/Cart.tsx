import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useTelegram } from '../hooks/useTelegram';
import { useState } from 'react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, getTotalItems } = useCart();
  const { hapticImpact, hapticNotification, tg } = useTelegram();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    hapticImpact('heavy');
    setIsCheckingOut(true);
    hapticNotification('success');
    
    if (tg?.MainButton) {
      tg.MainButton.setText('Оформление заказа...');
      tg.MainButton.disable();
    }

    setTimeout(() => {
      if (tg?.MainButton) {
        tg.MainButton.setText('Добавить в корзину');
        tg.MainButton.enable();
      }
      setIsCheckingOut(false);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <span className="text-8xl block mb-4">🛒</span>
        <h2 className="text-2xl font-bold text-white">Корзина пуста</h2>
        <p className="text-gray-400 mt-2">Добавьте товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-4">Корзина</h1>
        
        <div className="space-y-3">
          {cart.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-3 flex items-center gap-3"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 rounded-lg object-cover bg-gray-800"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-400">{item.product.memory}</p>
                <p className="text-sm font-bold text-primary">
                  {item.product.price.toLocaleString()} ₽
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-card text-white flex items-center justify-center text-sm"
                  >
                    -
                  </motion.button>
                  <span className="text-white font-semibold w-6 text-center text-sm">
                    {item.quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-card text-white flex items-center justify-center text-sm"
                  >
                    +
                  </motion.button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-400 text-xs hover:text-red-300"
                >
                  Удалить
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Товаров:</span>
            <span className="text-white">{getTotalItems()}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-white">Итого:</span>
            <span className="text-primary">{getTotal().toLocaleString()} ₽</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`w-full mt-3 py-3 rounded-full text-white font-semibold transition-all ${
              isCheckingOut ? 'bg-gray-600' : 'bg-primary hover:bg-primary/80'
            }`}
          >
            {isCheckingOut ? 'Оформление...' : 'Оформить заказ'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
