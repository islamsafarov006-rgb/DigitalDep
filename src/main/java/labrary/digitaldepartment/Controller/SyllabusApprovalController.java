package labrary.digitaldepartment.Controller;

import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/syllabus/tasks")
@CrossOrigin(origins = "*")
public class SyllabusApprovalController {

    private final TaskService taskService;
    private final HistoryService historyService;

    public SyllabusApprovalController(TaskService taskService, HistoryService historyService) {
        this.taskService = taskService;
        this.historyService = historyService;
    }

    @GetMapping
    public List<Map<String, Object>> getTasksByRoleAndStatus(
            @RequestParam String role,
            @RequestParam String status) {

        String roleUpper = role.toUpperCase();

        if (status.equalsIgnoreCase("completed")) {
            List<HistoricTaskInstance> historicTasks = historyService.createHistoricTaskInstanceQuery()
                    .taskDefinitionKey(getTaskKeyByRole(roleUpper))
                    .finished()
                    .list();

            return historicTasks.stream().map(this::mapHistoricTaskToMap).collect(Collectors.toList());

        } else if (status.equalsIgnoreCase("fix")) {
            List<Task> fixTasks = taskService.createTaskQuery()
                    .taskDefinitionKey("Task_FixSyllabus")
                    .active()
                    .list();

            return fixTasks.stream().map(this::mapTaskToMap).collect(Collectors.toList());

        } else {
            // Если роль — одна из ролей деканата, ищем по группе DEANERY (или как в вашем BPMN)
            String searchGroup = (roleUpper.equals("ACADEMIC_DEPARTMENT") || roleUpper.equals("DEANERY"))
                    ? "DEANERY"
                    : roleUpper;

            List<Task> activeTasks = taskService.createTaskQuery()
                    .taskCandidateGroup(searchGroup)
                    .active()
                    .list();

            return activeTasks.stream().map(this::mapTaskToMap).collect(Collectors.toList());
        }
    }

    private Map<String, Object> mapTaskToMap(Task task) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", task.getId());
        map.put("name", task.getName() != null ? task.getName() : "");
        map.put("taskDefinitionKey", task.getTaskDefinitionKey() != null ? task.getTaskDefinitionKey() : "");
        map.put("processInstanceId", task.getProcessInstanceId() != null ? task.getProcessInstanceId() : "");
        map.put("syllabusId", getSyllabusId(task.getId()));
        map.put("createTime", task.getCreateTime() != null ? task.getCreateTime().toString() : "");
        return map;
    }

    private Map<String, Object> mapHistoricTaskToMap(HistoricTaskInstance task) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", task.getId());
        map.put("name", task.getName() != null ? task.getName() : "");
        map.put("taskDefinitionKey", task.getTaskDefinitionKey() != null ? task.getTaskDefinitionKey() : "");
        map.put("processInstanceId", task.getProcessInstanceId() != null ? task.getProcessInstanceId() : "");
        map.put("syllabusId", "");
        map.put("endTime", task.getEndTime() != null ? task.getEndTime().toString() : "");
        return map;
    }

    private String getSyllabusId(String taskId) {
        try {
            Object val = taskService.getVariable(taskId, "syllabusId");
            return val != null ? val.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    private String getTaskKeyByRole(String role) {
        return switch (role) {
            case "LIBRARIAN" -> "Task_Librarian";
            case "METHODOLOGIST" -> "Task_Academic"; // Если в BPMN это имя задачи
            case "ACADEMIC_DEPARTMENT", "DEANERY" -> "Task_Deanery";
            case "TEACHER" -> "Task_FixSyllabus";
            default -> "Task_FixSyllabus";
        };
    }
}