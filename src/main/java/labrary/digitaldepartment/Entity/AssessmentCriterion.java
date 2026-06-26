package labrary.digitaldepartment.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentCriterion {

    private Integer points;

    @Column(columnDefinition = "TEXT")
    private String criterion;
}