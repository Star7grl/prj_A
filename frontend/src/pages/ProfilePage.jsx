import React, { useState, useEffect } from "react";
import useUserStore from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient";
import BookingsApi from "../config/BookingsApi";
import ProfilePhoto from "../components/ProfilePhoto";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user && user.role === "ROLE_ADMIN") {
      navigate("/admin");
    }
    const fetchBookings = async () => {
      try {
        const data = await BookingsApi.fetchUserBookings(user.id);
        setBookings(data);
      } catch (error) {
        console.error("Ошибка загрузки броней:", error);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.put(
          `/api/users/profile/${user.id}`,
          { firstName, lastName },
          { withCredentials: true }
      );
      setUser(response.data);
      console.log("Профиль успешно обновлен:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post(
          `/api/users/profile/${user.id}/uploadPhoto`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
      );
      setUser(response.data); // Обновляем состояние пользователя
      alert("Фотография успешно загружена");
    } catch (error) {
      console.error("Ошибка при загрузке фотографии:", error);
      alert("Не удалось загрузить фотографию");
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
      <div className="container">
        <div className="profile-container">
          <h2 className="profile-title">ПРОФИЛЬ</h2>

          <div className="form-group">
            <label className="form-label">Фотография профиля:</label>
            <ProfilePhoto photoPath={user.photoPath} />
            <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handlePhotoUpload}
                disabled={!isEditing} // Отключаем поле, если редактирование не активно
                className={`form-input ${!isEditing ? "disabled" : ""}`}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Имя:</label>
            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? "disabled" : ""}`}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Фамилия:</label>
            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? "disabled" : ""}`}
            />
          </div>

          {isEditing ? (
              <button onClick={handleSave} className="btn btn-save">
                Сохранить
              </button>
          ) : (
              <button onClick={handleEdit} className="btn btn-edit">
                Редактировать
              </button>
          )}

          <p className="user-email">Email: {user.email}</p>

          <h3 className="bookings-title">ВАШИ БРОНИРОВАНИЯ</h3>

          <div className="bookings-section">
            {bookings.map((booking) => (
                <div key={booking.bookingId} className="booking">
                  <div className="booking-header">
                    <span className="booking-title">{booking.room.roomTitle}</span>
                  </div>
                  <div className="booking-dates">
                    <div className="date-group">
                      <span className="date-label">Заезд</span>
                      <span className="date-value">{booking.checkInDate}</span>
                    </div>
                    <div className="date-group">
                      <span className="date-label">Выезд</span>
                      <span className="date-value">{booking.checkOutDate}</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;