package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.Discipline;
import labrary.digitaldepartment.Service.DisciplineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplines")
@CrossOrigin(origins = "*")
public class DisciplineController {

    private final DisciplineService disciplineService;

    public DisciplineController(DisciplineService disciplineService) {
        this.disciplineService = disciplineService;
    }

    @GetMapping
    public List<Discipline> getAll() {
        return disciplineService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discipline> getById(@PathVariable Long id) {
        return ResponseEntity.ok(disciplineService.findById(id));
    }

    @GetMapping("/department/{departmentId}")
    public List<Discipline> getByDepartment(@PathVariable Long departmentId) {
        return disciplineService.findByDepartment(departmentId);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Discipline> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(disciplineService.findByCourseCode(code));
    }

    @PostMapping
    public ResponseEntity<Discipline> save(@RequestBody Discipline discipline) {
        return new ResponseEntity<>(disciplineService.save(discipline), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        disciplineService.delete(id);
        return ResponseEntity.noContent().build();
    }
}