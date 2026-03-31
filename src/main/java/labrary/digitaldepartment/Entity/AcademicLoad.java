package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "academic_loads")
@Getter @Setter
public class AcademicLoad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "discipline")
    private String discipline;

    @Column(name = "student_group")
    private String studentGroup;

    @Column(name = "total_streams")
    private String totalStreams;

    @Column(name = "lecture_hours")
    private Integer lectureHours;

    @Column(name = "practice_hours")
    private Integer practiceHours;

    @Column(name = "lab_hours")
    private Integer labHours;

    @Column(name = "total_hours")
    private Integer totalHours;

    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;
}