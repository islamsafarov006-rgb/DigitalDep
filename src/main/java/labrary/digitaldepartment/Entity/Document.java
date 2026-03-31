package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import labrary.digitaldepartment.Enums.DocumentStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "discipline_id")
    private Discipline discipline;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    @Column(name = "academic_year")
    private String academicYear;

    private Integer semester;



    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WeeklyTopic> weeklyPlan;

    @ManyToMany
    @JoinTable(
            name = "document_library",
            joinColumns = @JoinColumn(name = "document_id"),
            inverseJoinColumns = @JoinColumn(name = "library_id")
    )
    private List<Library> selectedLiterature;

    private String courseCycle = "GER";
    private String finalAssessment = "Examination";

    @Column(name = "academic_program_code", length = 50)
    private String academicProgramCode;

    @Column(name = "academic_program_title", length = 1000)
    private String academicProgramTitle;
}