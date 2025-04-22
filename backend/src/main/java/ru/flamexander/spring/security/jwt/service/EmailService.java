package ru.flamexander.spring.security.jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.util.ByteArrayDataSource;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingTicketEmail(String toEmail, byte[] pdf) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject("Ваш билет на бронирование");
        helper.setText("Ваш билет на бронирование во вложении.");
        helper.addAttachment("booking_ticket.pdf", new ByteArrayDataSource(pdf, "application/pdf"));
        mailSender.send(message);
    }

    public void sendResetLink(String toEmail, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(toEmail);
            helper.setSubject("Сброс пароля");
            helper.setText("Перейдите по ссылке для сброса пароля: " + resetLink + "\nСсылка действительна 10 минут.");
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Ошибка при отправке email для сброса пароля", e);
        }
    }
}