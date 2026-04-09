package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.WeeklyTopic;
import labrary.digitaldepartment.Enums.DocumentStatus;
import labrary.digitaldepartment.Service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/my")
    public ResponseEntity<List<Document>> getMyDocuments() {
        return ResponseEntity.ok(documentService.findAllMyDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.findById(id));
    }

    @PostMapping("/discipline")
    public ResponseEntity<Document> saveDiscipline(@RequestBody Document document) {
        return new ResponseEntity<>(documentService.saveDiscipline(document), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/weekly-topics")
    public ResponseEntity<Document> updateWeeklyTopics(
            @PathVariable Long id,
            @RequestBody List<WeeklyTopic> topics) {
        return ResponseEntity.ok(documentService.updateWeeklyTopics(id, topics));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Document> changeStatus(
            @PathVariable Long id,
            @RequestParam DocumentStatus status) {
        return ResponseEntity.ok(documentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}