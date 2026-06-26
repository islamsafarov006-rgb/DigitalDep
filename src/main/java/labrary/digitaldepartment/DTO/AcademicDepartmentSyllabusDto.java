package labrary.digitaldepartment.DTO;

import lombok.Data;

@Data
public class AcademicDepartmentSyllabusDto {
    private Long id;
    private String academicProgramCode;
    private String academicProgramTitle;
    private String courseCycle;
    private String finalAssessment;
    private Integer numberOfCredits;
    private String groupOfAcademicPrograms; // Только учебный план, структура и кредиты
}