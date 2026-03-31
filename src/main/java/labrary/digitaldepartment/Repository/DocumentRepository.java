package labrary.digitaldepartment.Repository;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Enums.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAllByAuthorEmail(String email);
    List<Document> findAllByAuthorId(Long authorId);
}