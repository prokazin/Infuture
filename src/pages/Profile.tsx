import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  orders: string[];
  favorites: string[];
}

const Profile = () => {
  const { user, themeParams } = useTelegram();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.id.toString());
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <span className="text-8xl block mb-4">👤</span>
        <h2 className="text-2xl font-bold text-white">Войдите в Telegram</h2>
        <p className="text-gray-400 mt-2">Откройте приложение в Telegram</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass rounded-2xl p-6 text-center">
          <div className="relative inline-block">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.first_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl border-4 border-primary">
                {user.first_name.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-white mt-3">
            {user.first_name} {user.last_name || ''}
          </h2>
          {user.username && (
            <p className="text-gray-400 text-sm">@{user.username}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">ID: {user.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="glass rounded-2xl p-4 text-center">
            <span className="text-3xl block mb-1">📦</span>
            <p className="text-2xl font-bold text-white">
              {userData?.orders.length || 0}
            </p>
            <p className="text-xs text-gray-400">Заказов</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <span className="text-3xl block mb-1">❤️</span>
            <p className="text-2xl font-bold text-white">
              {userData?.favorites.length || 0}
            </p>
            <p className="text-xs text-gray-400">Избранное</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mt-4">
          <h3 className="font-semibold text-white mb-2">История заказов</h3>
          {userData?.orders.length ? (
            <div className="space-y-2">
              {userData.orders.map((orderId, index) => (
                <div key={orderId} className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-sm text-gray-400">Заказ #{index + 1}</span>
                  <span className="text-xs text-primary">Подробнее →</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              У вас пока нет заказов
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
