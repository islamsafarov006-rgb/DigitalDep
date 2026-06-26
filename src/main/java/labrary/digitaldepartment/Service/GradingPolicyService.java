package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.DTO.GradingPolicyDto;
import labrary.digitaldepartment.Entity.GradingPolicy;
import labrary.digitaldepartment.Entity.Syllabus;
import labrary.digitaldepartment.Repository.GradingPolicyRepository;
import labrary.digitaldepartment.Repository.SyllabusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradingPolicyService {

    private final GradingPolicyRepository repository;
    private final SyllabusRepository syllabusRepository;

    // ── Получить таблицу оценивания по syllabusId ──────────────────

    @Transactional(readOnly = true)
    public List<GradingPolicyDto> getBySyllabusId(Long syllabusId) {
        return repository.findBySyllabusIdOrderBySortOrderAsc(syllabusId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ── Сохранить / обновить таблицу оценивания ────────────────────

    @Transactional
    public List<GradingPolicyDto> saveAll(Long syllabusId, List<GradingPolicyDto> dtos) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus not found: " + syllabusId));

        // Удаляем старые строки и вставляем новые
        repository.deleteBySyllabusId(syllabusId);
        repository.flush();

        // Пересчитываем sortOrder и валидируем суммы
        validateWeights(dtos);

        List<GradingPolicy> entities = dtos.stream()
                .map(dto -> toEntity(dto, syllabus))
                .collect(Collectors.toList());

        return repository.saveAll(entities)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ── Дефолтная таблица (Option 1 из шаблона) ───────────────────

    public List<GradingPolicyDto> buildDefault() {
        return List.of(
                // 1st attestation
                row(1,  "1st attestation", "Practical lessons:", false, true,  25,  100),
                row(2,  "1st attestation", "Exercise 1",         true,  false, 5,   null),
                row(3,  "1st attestation", "Exercise 2",         true,  false, 5,   null),
                row(4,  "1st attestation", "Exercise 3",         true,  false, 5,   null),
                row(5,  "1st attestation", "Exercise 4",         true,  false, 5,   null),
                row(6,  "1st attestation", "Exercise 5",         true,  false, 5,   null),
                row(7,  "1st attestation", "Mid-term",           false, true,  25,  null),
                row(8,  "1st attestation", "SIS assignments",    false, true,  25,  null),
                row(9,  "1st attestation", "Attendance",         false, true,  25,  null),
                // 2nd attestation
                row(10, "2nd attestation", "Laboratory works:",  false, true,  35,  100),
                row(11, "2nd attestation", "Lab work 1",         true,  false, 7,   null),
                row(12, "2nd attestation", "Lab work 2",         true,  false, 7,   null),
                row(13, "2nd attestation", "Lab work 3",         true,  false, 7,   null),
                row(14, "2nd attestation", "Lab work 4",         true,  false, 7,   null),
                row(15, "2nd attestation", "Lab work 5",         true,  false, 7,   null),
                row(16, "2nd attestation", "Practical lessons:", false, true,  25,  null),
                row(17, "2nd attestation", "Exercise 1",         true,  false, 5,   null),
                row(18, "2nd attestation", "Exercise 2",         true,  false, 5,   null),
                row(19, "2nd attestation", "Exercise 3",         true,  false, 5,   null),
                row(20, "2nd attestation", "Exercise 4",         true,  false, 5,   null),
                row(21, "2nd attestation", "Exercise 5",         true,  false, 5,   null),
                row(22, "2nd attestation", "End-of-term",        false, true,  25,  null),
                row(23, "2nd attestation", "SIS assignments",    false, true,  15,  null),
                // Exam
                row(24, "Exam",  "Exam",                         false, true,  null, 100),
                // Total
                row(25, "Total", "0,3*1stAtt+0,3*2ndAtt+0,4*Final", false, false, null, null)
        );
    }

    // ── Вспомогательные методы ─────────────────────────────────────

    private void validateWeights(List<GradingPolicyDto> dtos) {
        // Проверяем что сумма Total строк по 1st attestation = 100
        int first = dtos.stream()
                .filter(d -> "1st attestation".equals(d.getPeriod()) && !d.isSubItem())
                .mapToInt(d -> d.getScore() != null ? d.getScore() : 0)
                .sum();
        int second = dtos.stream()
                .filter(d -> "2nd attestation".equals(d.getPeriod()) && !d.isSubItem())
                .mapToInt(d -> d.getScore() != null ? d.getScore() : 0)
                .sum();

        if (first != 100) System.out.println("Warning: 1st attestation sum = " + first + " (expected 100)");
        if (second != 100) System.out.println("Warning: 2nd attestation sum = " + second + " (expected 100)");
    }

    private GradingPolicyDto row(int order, String period, String name,
                                 boolean sub, boolean bold,
                                 Integer score, Integer total) {
        GradingPolicyDto dto = new GradingPolicyDto();
        dto.setSortOrder(order);
        dto.setPeriod(period);
        dto.setAssignmentName(name);
        dto.setSubItem(sub);
        dto.setBold(bold);
        dto.setScore(score);
        dto.setTotal(total);
        return dto;
    }

    private GradingPolicyDto toDto(GradingPolicy e) {
        GradingPolicyDto dto = new GradingPolicyDto();
        dto.setId(e.getId());
        dto.setPeriod(e.getPeriod());
        dto.setAssignmentName(e.getAssignmentName());
        dto.setSubItem(e.isSubItem());
        dto.setBold(e.isBold());
        dto.setScore(e.getScore());
        dto.setTotal(e.getTotal());
        dto.setSortOrder(e.getSortOrder());
        return dto;
    }

    private GradingPolicy toEntity(GradingPolicyDto dto, Syllabus syllabus) {
        GradingPolicy e = new GradingPolicy();
        e.setSyllabus(syllabus);
        e.setPeriod(dto.getPeriod());
        e.setAssignmentName(dto.getAssignmentName());
        e.setSubItem(dto.isSubItem());
        e.setBold(dto.isBold());
        e.setScore(dto.getScore());
        e.setTotal(dto.getTotal());
        e.setSortOrder(dto.getSortOrder());
        return e;
    }
}