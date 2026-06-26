package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.GradingPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GradingPolicyRepository extends JpaRepository<GradingPolicy, Long> {
    List<GradingPolicy> findBySyllabusIdOrderBySortOrderAsc(Long syllabusId);
    void deleteBySyllabusId(Long syllabusId);
}