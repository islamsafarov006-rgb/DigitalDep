package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Syllabus;
import labrary.digitaldepartment.Repository.SyllabusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SyllabusService {

    private final SyllabusRepository repository;

    public List<Syllabus> getAll() {
        return repository.findAll();
    }

    public Syllabus getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Syllabus not found"));
    }

    public Syllabus save(Syllabus syllabus) {
        return repository.save(syllabus);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}