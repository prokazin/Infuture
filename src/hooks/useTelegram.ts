import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    enable: () => void;
    disable: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  initDataUnsafe: {
    user?: TelegramUser;
  };
  initData?: string;
}

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('🔍 Checking for Telegram WebApp...');
    
    // Проверяем, что мы в Telegram
    const isTelegram = window.Telegram !== undefined;
    console.log('📱 Is Telegram environment:', isTelegram);
    console.log('📱 window.Telegram:', window.Telegram);
    
    if (!isTelegram) {
      console.warn('⚠️ Not running in Telegram. Using mock data.');
      // Создаем мок данные для разработки
      const mockUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: ''
      };
      setUser(mockUser);
      setIsReady(true);
      console.log('✅ Mock user set:', mockUser);
      return;
    }

    try {
      const telegram = window.Telegram.WebApp;
      console.log('📦 Telegram WebApp object:', telegram);
      
      if (telegram) {
        console.log('✅ Telegram WebApp found!');
        console.log('📊 initData:', telegram.initData);
        console.log('👤 User data:', telegram.initDataUnsafe?.user);
        
        setTg(telegram);
        setUser(telegram.initDataUnsafe?.user || null);
        setIsReady(true);
        
        // Важно: вызываем ready() только если это реальный Telegram
        try {
          telegram.ready();
          console.log('✅ Telegram.ready() called');
          telegram.expand();
          console.log('✅ Telegram.expand() called');
          
          // Показываем кнопку назад если нужно
          if (telegram.BackButton) {
            telegram.BackButton.hide();
            console.log('✅ BackButton hidden');
          }
        } catch (error) {
          console.error('❌ Error calling Telegram methods:', error);
        }
      } else {
        console.warn('⚠️ Telegram WebApp not available');
        // Fallback - мок данные
        const mockUser = {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          photo_url: ''
        };
        setUser(mockUser);
        setIsReady(true);
      }
    } catch (error) {
      console.error('❌ Error initializing Telegram:', error);
      // Fallback
      const mockUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: ''
      };
      setUser(mockUser);
      setIsReady(true);
    }
  }, []);

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  const hapticNotification = (type: 'error' | 'success' | 'warning' = 'success') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred(type);
    }
  };

  const hapticSelection = () => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.selectionChanged();
    }
  };

  return {
    tg,
    user,
    isReady,
    hapticImpact,
    hapticNotification,
    hapticSelection,
  };
};
