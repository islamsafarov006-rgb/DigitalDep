package labrary.digitaldepartment.Service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.transaction.Transactional;
import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.SignedDocument;
import labrary.digitaldepartment.Enums.SyllabusStatus;
import labrary.digitaldepartment.Repository.DocumentRepository;
import labrary.digitaldepartment.Repository.SignedDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignedDocumentService {

    private final SignedDocumentRepository repository;
    private final DocumentRepository documentRepository;
    private final MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    @Transactional
    public void saveScan(Long documentId, MultipartFile file) throws Exception {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (doc.getStatus() != SyllabusStatus.APPROVED && doc.getStatus() != SyllabusStatus.SIGNED) {
            throw new IllegalStateException("Нельзя загрузить скан для несогласованного документа");
        }

        String uniqueFileName = "syllabus_" + documentId + "_" + UUID.randomUUID() + ".pdf";

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(uniqueFileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        }

        SignedDocument signed = repository.findByDocumentId(documentId)
                .orElse(new SignedDocument());

        signed.setDocument(doc);
        signed.setFileName(file.getOriginalFilename());
        signed.setFilePath(uniqueFileName);
        signed.setUploadedAt(LocalDateTime.now());
        repository.save(signed);

        doc.setStatus(SyllabusStatus.SIGNED);
        documentRepository.save(doc);
    }

    public InputStream getFileFromMinio(String filePath) throws Exception {
        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(filePath)
                        .build()
        );
    }

    public SignedDocument getByDocumentId(Long documentId) {
        return repository.findByDocumentId(documentId)
                .orElseThrow(() -> new RuntimeException("Scan not found"));
    }
}