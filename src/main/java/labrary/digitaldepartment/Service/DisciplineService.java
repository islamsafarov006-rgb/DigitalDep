package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Discipline;
import labrary.digitaldepartment.Repository.DisciplineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplineService {

    private final DisciplineRepository disciplineRepository;

    public List<Discipline> findAll() {
        return disciplineRepository.findAll();
    }

    public Discipline findById(Long id) {
        return disciplineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discipline not found with id: " + id));
    }


    public Discipline findByCourseCode(String code) {
        return disciplineRepository.findByCourseCode(code)
                .orElseThrow(() -> new RuntimeException("Discipline not found with code: " + code));
    }


    public List<Discipline> findByDepartment(Long departmentId) {
        return disciplineRepository.findByDepartmentId(departmentId);
    }

    @Transactional
    public Discipline save(Discipline discipline) {
        return disciplineRepository.save(discipline);
    }

    @Transactional
    public void delete(Long id) {
        disciplineRepository.deleteById(id);
    }
}