package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "departments")
@Setter
@Getter
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String nameRu;

    @Column(name = "name_kk", nullable = false)
    private String nameKk;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @JsonIgnore
    public String getName() {
        return nameRu;
    }

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<User> staff;
}