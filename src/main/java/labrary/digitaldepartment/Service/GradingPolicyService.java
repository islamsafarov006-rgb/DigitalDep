package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.GradingPolicy;
import labrary.digitaldepartment.Repository.GradingPolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GradingPolicyService {

    private final GradingPolicyRepository repository;

    public Optional<GradingPolicy> getByDocumentId(Long documentId) {
        return repository.findByDocumentId(documentId);
    }

    @Transactional
    public GradingPolicy saveOrUpdate(GradingPolicy policy) {
        double sum = (policy.getFirstAttestationWeight() != null ? policy.getFirstAttestationWeight() : 0) +
                (policy.getSecondAttestationWeight() != null ? policy.getSecondAttestationWeight() : 0) +
                (policy.getFinalExamWeight() != null ? policy.getFinalExamWeight() : 0);

        if (Math.abs(sum - 1.0) > 0.0001) {
            System.out.println("Warning: Sum of weights is not 1.0: " + sum);
        }

        return repository.save(policy);
    }
}