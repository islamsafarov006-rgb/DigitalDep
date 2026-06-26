package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.DTO.CamundaTaskDto;
import labrary.digitaldepartment.Enums.UserRole; // Импортируем твой Enum
import labrary.digitaldepartment.Service.SyllabusProcessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/syllabus-process")
@CrossOrigin(origins = "*")
public class SyllabusProcessController {

    private final SyllabusProcessService processService;

    public SyllabusProcessController(SyllabusProcessService processService) {
        this.processService = processService;
    }

    /**
     * Запуск процесса Camunda для силлабуса
     */
    @PostMapping("/start")
    public ResponseEntity<String> startProcess(@RequestParam String syllabusId, @RequestParam String initiator) {
        processService.startSyllabusProcess(syllabusId, initiator);
        return ResponseEntity.ok("Process started successfully");
    }

    /**
     * ИСПРАВЛЕНО: Получение списка задач по роли из Enum (Методолог, Библиотекарь, Декан)
     * URL теперь выглядит так: /api/v1/syllabus-process/tasks/role/METHODOLOGIST
     */
    @GetMapping("/tasks/role/{role}")
    public ResponseEntity<List<CamundaTaskDto>> getRoleTasks(@PathVariable UserRole role) {
        return ResponseEntity.ok(processService.getTasksForRole(role));
    }

    /**
     * Получение персональных задач доработки для конкретного преподавателя
     */
    @GetMapping("/tasks/teacher/{teacherName}")
    public ResponseEntity<List<CamundaTaskDto>> getTeacherTasks(@PathVariable String teacherName) {
        return ResponseEntity.ok(processService.getFixTasksForTeacher(teacherName));
    }

    /**
     * Вынесение решения по задаче проверки (Одобрено / Отклонено)
     */
    @PostMapping("/tasks/{taskId}/review")
    public ResponseEntity<String> reviewTask(@PathVariable String taskId,
                                             @RequestParam String variableName,
                                             @RequestParam boolean isApproved,
                                             @RequestParam String comment,     // Added
                                             @RequestParam String reviewerId) { // Added

        // Pass all 5 required parameters
        processService.completeReviewTask(taskId, variableName, isApproved, comment, reviewerId);

        return ResponseEntity.ok("Review submitted successfully");
    }

    /**
     * Завершение таски исправления преподавателем
     */
    @PostMapping("/tasks/{taskId}/fix-complete")
    public ResponseEntity<String> completeFix(@PathVariable String taskId) {
        processService.completeTeacherFixTask(taskId);
        return ResponseEntity.ok("Syllabus sent back to review pipeline");
    }
}