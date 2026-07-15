import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Product, FilterState, SortOption } from '../types';
import ProductCard from '../components/common/ProductCard';
import FilterBar from '../components/filters/FilterBar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useTelegram } from '../hooks/useTelegram';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    search: '',
    sort: 'popular',
  });
  const { hapticImpact } = useTelegram();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, filters]);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const prods: Product[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setFilteredProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Фильтр по категории
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Поиск
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower)
      );
    }

    // Сортировка
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        filtered = filtered.filter(p => p.isPopular);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategorySelect = (category: string | null) => {
    hapticImpact('light');
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-card text-white rounded-full px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      <FilterBar
        selectedCategory={filters.category}
        onSelectCategory={handleCategorySelect}
      />

      <div className="flex items-center justify-between mt-3 mb-3">
        <span className="text-sm text-gray-400">
          {filteredProducts.length} товаров
        </span>
        <select
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as SortOption }))}
          className="bg-card text-white text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="popular">Популярные</option>
          <option value="newest">Новинки</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
        </select>
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-gray-400">Товары не найдены</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
