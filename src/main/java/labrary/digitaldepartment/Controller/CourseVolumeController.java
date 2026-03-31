package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.CourseVolume;
import labrary.digitaldepartment.Service.CourseValueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course/value")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseVolumeController {

    private final CourseValueService courseValueService;

    @GetMapping("/all")
    public List<CourseVolume> listAll() {
        return courseValueService.getAll();
    }

    @PostMapping
    public ResponseEntity<CourseVolume> saveVolume(@RequestBody CourseVolume volume) {
        return ResponseEntity.ok(courseValueService.saveOrUpdate(volume));
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<CourseVolume> getByDocument(@PathVariable Long documentId) {
        return courseValueService.getByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}