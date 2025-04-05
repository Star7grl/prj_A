import React, { useEffect, useState } from 'react';
import RoomsApi from '../config/RoomsApi';
import Pagination from '../components/Pagination';
import RoomCard from '../components/RoomCard';
import '../styles/Rooms.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await RoomsApi.getAllRooms(currentPage, itemsPerPage);
        setRooms(data.content || []);
        setTotalItems(data.totalElements || 0);
      } catch (error) {
        console.error('Ошибка загрузки комнат:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="rooms-page">
      <h2>НАШИ НОМЕРА</h2>
      <div className="rooms-list">
        {rooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RoomsPage;