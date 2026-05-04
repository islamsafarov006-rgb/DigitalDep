package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import labrary.digitaldepartment.Enums.DocumentStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;
@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "discipline_id", nullable = false)
    private Discipline discipline;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    private String academicYear;
    private Integer semester;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

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
}