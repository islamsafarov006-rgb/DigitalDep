package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "disciplines", schema = "business")
@Getter
@Setter
public class Discipline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "course_code")
    private String courseCode;

    @Column(name = "credits_ects")
    private Integer creditsEcts;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "default_lectures")
    private Integer defaultLectures;

    @Column(name = "default_practice")
    private Integer defaultPractice;

    @Column(name = "default_siwt")
    private Integer defaultSiwt;

    @Column(name = "default_siw")
    private Integer defaultSiw;

    @Column(name = "recommended_course")
    private Integer recommendedCourse;

    @Column(name = "recommended_semester")
    private Integer recommendedSemester;
}