package labrary.digitaldepartment.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeeklyTopicDTO {
    private Integer weekNumber;

    private String lectureTopic;
    private Integer lectureHours;
    private String lectureReferences;
    private String lectureReportingForm;
    private String lectureDeadline;

    private String practiceTopic;
    private Integer practiceHours;
    private String practiceReferences;
    private String practiceReportingForm;
    private String practiceDeadline;

    private String srspTopic;
    private Integer srspHours;
    private String srspReferences;
    private String srspReportingForm;
    private String srspDeadline;

    private String srsTopic;
    private Integer srsHours;
    private String srsReferences;
    private String srsReportingForm;
    private String srsDeadline;

    private String spzTopic;
    private Integer spzHours;
    private String spzReferences;
    private String spzReportingForm;
    private String spzDeadline;
}