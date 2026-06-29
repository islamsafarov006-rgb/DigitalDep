package labrary.digitaldepartment.Repository;


import labrary.digitaldepartment.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Получить историю фидбеков пользователя по его Email
    List<Feedback> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}