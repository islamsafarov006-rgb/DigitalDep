package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.Library;
import labrary.digitaldepartment.Service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    public List<Library> getAll() {
        return libraryService.findAll();
    }

    @GetMapping("/search")
    public List<Library> search(@RequestParam(name = "q") String query) {
        return libraryService.search(query);
    }

    @PostMapping
    public ResponseEntity<Library> create(@RequestBody Library library) {
        return new ResponseEntity<>(libraryService.save(library), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        libraryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}