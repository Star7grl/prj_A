import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <img src={room.imageUrl || '/img/room_default.jpg'} alt={room.roomTitle} />
      <Link to={`/rooms/${room.roomId}`}>
        <h3>{room.roomTitle}</h3>
      </Link>
      <p>{room.description}</p>
      <p>Цена: {room.price} руб.</p>
      <Link to={`/booking/${room.roomId}`} className="book-btn">Забронировать</Link>
    </div>
  );
};

export default RoomCard;