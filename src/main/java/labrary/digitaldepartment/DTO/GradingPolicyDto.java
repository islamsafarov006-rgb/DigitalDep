package labrary.digitaldepartment.DTO;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class GradingPolicyDto {
    private Long id;
    private String period;
    private String assignmentName;
    private boolean subItem;
    private boolean bold;
    private Integer score;
    private Integer total;
    private Integer sortOrder;
}