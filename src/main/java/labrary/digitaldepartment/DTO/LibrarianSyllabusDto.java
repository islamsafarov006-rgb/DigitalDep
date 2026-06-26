package labrary.digitaldepartment.DTO;

import lombok.Data;
import java.util.List;
import labrary.digitaldepartment.Entity.Library;

@Data
public class LibrarianSyllabusDto {
    private Long id;
    private String academicProgramTitle; // Название программы, чтобы понимать контекст
    private List<Library> literature;   // ТОЛЬКО список литературы
}