package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Department;
import labrary.digitaldepartment.Entity.Discipline;
import labrary.digitaldepartment.Repository.DepartmentRepository;
import labrary.digitaldepartment.Repository.DisciplineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor // Lombok автоматически соберет конструктор для disciplineRepository и departmentRepository
public class DisciplineService {

    private final DisciplineRepository disciplineRepository;
    private final DepartmentRepository departmentRepository; // Добавили репозиторий для проверки кафедры

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
        // Проверяем, пришел ли объект кафедры с фронтенда
        if (discipline.getDepartment() != null && discipline.getDepartment().getId() != null) {
            Long deptId = discipline.getDepartment().getId();

            // Достаем управляемую (managed) сущность из БД по ID (в твоем случае ID = 1)
            Department managedDepartment = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + deptId));

            // Привязываем её к сохраняемой дисциплине
            discipline.setDepartment(managedDepartment);
        } else {
            throw new IllegalArgumentException("Дисциплина должна быть обязательно привязана к кафедре (department.id)!");
        }

        // Теперь Hibernate корректно подставит foreign key и не упадет с ошибкой констреинта
        return disciplineRepository.save(discipline);
    }

    @Transactional
    public void delete(Long id) {
        if (!disciplineRepository.existsById(id)) {
            throw new RuntimeException("Discipline not found with id: " + id);
        }
        disciplineRepository.deleteById(id);
    }
}