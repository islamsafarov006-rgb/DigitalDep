package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.Discipline;
import labrary.digitaldepartment.Entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisciplineRepository extends JpaRepository<Discipline, Long> {
    List<Discipline> findByDepartmentId(Long departmentId);
    Optional<Discipline> findByCourseCode(String courseCode);


}