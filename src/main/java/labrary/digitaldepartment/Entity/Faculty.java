package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "faculties")
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_ru", nullable = false, unique = true)
    private String nameRu;

    @Column(name = "name_kk")
    private String nameKk;

    @Column(name = "name_en")
    private String nameEn;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Department> departments;
}