package labrary.digitaldepartment.Service;

import jakarta.transaction.Transactional;
import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.SignedDocument;
import labrary.digitaldepartment.Enums.SyllabusStatus;
import labrary.digitaldepartment.Repository.DocumentRepository;
import labrary.digitaldepartment.Repository.SignedDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SignedDocumentService {

    private final SignedDocumentRepository repository;
    private final DocumentRepository documentRepository;
    private final SyllabusGeneratorService syllabusGeneratorService;

    /**
     * Генерирует печатную форму документа (силлабуса).
     * Доступно только после полного согласования (статус APPROVED или SIGNED).
     */
    public byte[] generatePdf(Long documentId) throws Exception {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Проверяем статус: генерация доступна только для утвержденных/подписанных документов
        if (doc.getStatus() != SyllabusStatus.APPROVED && doc.getStatus() != SyllabusStatus.SIGNED) {
            throw new IllegalStateException("Документ еще не прошел все этапы согласования. Текущий статус: " + doc.getStatus());
        }

        // Передаем сам объект Document в генератор
        return syllabusGeneratorService.generateSyllabus(doc);
    }

    /**
     * Сохраняет отсканированный документ с печатями в базу данных
     * и переводит документ в финальный статус SIGNED.
     */
    @Transactional
    public void saveScan(Long documentId, MultipartFile file) throws IOException {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Проверяем, что документ находится на этапе, позволяющем загрузку скана
        if (doc.getStatus() != SyllabusStatus.APPROVED && doc.getStatus() != SyllabusStatus.SIGNED) {
            throw new IllegalStateException("Нельзя загрузить скан для несогласованного документа");
        }

        // Ищем существующий скан или создаем новый (на случай, если скан перезагружают)
        SignedDocument signed = repository.findByDocumentId(documentId)
                .orElse(new SignedDocument());

        signed.setDocument(doc);
        signed.setFileName(file.getOriginalFilename());
        signed.setFileData(file.getBytes());
        signed.setUploadedAt(LocalDateTime.now());
        repository.save(signed);

        // Переводим документ в финальный статус
        doc.setStatus(SyllabusStatus.SIGNED);
        documentRepository.save(doc);
    }

    /**
     * Получает данные загруженного скана по ID документа.
     */
    public SignedDocument getByDocumentId(Long documentId) {
        return repository.findByDocumentId(documentId)
                .orElseThrow(() -> new RuntimeException("Scan not found"));
    }
}