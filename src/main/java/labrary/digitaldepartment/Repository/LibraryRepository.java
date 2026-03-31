package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Long> {
    List<Library> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);
}