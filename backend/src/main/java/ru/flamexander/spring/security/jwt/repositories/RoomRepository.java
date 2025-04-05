package ru.flamexander.spring.security.jwt.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.flamexander.spring.security.jwt.entities.Room;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByRoomType(String roomType);
    List<Room> findByRoomTitleContainingIgnoreCase(String roomTitle);
    List<Room> findByRoomTitleContainingAndPriceBetween(String roomTitle, double minPrice, double maxPrice);
    List<Room> findByPriceBetween(double minPrice, double maxPrice);

    // Новый метод для исключения комнат с определенным статусом
    Page<Room> findByStatusNot(String status, Pageable pageable);
}