import apiClient from './apiClient';

const BookingsApi = {
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/api/bookings/add', bookingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error('Комната уже забронирована на указанные даты');
      }
      throw new Error('Ошибка при бронировании');
    }
  },  
  fetchUserBookings: async (userId) => {
    try {
      const response = await apiClient.get(`/api/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getBookingsByRoom: async (roomId) => {
    try {
      const response = await apiClient.get(`/api/bookings/room/${roomId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default BookingsApi;