import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Product } from '../types';
import ProductCard from '../components/common/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useTelegram } from '../hooks/useTelegram';

const Favorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useTelegram();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      // Здесь будет запрос к избранным товарам
      // Пока используем моковые данные
      const q = query(collection(db, 'products'), where('isPopular', '==', true));
      const querySnapshot = await getDocs(q);
      const prods: Product[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setFavorites(prods);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <span className="text-8xl block mb-4">❤️</span>
        <h2 className="text-2xl font-bold text-white">Войдите в систему</h2>
        <p className="text-gray-400 mt-2">Чтобы видеть избранное</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-4">Избранное</h1>
        
        {loading ? (
          <SkeletonLoader count={4} />
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl block mb-4">💔</span>
            <p className="text-gray-400">Нет избранных товаров</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Favorites;
