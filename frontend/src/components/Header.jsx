// components/Header.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import useUserStore from '../store/UserStore';


const Header = () => {
  const navigate = useNavigate();
  // Берем нужные данные из хранилища
  const { isAuth, user, isLoading, checkAuth, logout } = useUserStore();
  // Проверяем авторизацию при загрузке
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await logout();
      if (!useUserStore.getState().isAuth) {
        navigate('/login'); // Перенаправляем на страницу входа
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // Добавили уведомление пользователя об ошибке
      alert('Не удалось выйти. Попробуйте ещё раз.');
    }
  };

  // Показываем заглушку при загрузке
  if (isLoading) {
    return <div className="header-loading">Загрузка...</div>;
  }

  // components/Header.js
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Логотип</div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/rooms">Номера</Link></li>
            <li><Link to="/services">Услуги</Link></li>
          </ul>
        </nav>
        <nav className="auth-nav">
          <ul>
            {!isAuth ? (
              <>
                <li><Link to="/register">Регистрация</Link></li>
                <li><Link to="/login">Вход</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/profile">{user?.username || 'Профиль'}</Link></li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Выйти
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;