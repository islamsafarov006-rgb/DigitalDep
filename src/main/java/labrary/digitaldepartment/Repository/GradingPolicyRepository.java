package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.GradingPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GradingPolicyRepository extends JpaRepository<GradingPolicy,Long> {
    Optional<GradingPolicy> findByDocumentId(Long documentId);
}
