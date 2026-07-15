import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product as ProductType } from '../types';
import { useCart } from '../hooks/useCart';
import { useTelegram } from '../hooks/useTelegram';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { hapticImpact, hapticNotification, tg } = useTelegram();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (tg?.MainButton) {
      tg.MainButton.setText('Добавить в корзину');
      tg.MainButton.show();
      tg.MainButton.onClick(handleAddToCart);
      
      return () => {
        tg.MainButton.hide();
        tg.MainButton.offClick(handleAddToCart);
      };
    }
  }, [product, quantity]);

  const loadProduct = async () => {
    try {
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as ProductType);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    hapticImpact('light');
    await addToCart(product, quantity);
    hapticNotification('success');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    hapticImpact('light');
  };

  if (loading) {
    return (
      <div className="px-4 pt-4">
        <SkeletonLoader type="product" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [product.image];

  return (
    <div className="px-4 pt-4 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Галерея */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-2 overflow-x-auto">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="mt-4 space-y-3">
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          {product.memory && (
            <p className="text-sm text-gray-400">Память: {product.memory}</p>
          )}
          <p className="text-3xl font-bold text-primary">
            {product.price.toLocaleString()} ₽
          </p>

          <div className="flex items-center gap-3 py-2">
            <span className="text-gray-400">Количество:</span>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full bg-card text-white flex items-center justify-center"
              >
                -
              </motion.button>
              <span className="text-white font-semibold w-8 text-center">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full bg-card text-white flex items-center justify-center"
              >
                +
              </motion.button>
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-white">Описание</h3>
              <p className="text-gray-300 text-sm mt-1">{product.description}</p>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white">Характеристики</h3>
              <div className="mt-2 space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-800">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Product;
