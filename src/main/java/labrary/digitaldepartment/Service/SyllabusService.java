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
public class SyllabusService {

    private final SyllabusRepository repository;
    private final GradingPolicyRepository gradingPolicyRepository;

    public List<Syllabus> getAll() {
        return repository.findAll();
    }

    public Syllabus getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));
    }

    public Syllabus save(Syllabus syllabus) {
        return repository.save(syllabus);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }


    @Transactional(readOnly = true)
    public List<GradingPolicyDto> getGradingPolicy(Long syllabusId) {
        return gradingPolicyRepository
                .findBySyllabusIdOrderBySortOrderAsc(syllabusId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<GradingPolicyDto> saveGradingPolicy(Long syllabusId,
                                                    List<GradingPolicyDto> dtos) {
        Syllabus syllabus = getById(syllabusId);

        gradingPolicyRepository.deleteBySyllabusId(syllabusId);
        gradingPolicyRepository.flush();

        List<GradingPolicy> entities = dtos.stream()
                .map(dto -> toEntity(dto, syllabus))
                .collect(Collectors.toList());

        return gradingPolicyRepository.saveAll(entities)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    public List<GradingPolicyDto> buildDefaultGradingPolicy() {
        return List.of(
                // 1st attestation
                row(1,  "1st attestation", "Practical lessons:",    false, true,  25,  100),
                row(2,  "1st attestation", "Exercise 1",            true,  false, 5,   null),
                row(3,  "1st attestation", "Exercise 2",            true,  false, 5,   null),
                row(4,  "1st attestation", "Exercise 3",            true,  false, 5,   null),
                row(5,  "1st attestation", "Exercise 4",            true,  false, 5,   null),
                row(6,  "1st attestation", "Exercise 5",            true,  false, 5,   null),
                row(7,  "1st attestation", "Mid-term",              false, true,  25,  null),
                row(8,  "1st attestation", "SIS assignments",       false, true,  25,  null),
                row(9,  "1st attestation", "Attendance",            false, true,  25,  null),
                row(10, "2nd attestation", "Laboratory works:",     false, true,  35,  100),
                row(11, "2nd attestation", "Lab work 1",            true,  false, 7,   null),
                row(12, "2nd attestation", "Lab work 2",            true,  false, 7,   null),
                row(13, "2nd attestation", "Lab work 3",            true,  false, 7,   null),
                row(14, "2nd attestation", "Lab work 4",            true,  false, 7,   null),
                row(15, "2nd attestation", "Lab work 5",            true,  false, 7,   null),
                row(16, "2nd attestation", "Practical lessons:",    false, true,  25,  null),
                row(17, "2nd attestation", "Exercise 1",            true,  false, 5,   null),
                row(18, "2nd attestation", "Exercise 2",            true,  false, 5,   null),
                row(19, "2nd attestation", "Exercise 3",            true,  false, 5,   null),
                row(20, "2nd attestation", "Exercise 4",            true,  false, 5,   null),
                row(21, "2nd attestation", "Exercise 5",            true,  false, 5,   null),
                row(22, "2nd attestation", "End-of-term",           false, true,  25,  null),
                row(23, "2nd attestation", "SIS assignments",       false, true,  15,  null),
                row(24, "Exam",            "Exam",                  false, true,  null, 100),
                row(25, "Total",           "0,3*1stAtt+0,3*2ndAtt+0,4*Final", false, false, null, null)
        );
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