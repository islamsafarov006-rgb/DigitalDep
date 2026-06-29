package labrary.digitaldepartment.Configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.mail.ru");
        mailSender.setPort(465);
        mailSender.setUsername("digitaldep.iitu@mail.ru");
        // 🌟 Сюда обязательно вставь сгенерированный в Mail.ru пароль приложения из 16 букв
        mailSender.setPassword("FscPZZHtk5PzuTOyzeX2");
        mailSender.setProtocol("smtps"); // Принудительный защищенный протокол SMTPS (через SSL)

        // Чиним ошибку компиляции: создаем объект свойств вручную
        Properties props = new Properties();
        props.put("mail.smtps.auth", "true");
        props.put("mail.smtps.ssl.enable", "true");
        props.put("mail.smtps.socketFactory.port", "465");
        props.put("mail.smtps.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtps.socketFactory.fallback", "false");
        props.put("mail.debug", "true"); // Оставляем логи в консоли для проверки коннекта

        // Передаем эти свойства в конфигуратор
        mailSender.setJavaMailProperties(props);

        return mailSender;
    }
}