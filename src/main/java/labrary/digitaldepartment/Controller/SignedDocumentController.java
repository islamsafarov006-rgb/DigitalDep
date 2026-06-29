package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.SignedDocument;
import labrary.digitaldepartment.Service.SignedDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/signed-documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SignedDocumentController {

    private final SignedDocumentService signedDocumentService;

    /**
     * Скачать сгенерированный PDF/DOCX документ для последующей печати и подписи.
     * Доступно только для документов в статусе APPROVED или SIGNED.
     */
    @GetMapping("/download-pdf/{documentId}")
    public ResponseEntity<?> downloadPdf(@PathVariable Long documentId) {
        try {
            byte[] pdf = signedDocumentService.generatePdf(documentId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"syllabus_" + documentId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (IllegalStateException e) {
            // Ошибка валидации статуса (например, документ еще на согласовании)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Ошибка самой генерации файла внутри SyllabusGeneratorService
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при генерации документа: " + e.getMessage());
        }
    }

    /**
     * Загрузить отсканированный документ с печатями обратно в систему.
     * Автоматически переводит статус документа в SIGNED.
     */
    @PostMapping("/upload/{documentId}")
    public ResponseEntity<?> uploadScan(
            @PathVariable Long documentId,
            @RequestParam("file") MultipartFile file) throws IOException {
        try {
            signedDocumentService.saveScan(documentId, file);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            // Если пытаются загрузить скан для недокументированного или несогласованного силлабуса
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Скачать ранее загруженный подписанный скан.
     */
    @GetMapping("/scan/{documentId}")
    public ResponseEntity<byte[]> downloadScan(@PathVariable Long documentId) {
        SignedDocument signed = signedDocumentService.getByDocumentId(documentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + signed.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // Универсальный бинарный тип данных
                .body(signed.getFileData());
    }
}