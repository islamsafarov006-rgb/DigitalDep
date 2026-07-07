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
            List<HistoricTaskInstance> historicTasks = historyService
                    .createHistoricTaskInstanceQuery()
                    .taskDefinitionKey(getTaskKeyByRole(roleUpper))
                    .finished()
                    .list();

            return historicTasks.stream()
                    .map(this::mapHistoricTaskToMap)
                    .collect(Collectors.toList());

        } else if (status.equalsIgnoreCase("fix")) {
            List<Task> fixTasks = taskService.createTaskQuery()
                    .taskDefinitionKey("Task_FixSyllabus")
                    .active()
                    .list();

            return fixTasks.stream()
                    .map(this::mapTaskToMap)
                    .collect(Collectors.toList());

        } else {
            // active — ищем по candidateGroup
            String searchGroup = mapRoleToGroup(roleUpper);

            List<Task> activeTasks = taskService.createTaskQuery()
                    .taskCandidateGroup(searchGroup)
                    .active()
                    .list();

            return activeTasks.stream()
                    .map(this::mapTaskToMap)
                    .collect(Collectors.toList());
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Маппинг активной задачи → Map
    // ─────────────────────────────────────────────────────────────────

    private Map<String, Object> mapTaskToMap(Task task) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",                task.getId());
        map.put("name",              nvl(task.getName()));
        map.put("taskDefinitionKey", nvl(task.getTaskDefinitionKey()));
        map.put("processInstanceId", nvl(task.getProcessInstanceId()));
        map.put("assignee",          task.getAssignee() != null ? task.getAssignee() : "");
        map.put("createTime",        task.getCreateTime() != null ? task.getCreateTime().toString() : "");
        map.put("syllabusId",        getSyllabusIdFromTask(task.getId()));

        // 🌟 Добавляем название дисциплины и имя преподавателя напрямую в корень объекта таски
        map.put("disciplineName",    getVariableFromTask(task.getId(), "disciplineName"));
        map.put("teacherName",       getVariableFromTask(task.getId(), "teacherName"));

        return map;
    }

    // ─────────────────────────────────────────────────────────────────
    // Маппинг завершённой задачи → Map
    // ─────────────────────────────────────────────────────────────────

    private Map<String, Object> mapHistoricTaskToMap(HistoricTaskInstance task) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",                task.getId());
        map.put("name",              nvl(task.getName()));
        map.put("taskDefinitionKey", nvl(task.getTaskDefinitionKey()));
        map.put("processInstanceId", nvl(task.getProcessInstanceId()));
        map.put("assignee",          task.getAssignee() != null ? task.getAssignee() : "");
        map.put("createTime",        task.getStartTime() != null ? task.getStartTime().toString() : "");
        map.put("endTime",           task.getEndTime()   != null ? task.getEndTime().toString()   : "");
        map.put("syllabusId",        getSyllabusIdFromProcess(task.getProcessInstanceId()));

        // 🌟 Добавляем переменные из истории для завершенных вкладок
        map.put("disciplineName",    getHistoricVariableFromProcess(task.getProcessInstanceId(), "disciplineName"));
        map.put("teacherName",       getHistoricVariableFromProcess(task.getProcessInstanceId(), "teacherName"));

        return map;
    }

    // ─────────────────────────────────────────────────────────────────
    // Вспомогательные методы
    // ─────────────────────────────────────────────────────────────────

    private String getSyllabusIdFromTask(String taskId) {
        return getVariableFromTask(taskId, "syllabusId");
    }

    // Универсальный хелпер для получения переменных активной задачи
    private String getVariableFromTask(String taskId, String variableName) {
        try {
            Object val = taskService.getVariable(taskId, variableName);
            return val != null ? val.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    private String getSyllabusIdFromProcess(String processInstanceId) {
        return getHistoricVariableFromProcess(processInstanceId, "syllabusId");
    }

    // Универсальный хелпер для получения переменных из истории процесса
    private String getHistoricVariableFromProcess(String processInstanceId, String variableName) {
        try {
            var variable = historyService
                    .createHistoricVariableInstanceQuery()
                    .processInstanceId(processInstanceId)
                    .variableName(variableName)
                    .singleResult();
            return variable != null && variable.getValue() != null
                    ? variable.getValue().toString()
                    : "";
        } catch (Exception e) {
            return "";
        }
    }

    private String mapRoleToGroup(String role) {
        return switch (role) {
            case "DEANERY"             -> "DEANERY";
            case "ACADEMIC_DEPARTMENT" -> "ACADEMIC_DEPARTMENT";
            default                    -> role; // LIBRARIAN, METHODOLOGIST
        };
    }

    private String getTaskKeyByRole(String role) {
        return switch (role) {
            case "LIBRARIAN"           -> "Task_Librarian";
            case "METHODOLOGIST"       -> "Task_Academic";
            case "DEANERY"             -> "Task_Deanery";
            case "ACADEMIC_DEPARTMENT" -> "Task_HeadOfDepartment";
            case "TEACHER"             -> "Task_FixSyllabus";
            default                    -> "Task_FixSyllabus";
        };
    }

    private String nvl(String val) {
        return val != null ? val : "";
    }
}