package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "syllabus_id")
    private List<Library> literature;

    @Column(name = "examinationTopics")
    private String examinationTopics;
}
