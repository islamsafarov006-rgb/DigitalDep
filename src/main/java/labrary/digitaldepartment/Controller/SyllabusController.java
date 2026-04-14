package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.Syllabus;
import labrary.digitaldepartment.Service.SyllabusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/syllabus")
@RequiredArgsConstructor
public class SyllabusController {

    private final SyllabusService service;

    @GetMapping
    public List<Syllabus> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Syllabus getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Syllabus create(@RequestBody Syllabus syllabus) {
        return service.save(syllabus);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}