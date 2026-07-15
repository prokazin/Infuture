import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Product } from '../types';
import ProductCard from '../components/common/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useTelegram } from '../hooks/useTelegram';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, themeParams } = useTelegram();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const prods: Product[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            {user?.first_name ? `Привет, ${user.first_name}!` : 'Добро пожаловать!'}
          </h1>
          <p className="text-gray-400 text-sm">Лучшие предложения для вас</p>
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="glass w-10 h-10 rounded-full flex items-center justify-center"
        >
          <span className="text-xl">🛍️</span>
        </motion.div>
      </motion.div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Новинки</h2>
          <span className="text-primary text-sm">Смотреть все →</span>
        </div>
        
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
