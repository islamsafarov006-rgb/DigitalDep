package labrary.digitaldepartment.DTO;
import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.Syllabus;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class SyllabusExportDTO {

    private String academicProgramCode;
    private String courseCycle;
    private String finalAssessment;
    private String goals;
    private String objectives;
    private String learningOutcomes;
    private String courseDescription;
    private String coursePolicy;
    private String examinationTopics;


    private String courseTitle;
    private String academicYear;
    private Integer semester;
    private String authorFullName;
    private String authorPosition;
    private String departmentName;


    private List<WeeklyTopicDTO> weeklyTopics;

    public SyllabusExportDTO(Document doc, Syllabus syllabus) {

        if (syllabus != null) {
            this.academicProgramCode = syllabus.getAcademicProgramCode();
            this.academicProgramCode = syllabus.getAcademicProgramTitle();
            this.courseCycle = syllabus.getCourseCycle();
            this.finalAssessment = syllabus.getFinalAssessment();
            this.goals = syllabus.getGoals();
            this.objectives = syllabus.getObjectives();
            this.learningOutcomes = syllabus.getLearningOutcomes();
            this.courseDescription = syllabus.getCourseDescription();
            this.coursePolicy = syllabus.getCoursePolicy();
            this.examinationTopics = syllabus.getExaminationTopics();
        }


        this.academicYear = doc.getAcademicYear();
        this.semester = doc.getSemester();

        if (doc.getDiscipline() != null) {
            this.courseTitle = doc.getDiscipline().getName();
            if (doc.getDiscipline().getDepartment() != null) {
                this.departmentName = doc.getDiscipline().getDepartment().getNameRu();
            }
        }

        if (doc.getAuthor() != null) {
            this.authorFullName = doc.getAuthor().getFullName();
            this.authorPosition = doc.getAuthor().getPosition();
        }


        if (doc.getWeeklyTopics() != null) {
            this.weeklyTopics = doc.getWeeklyTopics().stream().map(topic -> {
                WeeklyTopicDTO dto = new WeeklyTopicDTO();
                dto.setWeekNumber(topic.getWeekNumber());
                dto.setLectureTopic(topic.getLectureTopic());
                dto.setPracticeTopic(topic.getPracticeTopic());
                dto.setSrspTopic(topic.getSrspTopic());
                dto.setSpzTopic(topic.getSpzTopic());
                dto.setHours(topic.getHours());
                dto.setReferences(topic.getReferences());
                dto.setReportingForm(topic.getReportingForm());
                dto.setDeadline(topic.getDeadline());
                return dto;
            }).collect(Collectors.toList());
        }
    }
}