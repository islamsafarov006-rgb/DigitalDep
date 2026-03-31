package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.WeeklyTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyTopicRepository extends JpaRepository<WeeklyTopic, Long> {
    // Получить весь план на 15 недель для конкретного документа
    List<WeeklyTopic> findByDocumentIdOrderByWeekNumberAsc(Long documentId);
}