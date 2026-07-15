import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 Application starting...');
console.log('📱 Running in:', window.Telegram ? 'Telegram' : 'Browser');
console.log('🌐 URL:', window.location.href);
console.log('📱 User Agent:', navigator.userAgent);

const rootElement = document.getElementById('root');
console.log('📦 Root element:', rootElement);

if (rootElement) {
  console.log('✅ Root element found, rendering...');
  
  // Создаем индикатор загрузки
  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #181818;
      color: #8B5CF6;
      font-family: Arial, sans-serif;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">∞</div>
      <div style="font-size: 18px; color: white;">Загрузка Infuture...</div>
      <div style="font-size: 12px; color: #666; margin-top: 10px;">Версия 1.0.0</div>
    </div>
  `;

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully');
} else {
  console.error('❌ Root element not found!');
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #181818;
      color: #ff6b6b;
      font-family: Arial, sans-serif;
      padding: 20px;
    ">
      <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
      <h2 style="color: white;">Ошибка загрузки</h2>
      <p style="color: #888; text-align: center;">Root элемент не найден</p>
    </div>
  `;
}
