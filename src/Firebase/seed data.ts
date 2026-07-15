import { db } from './config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Product, Category } from '../types';

const categories: Omit<Category, 'id'>[] = [
  { name: 'Все', icon: '📱', slug: 'all' },
  { name: 'iPhone', icon: '📱', slug: 'iphone' },
  { name: 'Samsung', icon: '📱', slug: 'samsung' },
  { name: 'MacBook', icon: '💻', slug: 'macbook' },
  { name: 'iPad', icon: '📱', slug: 'ipad' },
  { name: 'Аксессуары', icon: '🔌', slug: 'accessories' },
];

const products: Omit<Product, 'id'>[] = [
  {
    name: 'iPhone 15 Pro Max',
    price: 129990,
    memory: '256GB',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    ],
    description: 'Новый iPhone 15 Pro Max с титановым корпусом и кнопкой действия.',
    specifications: {
      'Экран': '6.7" OLED Super Retina XDR',
      'Процессор': 'A17 Pro',
      'Камера': '48MP + 12MP + 12MP',
      'Батарея': '4422 мАч',
    },
    category: 'iPhone',
    inStock: true,
    isNew: true,
    isPopular: true,
    createdAt: new Date(),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 119990,
    memory: '512GB',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    ],
    description: 'Флагманский смартфон Samsung с AI-функциями и S Pen.',
    specifications: {
      'Экран': '6.8" Dynamic AMOLED 2X',
      'Процессор': 'Snapdragon 8 Gen 3',
      'Камера': '200MP + 12MP + 50MP + 10MP',
      'Батарея': '5000 мАч',
    },
    category: 'Samsung',
    inStock: true,
    isNew: true,
    createdAt: new Date(),
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    price: 349990,
    memory: '1TB',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
    ],
    description: 'Мощнейший ноутбук Apple с чипом M3 Max и Liquid Retina XDR дисплеем.',
    specifications: {
      'Экран': '16.2" Liquid Retina XDR',
      'Процессор': 'M3 Max (16-ядерный)',
      'Память': '36GB',
      'Графика': '40-ядерный GPU',
    },
    category: 'MacBook',
    inStock: true,
    isPopular: true,
    createdAt: new Date(),
  },
  {
    name: 'iPad Pro 12.9" M2',
    price: 129990,
    memory: '256GB',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    ],
    description: 'Профессиональный планшет с дисплеем Mini-LED и чипом M2.',
    specifications: {
      'Экран': '12.9" Liquid Retina XDR',
      'Процессор': 'M2',
      'Камера': '12MP + 10MP',
      'Батарея': 'до 10 часов',
    },
    category: 'iPad',
    inStock: true,
    createdAt: new Date(),
  },
  {
    name: 'AirPods Pro 2',
    price: 24990,
    memory: '—',
    image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400',
    images: [
      'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400',
    ],
    description: 'Наушники с активным шумоподавлением и адаптивным звуком.',
    specifications: {
      'Тип': 'Внутриканальные',
      'Подключение': 'Bluetooth 5.3',
      'Время работы': 'до 6 часов',
      'Зарядка': 'MagSafe',
    },
    category: 'Аксессуары',
    inStock: true,
    isPopular: true,
    createdAt: new Date(),
  },
  {
    name: 'Apple Watch Ultra 2',
    price: 79990,
    memory: '—',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
    ],
    description: 'Умные часы для экстремальных условий с ярким дисплеем и GPS.',
    specifications: {
      'Экран': '1.9" Always-On Retina',
      'Процессор': 'S9',
      'Защита': 'WR100 + EN13319',
      'Батарея': 'до 36 часов',
    },
    category: 'Аксессуары',
    inStock: true,
    isNew: true,
    createdAt: new Date(),
  },
];

export const seedData = async () => {
  try {
    // Добавляем категории
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), category);
    }
    console.log('Categories seeded successfully');

    // Добавляем товары
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
    }
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
