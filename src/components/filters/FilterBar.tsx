import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Category } from '../../types';
import { useTelegram } from '../../hooks/useTelegram';

interface FilterBarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const FilterBar = ({ selectedCategory, onSelectCategory }: FilterBarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { hapticSelection } = useTelegram();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const cats: Category[] = [];
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (category: string | null) => {
    hapticSelection();
    onSelectCategory(category);
  };

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-20 h-9 bg-gray-800 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSelect(null)}
        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? 'bg-primary text-white'
            : 'bg-card text-gray-400 hover:bg-gray-700'
        }`}
      >
        Все
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(category.slug)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
            selectedCategory === category.slug
              ? 'bg-primary text-white'
              : 'bg-card text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span>{category.icon}</span>
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterBar;
