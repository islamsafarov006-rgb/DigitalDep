package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.WeeklyTopic;
import labrary.digitaldepartment.Repository.WeeklyTopicRepository;
import labrary.digitaldepartment.Service.WeeklyTopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WeeklyTopicController {

    private final WeeklyTopicService weeklyTopicService;
    private final WeeklyTopicRepository weeklyTopicRepository;

    // 1. Получение всех тем по ID документа
    @GetMapping("/document/{documentId}")
    public List<WeeklyTopic> getByDocument(@PathVariable Long documentId) {
        return weeklyTopicService.getByDocumentId(documentId);
    }

    // 2. Массовое сохранение/обновление списка тем
    @PostMapping("/batch")
    public ResponseEntity<List<WeeklyTopic>> saveBatch(@RequestBody List<WeeklyTopic> topics) {
        return ResponseEntity.ok(weeklyTopicService.saveAll(topics));
    }

    // 3. Полное обновление одной записи (замена объекта)
    @PutMapping("/{id}")
    public ResponseEntity<WeeklyTopic> update(@PathVariable Long id, @RequestBody WeeklyTopic topic) {
        topic.setId(id);
        return ResponseEntity.ok(weeklyTopicService.save(topic));
    }

    // 4. Частичное обновление (часы, ссылки, отчетность, дедлайн)
    @PutMapping("/{id}/details")
    public ResponseEntity<WeeklyTopic> updateDetails(@PathVariable Long id, @RequestBody WeeklyTopic topic) {
        return ResponseEntity.ok(weeklyTopicService.updateTopicDetails(id, topic));
    }

    // Рекомендую добавить метод для удаления, если на фронтенде будет возможность удалить неделю
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        weeklyTopicRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}