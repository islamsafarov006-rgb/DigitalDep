package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;
@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "syllabus")
public class Syllabus {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Document document;

    private String academicProgramCode;
    private String academicProgramTitle;
    private String courseCycle;
    private String finalAssessment;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(name = "learning_outcomes", columnDefinition = "TEXT")
    private String learningOutcomes;

    @Column(name = "course_description", columnDefinition = "TEXT")
    private String courseDescription;

    @Column(name = "course_policy", columnDefinition = "TEXT")
    private String coursePolicy;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "syllabus_id")
    private List<Library> literature;

    @Column(columnDefinition = "TEXT")
    private String examinationTopics;

    private Integer numberOfCredits;
    private String groupOfAcademicPrograms;
}