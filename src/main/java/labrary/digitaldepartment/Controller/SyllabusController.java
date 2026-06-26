package labrary.digitaldepartment.Controller;

import jakarta.transaction.Transactional;
import labrary.digitaldepartment.DTO.AcademicDepartmentSyllabusDto;
import labrary.digitaldepartment.DTO.GradingPolicyDto;
import labrary.digitaldepartment.DTO.LibrarianSyllabusDto;
import labrary.digitaldepartment.Entity.Syllabus;
import labrary.digitaldepartment.Service.SyllabusService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/syllabus")
@RequiredArgsConstructor
@Transactional
public class SyllabusController {

    private final SyllabusService service;
    private final RuntimeService runtimeService;

    @GetMapping
    public List<Syllabus> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Syllabus getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Syllabus create(@RequestBody Syllabus syllabus) {
        return service.save(syllabus);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    public Syllabus update(@PathVariable Long id, @RequestBody Syllabus syllabus) {
        syllabus.setId(id);
        return service.save(syllabus);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Map<String, String>> submitToApproval(@PathVariable Long id) {
        Syllabus syllabus = service.getById(id);

        Map<String, Object> variables = new HashMap<>();
        variables.put("syllabusId", syllabus.getId());
        variables.put("academicProgramTitle", syllabus.getAcademicProgramTitle());
        variables.put("status", "UNDER_REVIEW");
        variables.put("isApproved", false);

        runtimeService.startProcessInstanceByKey(
                "syllabus-approval-process",
                String.valueOf(id),
                variables
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "Силлабус успешно отправлен на согласование");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/for-librarian")
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<labrary.digitaldepartment.DTO.LibrarianSyllabusDto> getForLibrarian(@PathVariable Long id) {
        Syllabus syllabus = service.getById(id);

        labrary.digitaldepartment.DTO.LibrarianSyllabusDto dto = new labrary.digitaldepartment.DTO.LibrarianSyllabusDto();
        dto.setId(syllabus.getId());
        dto.setAcademicProgramTitle(syllabus.getAcademicProgramTitle());
        dto.setLiterature(syllabus.getLiterature()); // Отдаем только литературу

        return ResponseEntity.ok(dto);
    }


    @GetMapping("/{id}/for-academic")
    @PreAuthorize("hasRole('METHODOLOGIST') or hasRole('ADMIN')")
    public ResponseEntity<labrary.digitaldepartment.DTO.AcademicDepartmentSyllabusDto> getForAcademic(@PathVariable Long id) {
        Syllabus syllabus = service.getById(id);

        labrary.digitaldepartment.DTO.AcademicDepartmentSyllabusDto dto = new labrary.digitaldepartment.DTO.AcademicDepartmentSyllabusDto();
        dto.setId(syllabus.getId());
        dto.setAcademicProgramCode(syllabus.getAcademicProgramCode());
        dto.setAcademicProgramTitle(syllabus.getAcademicProgramTitle());
        dto.setCourseCycle(syllabus.getCourseCycle());
        dto.setFinalAssessment(syllabus.getFinalAssessment());
        dto.setNumberOfCredits(syllabus.getNumberOfCredits());
        dto.setGroupOfAcademicPrograms(syllabus.getGroupOfAcademicPrograms()); // Без литературы и описания

        return ResponseEntity.ok(dto);
    }
    // Добавить в SyllabusController.java (или создать новый)

    @GetMapping("/{id}/grading-policy")
    public ResponseEntity<List<GradingPolicyDto>> getGradingPolicy(@PathVariable Long id) {
        List<GradingPolicyDto> policy = service.getGradingPolicy(id);
        // Если ещё не заполнено — возвращаем дефолт
        if (policy == null || policy.isEmpty()) {
            policy = service.buildDefaultGradingPolicy();
        }
        return ResponseEntity.ok(policy);
    }

    @PostMapping("/{id}/grading-policy")
    public ResponseEntity<List<GradingPolicyDto>> saveGradingPolicy(
            @PathVariable Long id,
            @RequestBody List<GradingPolicyDto> rows) {
        return ResponseEntity.ok(service.saveGradingPolicy(id, rows));
    }
}