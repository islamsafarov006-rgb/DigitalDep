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
@Table(name = "weekly_topics")
public class WeeklyTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer weekNumber;

    @Column(columnDefinition = "TEXT")
    private String lectureTopic;

    @Column(columnDefinition = "TEXT")
    private String practiceTopic;

    @Column(columnDefinition = "TEXT")
    private String srspTopic;

    @Column(columnDefinition = "TEXT")
    private String srsTopic;

    @Column(columnDefinition = "TEXT")
    private String spzTopic;

    @Column(name = "hours")
    private Integer hours;

    @Column(columnDefinition = "TEXT", name = "\"references\"")
    private String references;

    @Column(columnDefinition = "TEXT", name = "reporting_form")
    private String reportingForm;

    @Column(columnDefinition = "TEXT", name = "deadline")
    private String deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;
}