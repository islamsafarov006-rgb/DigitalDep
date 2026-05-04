package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.WeeklyTopic;
import labrary.digitaldepartment.Enums.DocumentStatus;
import labrary.digitaldepartment.Service.DocumentService;
import labrary.digitaldepartment.Service.SyllabusGeneratorService; // Твой новый сервис
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final SyllabusGeneratorService syllabusGeneratorService; // Добавляем сервис генерации
    @GetMapping("/my")
    public ResponseEntity<List<Document>> getMyDocuments() {
        return ResponseEntity.ok(documentService.findAllMyDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.findById(id));
    }


    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportToWord(@PathVariable Long id) {
        try {
            // 1. Получаем документ из базы через твой существующий сервис
            Document document = documentService.findById(id);

            // 2. Генерируем массив байтов (файл Word)
            byte[] docContent = syllabusGeneratorService.generateSyllabus(document);

            // 3. Формируем ответ с правильными заголовками
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Syllabus_" + id + ".docx\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(docContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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