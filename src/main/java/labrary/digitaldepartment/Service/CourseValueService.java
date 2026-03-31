package labrary.digitaldepartment.Service;

import jakarta.transaction.Transactional;
import labrary.digitaldepartment.Entity.CourseVolume;
import labrary.digitaldepartment.Repository.CourseVolumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseValueService {

    private final CourseVolumeRepository courseVolumeRepository;

    public List<CourseVolume> getAll() {
        return courseVolumeRepository.findAll();
    }

    @Transactional
    public CourseVolume saveOrUpdate(CourseVolume volume) {

        int total = (volume.getLectures() != null ? volume.getLectures() : 0) +
                (volume.getPractice() != null ? volume.getPractice() : 0) +
                (volume.getSiw() != null ? volume.getSiw() : 0) +
                (volume.getSiwt() != null ? volume.getSiwt() : 0);

        volume.setTotal(total);
        return courseVolumeRepository.save(volume);
    }

    public Optional<CourseVolume> getByDocumentId(Long documentId) {
        return courseVolumeRepository.findByDocumentId(documentId);
    }
}