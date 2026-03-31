package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "disciplines")
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


}