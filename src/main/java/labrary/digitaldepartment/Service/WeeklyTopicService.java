package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.WeeklyTopic;
import labrary.digitaldepartment.Repository.DocumentRepository;
import labrary.digitaldepartment.Repository.WeeklyTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeeklyTopicService {

    private final WeeklyTopicRepository weeklyTopicRepository;

    public List<WeeklyTopic> getByDocumentId(Long documentId) {
        return weeklyTopicRepository.findByDocumentIdOrderByWeekNumberAsc(documentId);
    }

    @Transactional
    public List<WeeklyTopic> saveAll(Long documentId, List<WeeklyTopic> topics) {
        weeklyTopicRepository.deleteAll(
                weeklyTopicRepository.findByDocumentIdOrderByWeekNumberAsc(documentId)
        );
        weeklyTopicRepository.flush();

        return weeklyTopicRepository.saveAll(topics);
    }

    @Transactional
    public WeeklyTopic save(WeeklyTopic topic) {
        return weeklyTopicRepository.save(topic);
    }

    @Transactional
    public void deleteByDocumentId(Long documentId) {
        List<WeeklyTopic> topics = getByDocumentId(documentId);
        weeklyTopicRepository.deleteAll(topics);
    }

    @Transactional
    public WeeklyTopic updateTopicDetails(Long id, WeeklyTopic updateData) {
        WeeklyTopic topic = weeklyTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));

        // Lecture
        topic.setLectureTopic(updateData.getLectureTopic());
        topic.setLectureHours(updateData.getLectureHours());
        topic.setLectureReferences(updateData.getLectureReferences());
        topic.setLectureReportingForm(updateData.getLectureReportingForm());
        topic.setLectureDeadline(updateData.getLectureDeadline());

        // Practice
        topic.setPracticeTopic(updateData.getPracticeTopic());
        topic.setPracticeHours(updateData.getPracticeHours());
        topic.setPracticeReferences(updateData.getPracticeReferences());
        topic.setPracticeReportingForm(updateData.getPracticeReportingForm());
        topic.setPracticeDeadline(updateData.getPracticeDeadline());

        // SRSP
        topic.setSrspTopic(updateData.getSrspTopic());
        topic.setSrspHours(updateData.getSrspHours());
        topic.setSrspReferences(updateData.getSrspReferences());
        topic.setSrspReportingForm(updateData.getSrspReportingForm());
        topic.setSrspDeadline(updateData.getSrspDeadline());

        // SRS
        topic.setSrsTopic(updateData.getSrsTopic());
        topic.setSrsHours(updateData.getSrsHours());
        topic.setSrsReferences(updateData.getSrsReferences());
        topic.setSrsReportingForm(updateData.getSrsReportingForm());
        topic.setSrsDeadline(updateData.getSrsDeadline());

        // SPZ
        topic.setSpzTopic(updateData.getSpzTopic());
        topic.setSpzHours(updateData.getSpzHours());
        topic.setSpzReferences(updateData.getSpzReferences());
        topic.setSpzReportingForm(updateData.getSpzReportingForm());
        topic.setSpzDeadline(updateData.getSpzDeadline());

        return weeklyTopicRepository.save(topic);
    }
}