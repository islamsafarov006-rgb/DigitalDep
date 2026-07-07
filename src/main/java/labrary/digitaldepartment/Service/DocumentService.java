package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.DTO.AssignCourseRequest;
import labrary.digitaldepartment.Entity.*;
import labrary.digitaldepartment.Enums.SyllabusStatus;
import labrary.digitaldepartment.Repository.CourseVolumeRepository;
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
    private final CourseVolumeRepository courseVolumeRepository;

    @Transactional
    public Document assignCourseAndVolume(AssignCourseRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден с ID: " + request.getTeacherId()));

        Discipline discipline = new Discipline();
        discipline.setName(request.getDocumentTitle());

        Document document = new Document();
        document.setDiscipline(discipline);
        document.setAuthor(teacher);
        document.setStatus(SyllabusStatus.DRAFT);

        // 🌟 Добавили сохранение учебного года и семестра
        document.setAcademicYear(request.getAcademicYear());
        document.setSemester(request.getSemester());

        document = documentRepository.save(document);

        CourseVolume volume = new CourseVolume();
        volume.setLectures(request.getLectures());
        volume.setPractice(request.getPractice());
        volume.setSiw(request.getSiw());
        volume.setSiwt(request.getSiwt());

        int totalHours = (request.getLectures() != null ? request.getLectures() : 0) +
                (request.getPractice() != null ? request.getPractice() : 0) +
                (request.getSiw() != null ? request.getSiw() : 0) +
                (request.getSiwt() != null ? request.getSiwt() : 0);
        volume.setTotal(totalHours);
        volume.setDocument(document);

        courseVolumeRepository.save(volume);
        return document;
    }

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
            document.setStatus(SyllabusStatus.DRAFT);
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

        // 1. Обновляем темы
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

        // 2. 🌟 Защита от стирания внешних ключей у GradingPolicy при сохранении графа Document
        if (document.getSyllabus() != null && document.getSyllabus().getGradingPolicies() != null) {
            Syllabus syllabus = document.getSyllabus();
            syllabus.getGradingPolicies().forEach(policy -> policy.setSyllabus(syllabus));
        }

        return documentRepository.save(document);
    }

    @Transactional
    public Document saveDiscipline(Document document) {
        String iin = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByIin(iin)
                .orElseThrow(() -> new RuntimeException("User not found by IIN: " + iin));
        document.setAuthor(currentUser);

        // Связываем топики
        if (document.getWeeklyTopics() != null) {
            document.getWeeklyTopics().forEach(topic -> topic.setDocument(document));
        }

        // 🌟 Связываем Силлабус и все его политики оценивания
        if (document.getSyllabus() != null) {
            Syllabus syllabus = document.getSyllabus();
            document.setSyllabus(syllabus);

            if (syllabus.getGradingPolicies() != null) {
                syllabus.getGradingPolicies().forEach(policy -> policy.setSyllabus(syllabus));
            }
        }

        if (document.getStatus() == null) {
            document.setStatus(SyllabusStatus.DRAFT);
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
    public Document updateStatus(Long id, SyllabusStatus newStatus) {
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

    @Transactional(readOnly = true)
    public List<Document> findAll() {
        return documentRepository.findAll();
    }
}