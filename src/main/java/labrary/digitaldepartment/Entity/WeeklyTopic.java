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

    private Integer weekNumber;

    @Column(columnDefinition = "TEXT")
    private String lectureTopic;

    @Column(columnDefinition = "TEXT")
    private String practiceTopic;

    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;
}