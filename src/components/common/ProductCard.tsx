import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { hapticImpact, hapticNotification } = useTelegram();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticImpact('light');
    await addToCart(product);
    hapticNotification('success');
  };

  const handleClick = () => {
    hapticImpact('light');
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={handleClick}
      className="glass rounded-2xl overflow-hidden cursor-pointer relative group"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Новинка
          </span>
        )}
        {product.isPopular && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Популярное
          </span>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate text-white">{product.name}</h3>
        {product.memory && (
          <p className="text-xs text-gray-400 mt-0.5">{product.memory}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">
            {product.price.toLocaleString()} ₽
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
            className="bg-primary text-white p-2 rounded-full hover:bg-primary/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
