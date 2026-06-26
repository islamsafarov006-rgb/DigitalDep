package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 🌟 Добавили импорт
import jakarta.persistence.*;
import labrary.digitaldepartment.Enums.SyllabusStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "documents", schema = "business")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "discipline_id", nullable = false)
    // 🌟 Игнорируем обратные ссылки внутри Discipline, если они там есть
    @JsonIgnoreProperties({"documents", "handler", "hibernateLazyInitializer"})
    private Discipline discipline;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    // 🌟 Игнорируем списки документов автора и его пароль ради безопасности
    @JsonIgnoreProperties({"documents", "password", "handler", "hibernateLazyInitializer"})
    private User author;

    private String academicYear;
    private Integer semester;

    @Enumerated(EnumType.STRING)
    private SyllabusStatus status;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AcademicLoad> academicLoads;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PaymentDetail> paymentDetails;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WeeklyTopic> weeklyTopics;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @PrimaryKeyJoinColumn
    @JsonIgnoreProperties("document") // 🌟 Защита от зацикливания с Силлабусом
    private Syllabus syllabus;

    public void setSyllabus(Syllabus syllabus) {
        if (syllabus == null) {
            if (this.syllabus != null) {
                this.syllabus.setDocument(null);
            }
        } else {
            syllabus.setDocument(this);
        }
        this.syllabus = syllabus;
    }

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CourseVolume> courseVolumes;
}