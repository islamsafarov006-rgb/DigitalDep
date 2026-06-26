package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.DTO.AssignCourseRequest;
import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/management")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ManagementController {

    private final DocumentService documentService;

    @GetMapping("/documents/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDocumentsForManagement() { // Изменили List<Document> на ?
        try {
            List<Document> allDocuments = documentService.findAll();
            return ResponseEntity.ok(allDocuments);
        } catch (Exception e) {
            // 🌟 ВАЖНО: Выводим ошибку в консоль Spring Boot
            e.printStackTrace();

            // Отправляем описание ошибки фронтенду вместо унылого null
            return ResponseEntity.badRequest().body("Ошибка на бэкенде: " + e.getMessage());
        }
    }

    @PostMapping("/assign-course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignCourseToTeacher(@RequestBody AssignCourseRequest request) {
        try {
            // Исправлено: передаем ОДИН объект request вместо шести параметров!
            Document updatedDocument = documentService.assignCourseAndVolume(request);
            return ResponseEntity.ok(updatedDocument);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при распределении нагрузки: " + e.getMessage());
        }
    }
}