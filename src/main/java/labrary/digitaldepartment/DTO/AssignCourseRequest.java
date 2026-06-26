package labrary.digitaldepartment.DTO; 

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignCourseRequest {
    private Long teacherId;
    private String documentTitle;
    private Integer lectures;
    private Integer practice;
    private Integer siw;
    private Integer siwt;
}