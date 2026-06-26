package labrary.digitaldepartment.Entity;

import labrary.digitaldepartment.Enums.SyllabusStatus;
import labrary.digitaldepartment.Enums.ApprovalDecision;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "syllabus", schema = "business")
public class Syllabus {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    @JsonBackReference
    private Document document;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SyllabusStatus status = SyllabusStatus.DRAFT;

    @Column(name = "approval_round")
    private Integer approvalRound = 1;

    // --- Библиотекарь ---
    @Enumerated(EnumType.STRING)
    @Column(name = "librarian_decision")
    private ApprovalDecision librarianDecision = ApprovalDecision.PENDING;

    @Column(name = "librarian_approver")
    private String librarianApprover;

    @Column(name = "librarian_comments", columnDefinition = "TEXT")
    private String librarianComments;

    @Column(name = "librarian_decided_at")
    private java.time.LocalDateTime librarianDecidedAt;

    // --- Методист / учебный отдел ---
    @Enumerated(EnumType.STRING)
    @Column(name = "academic_decision")
    private ApprovalDecision academicDecision = ApprovalDecision.PENDING;

    @Column(name = "academic_approver")
    private String academicApprover;

    @Column(name = "academic_comments", columnDefinition = "TEXT")
    private String academicComments;

    @Column(name = "academic_decided_at")
    private java.time.LocalDateTime academicDecidedAt;

    // --- Зав. кафедрой ---
    @Enumerated(EnumType.STRING)
    @Column(name = "head_decision")
    private ApprovalDecision headDecision = ApprovalDecision.PENDING;

    @Column(name = "head_approver")
    private String headApprover;

    @Column(name = "head_comments", columnDefinition = "TEXT")
    private String headComments;

    @Column(name = "head_decided_at")
    private java.time.LocalDateTime headDecidedAt;

    // --- Деканат ---
    @Enumerated(EnumType.STRING)
    @Column(name = "dean_decision")
    private ApprovalDecision deanDecision = ApprovalDecision.PENDING;

    @Column(name = "dean_approver")
    private String deanApprover;

    @Column(name = "dean_comments", columnDefinition = "TEXT")
    private String deanComments;

    @Column(name = "dean_decided_at")
    private java.time.LocalDateTime deanDecidedAt;

    private String academicProgramCode;
    private String academicProgramTitle;
    private String courseCycle;
    private String finalAssessment;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(name = "learning_outcomes", columnDefinition = "TEXT")
    private String learningOutcomes;

    @Column(name = "course_description", columnDefinition = "TEXT")
    private String courseDescription;

    @Column(name = "course_policy", columnDefinition = "TEXT")
    private String coursePolicy;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "syllabus_id")
    private List<Library> literature;

    @Column(columnDefinition = "TEXT")
    private String examinationTopics;

    // 🌟 Исправлено: перешли на корректный mappedBy
    @OneToMany(mappedBy = "syllabus", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    @JsonManagedReference
    private List<GradingPolicy> gradingPolicies;

    private Integer numberOfCredits;
    private String groupOfAcademicPrograms;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "syllabus_assessment_criteria",
            joinColumns = @JoinColumn(name = "syllabus_id")
    )
    @OrderBy("points DESC")
    private List<AssessmentCriterion> assessmentCriteria;

    public void startNewApprovalRound() {
        this.approvalRound++;
        this.librarianDecision = ApprovalDecision.PENDING;
        this.librarianApprover = null;
        this.librarianDecidedAt = null;

        this.academicDecision = ApprovalDecision.PENDING;
        this.academicApprover = null;
        this.academicDecidedAt = null;

        this.headDecision = ApprovalDecision.PENDING;
        this.headApprover = null;
        this.headDecidedAt = null;

        this.deanDecision = ApprovalDecision.PENDING;
        this.deanApprover = null;
        this.deanDecidedAt = null;
    }
}