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
  auth_date: number;
  hash: string;
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
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  themeParams: {
    bg_color?: string;
    secondary_bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    header_bg_color?: string;
  };
  colorScheme: 'dark' | 'light';
}

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [initDataUnsafe, setInitDataUnsafe] = useState<TelegramWebApp['initDataUnsafe']>({});
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [themeParams, setThemeParams] = useState<TelegramWebApp['themeParams']>({});
  const [colorScheme, setColorScheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      setTg(telegram);
      setInitDataUnsafe(telegram.initDataUnsafe || {});
      setUser(telegram.initDataUnsafe?.user || null);
      setThemeParams(telegram.themeParams || {});
      setColorScheme(telegram.colorScheme || 'dark');
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
    initDataUnsafe,
    user,
    themeParams,
    colorScheme,
    hapticImpact,
    hapticNotification,
    hapticSelection,
  };
};
