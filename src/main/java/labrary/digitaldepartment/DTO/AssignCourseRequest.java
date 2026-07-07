package labrary.digitaldepartment.DTO; 

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignCourseRequest {
    private Long teacherId;
    private Long disciplineId;
    private String documentTitle;
    private String academicYear;
    private Integer semester;    
    private Integer lectures;
    private Integer practice;
    private Integer siw;
    private Integer siwt;
}