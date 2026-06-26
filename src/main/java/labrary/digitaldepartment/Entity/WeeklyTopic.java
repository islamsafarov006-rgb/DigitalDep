package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "weekly_topics", schema = "business")
public class WeeklyTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer weekNumber;

    // --- LECTURE ---
    @Column(columnDefinition = "TEXT")
    private String lectureTopic;

    @Column(name = "lecture_hours")
    private Integer lectureHours;

    @Column(columnDefinition = "TEXT", name = "lecture_references")
    private String lectureReferences;

    @Column(columnDefinition = "TEXT", name = "lecture_reporting_form")
    private String lectureReportingForm;

    @Column(columnDefinition = "TEXT", name = "lecture_deadline")
    private String lectureDeadline;

    // --- PRACTICE ---
    @Column(columnDefinition = "TEXT")
    private String practiceTopic;

    @Column(name = "practice_hours")
    private Integer practiceHours;

    @Column(columnDefinition = "TEXT", name = "practice_references")
    private String practiceReferences;

    @Column(columnDefinition = "TEXT", name = "practice_reporting_form")
    private String practiceReportingForm;

    @Column(columnDefinition = "TEXT", name = "practice_deadline")
    private String practiceDeadline;

    // --- SRSP ---
    @Column(columnDefinition = "TEXT")
    private String srspTopic;

    @Column(name = "srsp_hours")
    private Integer srspHours;

    @Column(columnDefinition = "TEXT", name = "srsp_references")
    private String srspReferences;

    @Column(columnDefinition = "TEXT", name = "srsp_reporting_form")
    private String srspReportingForm;

    @Column(columnDefinition = "TEXT", name = "srsp_deadline")
    private String srspDeadline;

    // --- SRS ---
    @Column(columnDefinition = "TEXT")
    private String srsTopic;

    @Column(name = "srs_hours")
    private Integer srsHours;

    @Column(columnDefinition = "TEXT", name = "srs_references")
    private String srsReferences;

    @Column(columnDefinition = "TEXT", name = "srs_reporting_form")
    private String srsReportingForm;

    @Column(columnDefinition = "TEXT", name = "srs_deadline")
    private String srsDeadline;

    // --- SPZ ---
    @Column(columnDefinition = "TEXT")
    private String spzTopic;

    @Column(name = "spz_hours")
    private Integer spzHours;

    @Column(columnDefinition = "TEXT", name = "spz_references")
    private String spzReferences;

    @Column(columnDefinition = "TEXT", name = "spz_reporting_form")
    private String spzReportingForm;

    @Column(columnDefinition = "TEXT", name = "spz_deadline")
    private String spzDeadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;
}