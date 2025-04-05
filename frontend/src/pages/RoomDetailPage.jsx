import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomsApi from '../config/RoomsApi';
import { Link } from 'react-router-dom';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await RoomsApi.getRoomById(id);
        setRoom(data);
      } catch (error) {
        console.error('Ошибка загрузки комнаты:', error);
      }
    };
    fetchRoom();
  }, [id]);

  if (!room) return <div>Загрузка...</div>;

  return (
    <div className="room-detail">
      <h2>{room.roomTitle}</h2>
      <img src={room.imageUrl || '/img/room_default.jpg'} alt={room.roomTitle} />
      <p>{room.description}</p>
      <p>Цена: {room.price} руб.</p>
      {room.status === 'FREE' && (
        <Link to={`/booking/${room.roomId}`}>Забронировать</Link>
      )}
      {room.status === 'BOOKED' && <p>Комната забронирована</p>}
    </div>
  );
};

export default RoomDetailPage;