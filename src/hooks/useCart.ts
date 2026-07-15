import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CartItem, Product } from '../types';
import { useTelegram } from './useTelegram';

export const useCart = () => {
  const { user } = useTelegram();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    try {
      const cartRef = doc(db, 'carts', user.id.toString());
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items || []);
      } else {
        await setDoc(cartRef, { items: [], userId: user.id.toString() });
        setCart([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) return;
    try {
      const cartRef = doc(db, 'carts', user.id.toString());
      const existingItem = cart.find(item => item.productId === product.id);
      
      let newCart: CartItem[];
      if (existingItem) {
        newCart = cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...cart, { productId: product.id, quantity, product }];
      }
      
      await setDoc(cartRef, { items: newCart, userId: user.id.toString() });
      setCart(newCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    try {
      const newCart = cart.filter(item => item.productId !== productId);
      const cartRef = doc(db, 'carts', user.id.toString());
      await setDoc(cartRef, { items: newCart, userId: user.id.toString() });
      setCart(newCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      
      const newCart = cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const cartRef = doc(db, 'carts', user.id.toString());
      await setDoc(cartRef, { items: newCart, userId: user.id.toString() });
      setCart(newCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const cartRef = doc(db, 'carts', user.id.toString());
      await setDoc(cartRef, { items: [], userId: user.id.toString() });
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
  };
};
