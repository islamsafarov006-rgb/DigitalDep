package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.SignedDocument;
import labrary.digitaldepartment.Service.SignedDocumentService;
// Имппортируй свой сервис генерации PDF, например:
// import labrary.digitaldepartment.Service.SyllabusGeneratorService;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/signed-documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SignedDocumentController {

    private final SignedDocumentService signedDocumentService;
    // Внедряем сервис, который отвечает за сборку PDF силлабуса
    // private final SyllabusGeneratorService syllabusGeneratorService;

    /**
     * Скачать сгенерированный PDF/DOCX документ для последующей печати и подписи.
     */
    @GetMapping("/download-pdf/{documentId}")
    public ResponseEntity<?> downloadPdf(@PathVariable Long documentId) {
        try {
            // ВЫЗЫВАЙ МЕТОД ИЗ ТОГО СЕРВИСА, ГДЕ ОН НАПИСАН:
            // byte[] pdf = syllabusGeneratorService.generatePdf(documentId);

            byte[] pdf = new byte[0]; // Временно, пока не подставишь свой сервис генерации

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"syllabus_" + documentId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при генерации документа: " + e.getMessage());
        }
    }

    /**
     * Загрузить отсканированный документ с печатями обратно в систему.
     */
    @PostMapping("/upload/{documentId}")
    public ResponseEntity<?> uploadScan(
            @PathVariable Long documentId,
            @RequestParam("file") MultipartFile file) {
        try {
            signedDocumentService.saveScan(documentId, file);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при сохранении файла в файловое хранилище: " + e.getMessage());
        }
    }

    /**
     * Просмотреть или скачать ранее загруженный подписанный скан прямо в браузере.
     */
    @GetMapping("/scan/{documentId}")
    public ResponseEntity<?> downloadScan(@PathVariable Long documentId) {
        try {
            SignedDocument signed = signedDocumentService.getByDocumentId(documentId);
            java.io.InputStream stream = signedDocumentService.getFileFromMinio(signed.getFilePath());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + signed.getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(stream));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Не удалось получить файл из хранилища.");
        }
    }
}