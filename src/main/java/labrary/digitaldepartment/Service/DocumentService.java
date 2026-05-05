    package labrary.digitaldepartment.Service;

    import labrary.digitaldepartment.Entity.Document;
    import labrary.digitaldepartment.Entity.User;
    import labrary.digitaldepartment.Entity.WeeklyTopic;
    import labrary.digitaldepartment.Enums.DocumentStatus;
    import labrary.digitaldepartment.Repository.DocumentRepository;
    import labrary.digitaldepartment.Repository.UserRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.security.access.AccessDeniedException;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.ArrayList;
    import java.util.List;


    @Service
    @RequiredArgsConstructor
    public class DocumentService {

        private final DocumentRepository documentRepository;
        private final UserRepository userRepository;

        @Transactional
        public Document saveDocument(Document document) {
            String iin = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByIin(iin)
                    .orElseThrow(() -> new RuntimeException("User not found by IIN: " + iin));
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
        private void checkAuthority(Document document) {
            String currentIin = SecurityContextHolder.getContext().getAuthentication().getName();

            if (document.getAuthor() == null || !document.getAuthor().getIin().equals(currentIin)) {
                throw new AccessDeniedException("У вас нет прав для доступа к этому документу");
            }
        }

        @Transactional
        public Document updateWeeklyTopics(Long documentId, List<WeeklyTopic> newTopics) {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));
            checkAuthority(document);
            if (document.getWeeklyTopics() != null) {
                document.getWeeklyTopics().clear();
            } else {
                document.setWeeklyTopics(new ArrayList<>());
            }
            if (newTopics != null) {
                newTopics.forEach(topic -> {
                    topic.setDocument(document);
                    document.getWeeklyTopics().add(topic);
                });
            }
            return documentRepository.save(document);
        }

        @Transactional
        public Document saveDiscipline(Document document) {
            String iin = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByIin(iin)
                    .orElseThrow(() -> new RuntimeException("User not found by IIN: " + iin));
            document.setAuthor(currentUser);
            if (document.getWeeklyTopics() != null) {
                document.getWeeklyTopics().forEach(topic -> topic.setDocument(document));
            }
            if (document.getStatus() == null) {
                document.setStatus(DocumentStatus.DRAFT);
            }

            return documentRepository.save(document);
        }

        @Transactional
        public void deleteDocument(Long id) {
            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            checkAuthority(document);
            documentRepository.delete(document);
        }

        @Transactional(readOnly = true)
        public Document findById(Long id) {
            return documentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
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