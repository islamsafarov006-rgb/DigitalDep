package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.DTO.CamundaTaskDto;
import labrary.digitaldepartment.Enums.UserRole;
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

    @PostMapping("/start")
    public ResponseEntity<String> startProcess(
            @RequestParam String syllabusId,
            @RequestParam String initiator) {
        processService.startSyllabusProcess(syllabusId, initiator);
        return ResponseEntity.ok("Process started successfully");
    }

    @GetMapping("/tasks/role/{role}")
    public ResponseEntity<List<CamundaTaskDto>> getRoleTasks(@PathVariable UserRole role) {
        return ResponseEntity.ok(processService.getTasksForRole(role));
    }

    @GetMapping("/tasks/teacher/{teacherName}")
    public ResponseEntity<List<CamundaTaskDto>> getTeacherTasks(@PathVariable String teacherName) {
        return ResponseEntity.ok(processService.getFixTasksForTeacher(teacherName));
    }

    /**
     * ИСПРАВЛЕНО: порядок параметров теперь совпадает с сигнатурой сервиса:
     * completeReviewTask(taskId, variableName, isApproved, approverName, comment)
     */
    @PostMapping("/tasks/{taskId}/review")
    public ResponseEntity<String> reviewTask(
            @PathVariable String taskId,
            @RequestParam String variableName,
            @RequestParam boolean isApproved,
            @RequestParam String reviewerId,   // → approverName в сервисе
            @RequestParam(defaultValue = "") String comment) {

        processService.completeReviewTask(taskId, variableName, isApproved, reviewerId, comment);
        return ResponseEntity.ok("Review submitted successfully");
    }

    @PostMapping("/tasks/{taskId}/fix-complete")
    public ResponseEntity<String> completeFix(@PathVariable String taskId) {
        processService.completeTeacherFixTask(taskId);
        return ResponseEntity.ok("Syllabus sent back to review pipeline");
    }
}