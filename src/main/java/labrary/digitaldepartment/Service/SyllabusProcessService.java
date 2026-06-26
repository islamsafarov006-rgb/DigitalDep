package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.DTO.CamundaTaskDto;
import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.Syllabus;
import labrary.digitaldepartment.Enums.ApprovalDecision;
import labrary.digitaldepartment.Enums.SyllabusStatus;
import labrary.digitaldepartment.Enums.UserRole;
import labrary.digitaldepartment.Repository.SyllabusRepository;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SyllabusProcessService {

    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final SyllabusRepository syllabusRepository;

    public SyllabusProcessService(RuntimeService runtimeService, TaskService taskService, SyllabusRepository syllabusRepository) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.syllabusRepository = syllabusRepository;
    }

    /**
     * Запуск процесса согласования силлабуса
     */
    public void startSyllabusProcess(String syllabusId, String initiator) {
        Syllabus syllabus = syllabusRepository.findById(Long.parseLong(syllabusId))
                .orElseThrow(() -> new RuntimeException("Syllabus not found with id: " + syllabusId));

        setStatus(syllabus, SyllabusStatus.PENDING_LIBRARIAN_AND_ACADEMIC);
        syllabusRepository.save(syllabus);

        Map<String, Object> variables = new HashMap<>();
        variables.put("syllabusId", syllabusId);
        variables.put("initiator", initiator);

        runtimeService.startProcessInstanceByKey("syllabus-approval-process", syllabusId, variables);
    }

    /**
     * Получение списка задач для роли
     */
    public List<CamundaTaskDto> getTasksForRole(UserRole role) {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup(role.name())
                .list();

        return mapTasksToDto(tasks);
    }

    /**
     * Получение списка задач на доработку для преподавателя
     */
    public List<CamundaTaskDto> getFixTasksForTeacher(String teacherName) {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup(UserRole.TEACHER.name())
                .taskAssignee(teacherName)
                .list();

        return mapTasksToDto(tasks);
    }

    /**
     * Вспомогательный метод для маппинга задач
     */
    private List<CamundaTaskDto> mapTasksToDto(List<Task> tasks) {
        return tasks.stream().map(task -> {
            CamundaTaskDto dto = new CamundaTaskDto();
            dto.setId(task.getId());
            dto.setName(task.getName());
            dto.setProcessInstanceId(task.getProcessInstanceId());
            dto.setProcessDefinitionId(task.getProcessDefinitionId());
            dto.setTaskDefinitionKey(task.getTaskDefinitionKey());
            dto.setAssignee(task.getAssignee());
            dto.setCreateTime(task.getCreateTime());

            Map<String, Object> processVars = taskService.getVariables(task.getId());
            if (processVars.get("syllabusId") != null) {
                dto.setSyllabusId(processVars.get("syllabusId").toString());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Вынесение решения по задаче проверки
     */
    public void completeReviewTask(String taskId, String reviewResultVariable, boolean isApproved,
                                   String approverName, String comment) {
        String syllabusId = (String) taskService.getVariable(taskId, "syllabusId");

        if (syllabusId != null) {
            Syllabus syllabus = syllabusRepository.findById(Long.parseLong(syllabusId)).orElse(null);
            if (syllabus != null) {
                applyDecision(syllabus, reviewResultVariable, isApproved, approverName, comment);

                if (!isApproved) {
                    setStatus(syllabus, SyllabusStatus.IN_FIXING);
                } else {
                    setStatus(syllabus, determineNextStatus(syllabus, reviewResultVariable));
                }

                syllabusRepository.save(syllabus);
            }
        }

        Map<String, Object> variables = new HashMap<>();
        variables.put(reviewResultVariable, isApproved);
        taskService.complete(taskId, variables);
    }

    /**
     * Определяет, на какой статус переводить документ после положительного решения
     */
    private SyllabusStatus determineNextStatus(Syllabus syllabus, String reviewResultVariable) {
        switch (reviewResultVariable) {
            case "libApproved":
            case "academicApproved":
                boolean libOk = syllabus.getLibrarianDecision() == ApprovalDecision.APPROVED;
                boolean acadOk = syllabus.getAcademicDecision() == ApprovalDecision.APPROVED;
                if (libOk && acadOk) {
                    return SyllabusStatus.PENDING_HEAD_OF_DEPARTMENT;
                }
                return syllabus.getStatus();

            case "headApproved":
                return SyllabusStatus.PENDING_DEANERY;

            case "deanApproved":
                return SyllabusStatus.APPROVED;

            default:
                return syllabus.getStatus();
        }
    }

    /**
     * Завершение доработки преподавателем
     */
    public void completeTeacherFixTask(String taskId) {
        String syllabusId = (String) taskService.getVariable(taskId, "syllabusId");
        if (syllabusId != null) {
            Syllabus syllabus = syllabusRepository.findById(Long.parseLong(syllabusId)).orElse(null);
            if (syllabus != null) {
                syllabus.startNewApprovalRound();
                setStatus(syllabus, SyllabusStatus.PENDING_LIBRARIAN_AND_ACADEMIC);
                syllabusRepository.save(syllabus);
            }
        }
        taskService.complete(taskId);
    }

    /**
     * Записывает решение конкретного этапа согласования
     */
    private void applyDecision(Syllabus syllabus, String reviewResultVariable, boolean isApproved,
                               String approverName, String comment) {
        ApprovalDecision decision = isApproved ? ApprovalDecision.APPROVED : ApprovalDecision.REJECTED;
        LocalDateTime now = LocalDateTime.now();

        switch (reviewResultVariable) {
            case "libApproved":
                syllabus.setLibrarianDecision(decision);
                syllabus.setLibrarianApprover(approverName);
                syllabus.setLibrarianComments(comment);
                syllabus.setLibrarianDecidedAt(now);
                break;
            case "academicApproved":
                syllabus.setAcademicDecision(decision);
                syllabus.setAcademicApprover(approverName);
                syllabus.setAcademicComments(comment);
                syllabus.setAcademicDecidedAt(now);
                break;
            case "headApproved":
                syllabus.setHeadDecision(decision);
                syllabus.setHeadApprover(approverName);
                syllabus.setHeadComments(comment);
                syllabus.setHeadDecidedAt(now);
                break;
            case "deanApproved":
                syllabus.setDeanDecision(decision);
                syllabus.setDeanApprover(approverName);
                syllabus.setDeanComments(comment);
                syllabus.setDeanDecidedAt(now);
                break;
            default:
                break;
        }
    }

    /**
     * ИСПРАВЛЕНО: Синхронизирует сложный статус Camunda с базовым статусом Document,
     * конвертируя его в строковые значения, которые разрешены констреинтом в PostgreSQL.
     */
    private void setStatus(Syllabus syllabus, SyllabusStatus status) {
        syllabus.setStatus(status);

        Document document = syllabus.getDocument();
        if (document != null) {
            document.setStatus(status); // Передаем enum напрямую
        }
    }
}