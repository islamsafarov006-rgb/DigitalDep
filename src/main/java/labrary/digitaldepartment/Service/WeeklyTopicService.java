package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.WeeklyTopic;
import labrary.digitaldepartment.Repository.WeeklyTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyTopicService {

    private final WeeklyTopicRepository weeklyTopicRepository;

    public List<WeeklyTopic> getByDocumentId(Long documentId) {
        return weeklyTopicRepository.findByDocumentIdOrderByWeekNumberAsc(documentId);
    }

    @Transactional
    public List<WeeklyTopic> saveAll(List<WeeklyTopic> topics) {
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
}