package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.WeeklyTopic;
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
}