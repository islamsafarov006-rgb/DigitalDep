package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.Feedback;
import labrary.digitaldepartment.Service.FeedbackMailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackMailService feedbackService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> handleSiteFeedback(
            @RequestPart("userEmail") String userEmail,
            @RequestPart("userName") String userName,
            @RequestPart("message") String message,
            @RequestPart(value = "file", required = false) MultipartFile screenshot) {
        try {
            feedbackService.sendAndSaveFeedback(userEmail, userName, message, screenshot);
            return ResponseEntity.ok(Map.of("status", "Успешно сохранено в БД и отправлено разработчику"));
        } catch (Exception e) {
            // Чтобы точно видеть причину ошибки в логах IntelliJ IDEA:
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/history")
    public ResponseEntity<List<Feedback>> getHistory(@RequestParam("email") String email) {
        return ResponseEntity.ok(feedbackService.getUserFeedbackHistory(email));
    }
}