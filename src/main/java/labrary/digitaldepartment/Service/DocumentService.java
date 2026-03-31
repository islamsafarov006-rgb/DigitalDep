package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Enums.DocumentStatus;
import labrary.digitaldepartment.Repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public List<Document> findAll() {
        return documentRepository.findAll();
    }

    public Document findById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    public List<Document> findByDeptAndStatus(Long deptId, DocumentStatus status) {
        return documentRepository.findByDeptAndStatus(deptId, status);
    }

    @Transactional
    public Document save(Document document) {
        if (document.getId() == null) {
            document.setStatus(DocumentStatus.DRAFT);
        }
        return documentRepository.save(document);
    }

    @Transactional
    public Document updateStatus(Long id, DocumentStatus newStatus) {
        Document document = findById(id);
        document.setStatus(newStatus);
        return documentRepository.save(document);
    }

    @Transactional
    public void delete(Long id) {
        documentRepository.deleteById(id);
    }
}