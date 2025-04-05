import React, { useEffect, useState } from 'react';
import RoomsApi from '../config/RoomsApi';
import Pagination from '../components/Pagination';
import '../styles/Admin.css';

const RoomsManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({ 
    roomTitle: '', 
    roomType: '', 
    description: '', 
    price: 0, 
    status: 'FREE', 
    imageUrl: '' // Добавлено новое поле
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await RoomsApi.getAllRoomsAdmin(currentPage, itemsPerPage);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRoom = await RoomsApi.createRoom(formData);
      setRooms([...rooms, newRoom]);
      setFormData({ roomTitle: '', roomType: '', description: '', price: 0, status: 'FREE', imageUrl: '' });
    } catch (error) {
      console.error('Ошибка создания комнаты:', error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRoom({ ...editingRoom, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRoom = await RoomsApi.updateRoom(editingRoom.roomId, editingRoom);
      setRooms(rooms.map((r) => (r.roomId === updatedRoom.roomId ? updatedRoom : r)));
      setEditingRoom(null);
    } catch (error) {
      console.error('Ошибка обновления комнаты:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await RoomsApi.deleteRoom(id);
      setRooms(rooms.filter((r) => r.roomId !== id));
    } catch (error) {
      console.error('Ошибка удаления комнаты:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="rooms-management">
      <h2>Управление комнатами</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="roomTitle"
          value={formData.roomTitle}
          onChange={handleInputChange}
          placeholder="Название комнаты"
          required
        />
        <input
          type="text"
          name="roomType"
          value={formData.roomType}
          onChange={handleInputChange}
          placeholder="Тип комнаты"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Описание"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Цена"
          required
        />
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="FREE">Свободна</option>
          <option value="BOOKED">Забронирована</option>
          <option value="HIDDEN">Снята с показа</option>
        </select>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
          placeholder="URL изображения"
        />
        <button type="submit">Добавить комнату</button>
      </form>

      {editingRoom && (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="roomTitle"
            value={editingRoom.roomTitle}
            onChange={handleEditInputChange}
            required
          />
          <input
            type="text"
            name="roomType"
            value={editingRoom.roomType}
            onChange={handleEditInputChange}
            required
          />
          <input
            type="text"
            name="description"
            value={editingRoom.description}
            onChange={handleEditInputChange}
            required
          />
          <input
            type="number"
            name="price"
            value={editingRoom.price}
            onChange={handleEditInputChange}
            required
          />
          <select
            name="status"
            value={editingRoom.status}
            onChange={handleEditInputChange}
          >
            <option value="FREE">Свободна</option>
            <option value="BOOKED">Забронирована</option>
            <option value="HIDDEN">Снята с показа</option>
          </select>
          <input
            type="text"
            name="imageUrl"
            value={editingRoom.imageUrl}
            onChange={handleEditInputChange}
            placeholder="URL изображения"
          />
          <button type="submit">Сохранить изменения</button>
          <button type="button" onClick={() => setEditingRoom(null)}>Отмена</button>
        </form>
      )}

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.roomId}>
            <h3>{room.roomTitle}</h3>
            <p>Тип: {room.roomType}</p>
            <p>Цена: {room.price} руб.</p>
            <p>Статус: {room.status}</p>
            <p>
              Изображение: {room.imageUrl ? (
                <img src={room.imageUrl} alt={room.roomTitle} style={{ width: '100px' }} />
              ) : (
                'Нет изображения'
              )}
            </p>
            <button onClick={() => setEditingRoom(room)}>Редактировать</button>
            <button onClick={() => handleDelete(room.roomId)}>Удалить</button>
          </div>
        ))}
      </div>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RoomsManagementPage;