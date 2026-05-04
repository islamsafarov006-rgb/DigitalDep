package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_ru", nullable = false)
    private String nameRu;

    @Column(name = "name_kk")
    private String nameKk;

    @Column(name = "name_en")
    private String nameEn;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;
}