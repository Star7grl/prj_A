import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingsApi from '../config/BookingsApi';
import RoomsApi from '../config/RoomsApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUserStore from '../store/UserStore';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await RoomsApi.getRoomById(roomId);
        setRoom(data);
      } catch (error) {
        console.error('Ошибка загрузки данных о комнате:', error);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setError('Пожалуйста, выберите даты заезда и выезда');
      return;
    }
    try {
      await BookingsApi.createBooking({
        userId: user.id,
        roomId,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
      });
      alert('Бронирование успешно');
      navigate('/profile');
    } catch (error) {
        console.error('Ошибка при бронировании:', error);
        if (error.message.includes('уже забронирована')) {
            alert('Комната уже забронирована на указанные даты');
        } else {
            alert('Не удалось забронировать комнату');
        }
    }
  };

  if (!room) return <div>Загрузка...</div>;

  return (
    <div className="booking-page">
      <h2>Бронирование комнаты: {room.roomTitle}</h2>
      <img src={room.imageUrl || '/img/room_default.jpg'} alt={room.roomTitle} />
      <p>{room.description}</p>
      <p>Цена: {room.price} руб.</p>
      <DatePicker
        selected={checkInDate}
        onChange={(date) => setCheckInDate(date)}
        minDate={new Date()}
        placeholderText="Дата заезда"
      />
      <DatePicker
        selected={checkOutDate}
        onChange={(date) => setCheckOutDate(date)}
        minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
        placeholderText="Дата выезда"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleBooking}>Оформить</button>
    </div>
  );
};

export default BookingPage;