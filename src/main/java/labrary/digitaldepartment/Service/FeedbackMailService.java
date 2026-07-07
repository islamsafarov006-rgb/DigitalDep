package labrary.digitaldepartment.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import labrary.digitaldepartment.Entity.Feedback;
import labrary.digitaldepartment.Repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackMailService {

    private final JavaMailSender mailSender;
    private final FeedbackRepository feedbackRepository;

    // Куда прилетит готовое письмо
    private final String MY_PERSONAL_EMAIL = "digitaldep.iitu@mail.ru";

    /**
     * Основной метод: сохраняет отзыв в БД и отправляет уведомление на почту.
     * Добавлен throws IOException для безопасной обработки байтов файла.
     */
    public void sendAndSaveFeedback(String userEmail, String userName, String messageText, MultipartFile screenshot)
            throws MessagingException, IOException {

        // 1. Сохраняем в БД в изолированной транзакции
        saveToDatabase(userEmail, userName, messageText, screenshot);

        // 2. Настройка и отправка MIME-письма
        MimeMessage message = mailSender.createMimeMessage();

        // true указывает на то, что это мультипарт-письмо (с поддержкой HTML и вложений)
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Адрес твоей системной почты (технический отправитель)
        helper.setFrom("digitaldep.iitu@mail.ru");

        // Конечный адрес получателя фидбека
        helper.setTo(MY_PERSONAL_EMAIL);

        // Указываем адрес пользователя в поле Reply-To, чтобы не злить спам-фильтры
        helper.setReplyTo(userEmail);

        helper.setSubject("🚨 Фидбек с сайта от: " + userName);

        // Формируем HTML-тело письма
        String htmlBody = "<h2>Новое сообщение обратной связи</h2>" +
                "<p><strong>Отправитель:</strong> " + userName + " (" + userEmail + ")</p>" +
                "<p><strong>Текст сообщения:</strong></p>" +
                "<div style='background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 14px; border-left: 4px solid #3b82f6;'>" +
                messageText + "</div>";

        helper.setText(htmlBody, true);

        // Обработка вложения через ByteArrayResource (предотвращает зависание SMTP потока)
        if (screenshot != null && !screenshot.isEmpty()) {
            String fileName = screenshot.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) {
                fileName = "screenshot.png";
            }

            // Вычитываем байты из MultipartFile в оперативную память
            ByteArrayResource byteArrayResource = new ByteArrayResource(screenshot.getBytes());

            // Добавляем к письму
            helper.addAttachment(fileName, byteArrayResource, screenshot.getContentType());
        }

        // Отправка в сеть
        mailSender.send(message);
    }

    /**
     * Изолированный транзакционный метод для записи в базу данных.
     */
    @Transactional
    public void saveToDatabase(String userEmail, String userName, String messageText, MultipartFile screenshot) {
        Feedback feedback = new Feedback();
        feedback.setUserEmail(userEmail);
        feedback.setUserName(userName);
        feedback.setMessage(messageText);
        if (screenshot != null && !screenshot.isEmpty()) {
            feedback.setScreenshotUrl(screenshot.getOriginalFilename());
        }
        feedbackRepository.save(feedback);
    }

    public List<Feedback> getUserFeedbackHistory(String userEmail) {
        return feedbackRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }
}