package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.CourseVolume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CourseVolumeRepository extends JpaRepository<CourseVolume, Long> {
    Optional<CourseVolume> findByDocumentId(Long documentId);
}
