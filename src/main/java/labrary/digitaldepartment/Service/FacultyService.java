package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Faculty;
import labrary.digitaldepartment.Repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public List<Faculty> findAll() {
        return facultyRepository.findAll();
    }

    public Faculty findById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + id));
    }

    @Transactional
    public Faculty save(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    @Transactional
    public void delete(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Faculty not found");
        }
        facultyRepository.deleteById(id);
    }
}