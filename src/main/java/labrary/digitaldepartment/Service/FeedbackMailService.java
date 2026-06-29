package labrary.digitaldepartment.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import labrary.digitaldepartment.Entity.Feedback;
import labrary.digitaldepartment.Repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackMailService {

    private final JavaMailSender mailSender;
    private final FeedbackRepository feedbackRepository;

    // Куда прилетит готовое письмо (для теста поставь свой личный alihan@mail.ru)
    private final String MY_PERSONAL_EMAIL = "alihan@mail.ru";

    // 🌟 УБРАЛИ @Transactional отсюда, чтобы не блокировать отправку сетью
    public void sendAndSaveFeedback(String userEmail, String userName, String messageText, MultipartFile screenshot) throws MessagingException {

        // 1. Сохраняем в БД (вынесли логику сохранения)
        saveToDatabase(userEmail, userName, messageText, screenshot);

        // 2. Отправка уведомления
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Строго адрес почты-системы
        helper.setFrom("digitaldep.iitu@mail.ru");

        // Адрес, куда придет фидбек
        helper.setTo(MY_PERSONAL_EMAIL);

        // 🌟 Указываем, что отвечать нужно на почту пользователя. Это убирает подозрения антиспама!
        helper.setReplyTo(userEmail);

        helper.setSubject("🚨 Фидбек с сайта от: " + userName);

        String htmlBody = "<h2>Новое сообщение обратной связи</h2>" +
                "<p><strong>Отправитель:</strong> " + userName + " (" + userEmail + ")</p>" +
                "<p><strong>Текст сообщения:</strong></p>" +
                "<div style='background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 14px; border-left: 4px solid #3b82f6;'>" +
                messageText + "</div>";

        helper.setText(htmlBody, true);

        if (screenshot != null && !screenshot.isEmpty()) {
            String fileName = screenshot.getOriginalFilename();
            helper.addAttachment(fileName != null ? fileName : "screenshot.png", screenshot);
        }

        mailSender.send(message);
    }

    // 🌟 Выделили сохранение в базу в отдельный изолированный транзакционный метод
    @org.springframework.transaction.annotation.Transactional
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