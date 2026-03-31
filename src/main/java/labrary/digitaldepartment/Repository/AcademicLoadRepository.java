package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.AcademicLoad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicLoadRepository extends JpaRepository<AcademicLoad, Long> {
}