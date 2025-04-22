package ru.flamexander.spring.security.jwt.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import ru.flamexander.spring.security.jwt.dtos.BookingDto;
import ru.flamexander.spring.security.jwt.dtos.ServiceDto;
import ru.flamexander.spring.security.jwt.entities.Booking;
import ru.flamexander.spring.security.jwt.entities.BookingTicket;
import ru.flamexander.spring.security.jwt.entities.Room;
import ru.flamexander.spring.security.jwt.entities.Services;
import ru.flamexander.spring.security.jwt.entities.User;
import ru.flamexander.spring.security.jwt.exceptions.ResourceNotFoundException;
import ru.flamexander.spring.security.jwt.exceptions.RoomAlreadyBookedException;
import ru.flamexander.spring.security.jwt.repositories.BookingRepository;
import ru.flamexander.spring.security.jwt.repositories.BookingTicketRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final ServiceService serviceService;
    private final ModelMapper modelMapper;
    private final RoomService roomService;
    private final BookingTicketRepository bookingTicketRepository;
    private final PdfService pdfService;
    private final EmailService emailService;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          UserService userService,
                          ServiceService serviceService,
                          ModelMapper modelMapper,
                          RoomService roomService,
                          BookingTicketRepository bookingTicketRepository,
                          PdfService pdfService,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.serviceService = serviceService;
        this.modelMapper = modelMapper;
        this.roomService = roomService;
        this.bookingTicketRepository = bookingTicketRepository;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

    public Booking createBooking(BookingDto bookingDto) {
        Booking booking = modelMapper.map(bookingDto, Booking.class);

        User user = userService.findById(bookingDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        Optional<Room> roomOptional = roomService.getRoomById(bookingDto.getRoomId());
        Room room = roomOptional.orElseThrow(() -> new ResourceNotFoundException("Комната не найдена"));

        if (bookingDto.getCheckInDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Дата заезда не может быть в прошлом");
        }
        if (bookingDto.getCheckOutDate().isBefore(bookingDto.getCheckInDate())) {
            throw new IllegalArgumentException("Дата выезда не может быть раньше даты заезда");
        }
        if (isRoomBooked(room.getRoomId(), bookingDto.getCheckInDate(), bookingDto.getCheckOutDate())) {
            throw new RoomAlreadyBookedException("Комната уже забронирована на указанные даты");
        }

        Services service = null;
        if (bookingDto.getServiceId() != null) {
            ServiceDto serviceDto = serviceService.findById(bookingDto.getServiceId());
            service = modelMapper.map(serviceDto, Services.class);
        }

        booking.setUser(user);
        booking.setRoom(room);
        booking.setService(service);

        Booking savedBooking = bookingRepository.save(booking);

        // Создание BookingTicket
        BookingTicket ticket = new BookingTicket();
        ticket.setBoardingHouseName("ПАНСИОНАТ ЛЕСНЫЕ ДАЛИ");
        ticket.setUserFullName(user.getFirstName() + " " + user.getLastName());
        ticket.setRoomName(room.getRoomTitle());
        ticket.setCheckInDate(booking.getCheckInDate());
        ticket.setCheckOutDate(booking.getCheckOutDate());
        ticket.setPrice(BigDecimal.valueOf(room.getPrice()));

        bookingTicketRepository.save(ticket);

        // Генерация PDF и отправка email в фоне
        sendBookingTicketEmailAsync(ticket, user.getEmail());

        return savedBooking;
    }

    @Async
    public void sendBookingTicketEmailAsync(BookingTicket ticket, String email) {
        try {
            byte[] pdf = pdfService.generatePdf(ticket);
            emailService.sendBookingTicketEmail(email, pdf);
        } catch (Exception e) {
            System.err.println("Ошибка при отправке email: " + e.getMessage());
        }
    }

    public Booking updateBooking(Booking booking) {
        Booking existingBooking = bookingRepository.findById(booking.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Бронирование не найдено"));

        User user = userService.findById(booking.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        Optional<Room> roomOptional = roomService.getRoomById(booking.getRoom().getRoomId());
        Room room = roomOptional.orElseThrow(() -> new ResourceNotFoundException("Комната не найдена"));

        Services service = null;
        if (booking.getService() != null) {
            ServiceDto serviceDto = serviceService.findById(booking.getService().getServiceId());
            service = modelMapper.map(serviceDto, Services.class);
        }

        booking.setUser(user);
        booking.setRoom(room);
        booking.setService(service);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getUser().getId().equals(userId))
                .toList();
    }

    public List<Booking> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoom_RoomId(roomId);
    }

    public boolean isRoomBooked(Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Booking> bookings = bookingRepository.findAllByRoom_RoomIdAndCheckInDateGreaterThanEqualAndCheckOutDateLessThanEqual(
                roomId, checkInDate.minusDays(1), checkOutDate.plusDays(1));
        return bookings.stream().anyMatch(b ->
                !(b.getCheckOutDate().isBefore(checkInDate) || b.getCheckInDate().isAfter(checkOutDate)));
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Бронирование не найдено"));
        bookingRepository.delete(booking);
    }
}