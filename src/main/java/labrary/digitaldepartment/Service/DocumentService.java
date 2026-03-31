package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.User;
import labrary.digitaldepartment.Enums.DocumentStatus;
import labrary.digitaldepartment.Repository.DocumentRepository;
import labrary.digitaldepartment.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Document saveDocument(Document document) {
        String iin = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("DEBUG: Поиск автора документа по ИИН: [" + iin + "]");
        User currentUser = userRepository.findByIin(iin)
                .orElseThrow(() -> {
                    System.err.println("ERROR: Пользователь с ИИН '" + iin + "' не найден!");
                    return new RuntimeException("User not found by IIN: " + iin);
                });
        document.setAuthor(currentUser);
        if (document.getAcademicLoads() != null) {
            document.getAcademicLoads().forEach(load -> load.setDocument(document));
        }
        if (document.getPaymentDetails() != null) {
            document.getPaymentDetails().forEach(payment -> payment.setDocument(document));
        }
        if (document.getStatus() == null) {
            document.setStatus(DocumentStatus.DRAFT);
        }
        return documentRepository.save(document);
    }

    public Document findById(Long id) {
        return documentRepository.findById(id).orElseThrow();
    }

    @Transactional
    public void delete(Long id) {
        documentRepository.deleteById(id);
    }

    @Transactional
    public Document updateStatus(Long id, DocumentStatus newStatus) {
        Document document = findById(id);
        document.setStatus(newStatus);
        return documentRepository.save(document);
    }
    public List<Document> findAllMyDocuments() {
        String iin = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByIin(iin)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return documentRepository.findAllByAuthorId(currentUser.getId());
    }
}