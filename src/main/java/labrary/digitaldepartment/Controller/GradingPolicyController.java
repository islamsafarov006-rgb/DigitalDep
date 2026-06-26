package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.DTO.GradingPolicyDto;
import labrary.digitaldepartment.Service.GradingPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grading-policies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GradingPolicyController {

    private final GradingPolicyService service;

    // GET /api/grading-policies/syllabus/{syllabusId}
    @GetMapping("/syllabus/{syllabusId}")
    public ResponseEntity<List<GradingPolicyDto>> getBySyllabus(@PathVariable Long syllabusId) {
        List<GradingPolicyDto> policy = service.getBySyllabusId(syllabusId);

        // Если ещё не заполнено — возвращаем дефолтную таблицу
        if (policy == null || policy.isEmpty()) {
            policy = service.buildDefault();
        }

        return ResponseEntity.ok(policy);
    }

    // POST /api/grading-policies/syllabus/{syllabusId}
    @PostMapping("/syllabus/{syllabusId}")
    public ResponseEntity<List<GradingPolicyDto>> saveBySyllabus(
            @PathVariable Long syllabusId,
            @RequestBody List<GradingPolicyDto> rows) {
        return ResponseEntity.ok(service.saveAll(syllabusId, rows));
    }
}