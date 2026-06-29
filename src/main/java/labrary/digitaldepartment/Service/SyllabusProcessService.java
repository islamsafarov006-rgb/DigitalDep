package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.DTO.CamundaTaskDto;
import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.Syllabus;
import labrary.digitaldepartment.Enums.ApprovalDecision;
import labrary.digitaldepartment.Enums.SyllabusStatus;
import labrary.digitaldepartment.Enums.UserRole;
import labrary.digitaldepartment.Repository.SyllabusRepository;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
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
    private final HistoryService historyService;
    private final SyllabusRepository syllabusRepository;

    public SyllabusProcessService(RuntimeService runtimeService,
                                  TaskService taskService,
                                  HistoryService historyService,
                                  SyllabusRepository syllabusRepository) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.historyService = historyService;
        this.syllabusRepository = syllabusRepository;
    }

    // ─────────────────────────────────────────────────────────────
    // ЗАПУСК ПРОЦЕССА
    // ─────────────────────────────────────────────────────────────

    public void startSyllabusProcess(String syllabusId, String initiator) {
        Syllabus syllabus = syllabusRepository.findById(Long.parseLong(syllabusId))
                .orElseThrow(() -> new RuntimeException("Syllabus not found: " + syllabusId));

        setStatus(syllabus, SyllabusStatus.PENDING_LIBRARIAN_AND_ACADEMIC);
        syllabusRepository.save(syllabus);

        Map<String, Object> variables = new HashMap<>();
        variables.put("syllabusId", syllabusId);
        variables.put("initiator", initiator);

        runtimeService.startProcessInstanceByKey("syllabus-approval-process", syllabusId, variables);
    }

    // ─────────────────────────────────────────────────────────────
    // ПОЛУЧЕНИЕ ЗАДАЧ
    // ─────────────────────────────────────────────────────────────

    /**
     * Задачи для роли (библиотекарь, методист, зав. кафедрой, деканат).
     * Ищем по candidateGroup — именно так назначены задачи в BPMN.
     */
    public List<CamundaTaskDto> getTasksForRole(UserRole role) {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup(role.name())
                .active()
                .list();

        return mapTasksToDto(tasks);
    }

    /**
     * ИСПРАВЛЕНО: задачи на доработку для преподавателя.
     * Task_FixSyllabus назначен через assignee="${initiator}", а НЕ через candidateGroup.
     * Поэтому ищем только по taskDefinitionKey + assignee, без candidateGroup.
     */
    public List<CamundaTaskDto> getFixTasksForTeacher(String teacherName) {
        List<Task> tasks = taskService.createTaskQuery()
                .taskDefinitionKey("Task_FixSyllabus")
                .taskAssignee(teacherName)
                .active()
                .list();

        return mapTasksToDto(tasks);
    }

    // ─────────────────────────────────────────────────────────────
    // ВЫНЕСЕНИЕ РЕШЕНИЯ
    // ─────────────────────────────────────────────────────────────

    /**
     * ИСПРАВЛЕНО: порядок параметров — approverName идёт перед comment,
     * что совпадает с вызовом из контроллера.
     */
    public void completeReviewTask(String taskId,
                                   String reviewResultVariable,
                                   boolean isApproved,
                                   String approverName,
                                   String comment) {
        String syllabusId = (String) taskService.getVariable(taskId, "syllabusId");

        if (syllabusId != null) {
            Syllabus syllabus = syllabusRepository.findById(Long.parseLong(syllabusId)).orElse(null);
            if (syllabus != null) {
                applyDecision(syllabus, reviewResultVariable, isApproved, approverName, comment);

                SyllabusStatus nextStatus = isApproved
                        ? determineNextStatus(syllabus, reviewResultVariable)
                        : SyllabusStatus.IN_FIXING;
                setStatus(syllabus, nextStatus);

                syllabusRepository.save(syllabus);
            }
        }

        Map<String, Object> variables = new HashMap<>();
        variables.put(reviewResultVariable, isApproved);
        taskService.complete(taskId, variables);
    }

    // ─────────────────────────────────────────────────────────────
    // ДОРАБОТКА ПРЕПОДАВАТЕЛЕМ
    // ─────────────────────────────────────────────────────────────

    public void completeTeacherFixTask(String taskId) {
        String syllabusId = (String) taskService.getVariable(taskId, "syllabusId");

        if (syllabusId != null) {
            Syllabus syllabus = syllabusRepository.findById(Long.parseLong(syllabusId)).orElse(null);
            if (syllabus != null) {
                // Сбрасываем все предыдущие решения для нового раунда согласования
                resetApprovalDecisions(syllabus);
                setStatus(syllabus, SyllabusStatus.PENDING_LIBRARIAN_AND_ACADEMIC);
                syllabusRepository.save(syllabus);
            }
        }

        taskService.complete(taskId);
    }

    // ─────────────────────────────────────────────────────────────
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ─────────────────────────────────────────────────────────────

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

            // Безопасно читаем syllabusId из переменных процесса
            try {
                Object syllabusIdVar = taskService.getVariable(task.getId(), "syllabusId");
                if (syllabusIdVar != null) {
                    dto.setSyllabusId(syllabusIdVar.toString());
                }
            } catch (Exception e) {
                // задача уже завершена или переменная недоступна
            }

            return dto;
        }).collect(Collectors.toList());
    }

    private SyllabusStatus determineNextStatus(Syllabus syllabus, String reviewResultVariable) {
        return switch (reviewResultVariable) {
            case "libApproved", "academicApproved" -> {
                boolean libOk  = syllabus.getLibrarianDecision() == ApprovalDecision.APPROVED;
                boolean acadOk = syllabus.getAcademicDecision()  == ApprovalDecision.APPROVED;
                yield (libOk && acadOk)
                        ? SyllabusStatus.PENDING_HEAD_OF_DEPARTMENT
                        : syllabus.getStatus(); // ждём второго проверяющего
            }
            case "headApproved" -> SyllabusStatus.PENDING_DEANERY;
            case "deanApproved" -> SyllabusStatus.APPROVED;
            default             -> syllabus.getStatus();
        };
    }

    private void applyDecision(Syllabus syllabus,
                               String reviewResultVariable,
                               boolean isApproved,
                               String approverName,
                               String comment) {
        ApprovalDecision decision = isApproved ? ApprovalDecision.APPROVED : ApprovalDecision.REJECTED;
        LocalDateTime now = LocalDateTime.now();

        switch (reviewResultVariable) {
            case "libApproved" -> {
                syllabus.setLibrarianDecision(decision);
                syllabus.setLibrarianApprover(approverName);
                syllabus.setLibrarianComments(comment);
                syllabus.setLibrarianDecidedAt(now);
            }
            case "academicApproved" -> {
                syllabus.setAcademicDecision(decision);
                syllabus.setAcademicApprover(approverName);
                syllabus.setAcademicComments(comment);
                syllabus.setAcademicDecidedAt(now);
            }
            case "headApproved" -> {
                syllabus.setHeadDecision(decision);
                syllabus.setHeadApprover(approverName);
                syllabus.setHeadComments(comment);
                syllabus.setHeadDecidedAt(now);
            }
            case "deanApproved" -> {
                syllabus.setDeanDecision(decision);
                syllabus.setDeanApprover(approverName);
                syllabus.setDeanComments(comment);
                syllabus.setDeanDecidedAt(now);
            }
        }
    }

    /**
     * ИСПРАВЛЕНО: вместо вызова несуществующего startNewApprovalRound()
     * явно сбрасываем все решения предыдущего раунда.
     */
    private void resetApprovalDecisions(Syllabus syllabus) {
        syllabus.setLibrarianDecision(null);
        syllabus.setLibrarianApprover(null);
        syllabus.setLibrarianComments(null);
        syllabus.setLibrarianDecidedAt(null);

        syllabus.setAcademicDecision(null);
        syllabus.setAcademicApprover(null);
        syllabus.setAcademicComments(null);
        syllabus.setAcademicDecidedAt(null);

        syllabus.setHeadDecision(null);
        syllabus.setHeadApprover(null);
        syllabus.setHeadComments(null);
        syllabus.setHeadDecidedAt(null);

        syllabus.setDeanDecision(null);
        syllabus.setDeanApprover(null);
        syllabus.setDeanComments(null);
        syllabus.setDeanDecidedAt(null);
    }

    private void setStatus(Syllabus syllabus, SyllabusStatus status) {
        syllabus.setStatus(status);
        Document document = syllabus.getDocument();
        if (document != null) {
            document.setStatus(status);
        }
    }
}