import React, { useState, useEffect } from 'react';
import useUserStore from '../store/UserStore';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/apiClient';
import BookingsApi from '../config/BookingsApi';
import '../styles/Home.css';

const ProfilePage = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      navigate('/admin');
    }
    const fetchBookings = async () => {
      try {
        const data = await BookingsApi.fetchUserBookings(user.id);
        setBookings(data);
      } catch (error) {
        console.error('Ошибка загрузки броней:', error);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.put(`/api/users/profile/${user.id}`, {
        firstName,
        lastName,
      }, { withCredentials: true });
      setUser(response.data);
      console.log('Профиль успешно обновлен:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Профиль пользователя</h2>
      <div>
        <label>Имя:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>Фамилия:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      {isEditing ? (
        <button onClick={handleSave}>Сохранить</button>
      ) : (
        <button onClick={handleEdit}>Редактировать</button>
      )}
      <p>Email: {user.email}</p>

      <h3>Ваши бронирования</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.bookingId}>
            Комната: {booking.room.roomTitle}, Дата заезда: {booking.checkInDate}, Дата выезда: {booking.checkOutDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;