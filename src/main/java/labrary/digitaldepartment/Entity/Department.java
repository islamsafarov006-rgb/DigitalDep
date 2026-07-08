package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "departments", schema = "business")
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

    // зав. кафедрой
    @ManyToOne
    @JoinColumn(name = "head_id")
    private User head;

    // все юзеры, привязанные к этой кафедре
    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<User> users;
}