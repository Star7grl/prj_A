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
      {room.status === 'FREE' && (
        <Link to={`/booking/${room.roomId}`} className="book-btn">Забронировать</Link>
      )}
      {room.status === 'BOOKED' && (
        <button disabled>Забронировано</button>
      )}
    </div>
  );
};

export default RoomCard;