import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '../types';
import ProductCard from '../components/common/ProductCard';
import { useTelegram } from '../hooks/useTelegram';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { hapticImpact } = useTelegram();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        (p.memory && p.memory.toLowerCase().includes(searchLower))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
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

  const handleSearch = (value: string) => {
    hapticImpact('light');
    setSearchTerm(value);
  };

  return (
    <div className="px-4 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-card text-white rounded-full px-4 py-3 pl-12 outline-none focus:ring-2 focus:ring-primary transition-all text-lg"
            autoFocus
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {searchTerm && (
          <div className="mt-2">
            <p className="text-sm text-gray-400 mb-3">
              Найдено: {filteredProducts.length} товаров
            </p>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">🔍</span>
                <p className="text-gray-400">Ничего не найдено</p>
                <p className="text-gray-500 text-sm mt-1">Попробуйте изменить запрос</p>
              </div>
            )}
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-12">
            <span className="text-8xl block mb-4">🔍</span>
            <p className="text-gray-400 text-lg">Ищите товары</p>
            <p className="text-gray-500 text-sm mt-1">Введите название в поисковую строку</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
