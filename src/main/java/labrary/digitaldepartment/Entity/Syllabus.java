package labrary.digitaldepartment.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Syllabus{

    @Id
    private Long id;

    @Column(name = "academicProgramCode")
    private String academicProgramCode;

    @Column(name = "academicProgramTitle")
    private String academicProgramTitle;

    @Column(name = "courseCycle")
    private String courseCycle;

    @Column(name = "finalAssessment")
    private String finalAssessment;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(name = "Course_description")
    private String courseDescription;

    @Column(name = "coursePolicy")
    private String coursePolicy;

    @Column(name = "literature")
    private String literature;
}
