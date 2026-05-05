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

    @GetMapping("/document/{documentId}")
    public List<WeeklyTopic> getByDocument(@PathVariable Long documentId) {
        return weeklyTopicService.getByDocumentId(documentId);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<WeeklyTopic>> saveBatch(@RequestBody List<WeeklyTopic> topics) {
        return ResponseEntity.ok(weeklyTopicService.saveAll(topics));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeeklyTopic> update(@PathVariable Long id, @RequestBody WeeklyTopic topic) {
        topic.setId(id);
        return ResponseEntity.ok(weeklyTopicService.save(topic));
    }

    @PutMapping("/{id}/details")
    public ResponseEntity<WeeklyTopic> updateDetails(@PathVariable Long id, @RequestBody WeeklyTopic topic) {
        return ResponseEntity.ok(weeklyTopicService.updateTopicDetails(id, topic));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        weeklyTopicRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}