package labrary.digitaldepartment.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeeklyTopicDTO {
    private Integer weekNumber;
    private String lectureTopic;
    private String practiceTopic;
    private String srspTopic;
    private String spzTopic;
    private Integer hours;
    private String references;
    private String reportingForm;
    private String deadline;
}