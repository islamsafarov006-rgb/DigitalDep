package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.SignedDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SignedDocumentRepository extends JpaRepository<SignedDocument, Long> {
    // Добавляем этот метод, так как сервис на него опирается
    Optional<SignedDocument> findByDocumentId(Long documentId);
}