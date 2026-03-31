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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(name = "academic_year")
    private String academicYear;

    private Integer semester;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AcademicLoad> academicLoads;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PaymentDetail> paymentDetails;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;
    private String academicProgramCode;
    private String academicProgramTitle;
    private String courseCycle;
    private String finalAssessment;

    @Column(columnDefinition = "TEXT")
    private String goals;
}