package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "course_volumes")
public class CourseVolume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer lectures;
    private Integer practice;
    private Integer siw;
    private Integer siwt;
    private Integer total;
    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;}