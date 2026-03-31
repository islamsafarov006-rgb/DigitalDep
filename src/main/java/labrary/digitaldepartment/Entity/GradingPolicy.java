package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "grading_policies")
@Getter
@Setter
public class GradingPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double firstAttestationWeight;  // 0.3 [cite: 50]
    private Double secondAttestationWeight; // 0.3 [cite: 50]
    private Double finalExamWeight;        // 0.4 [cite: 50]

    @Column(columnDefinition = "TEXT")
    private String attendancePolicy; // Правила по пропускам (>20% - Retake) [cite: 51]

    // В файле WeeklyTopic.java
    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;


}