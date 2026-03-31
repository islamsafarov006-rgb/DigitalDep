package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.GradingPolicy;
import labrary.digitaldepartment.Service.GradingPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grading-policies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GradingPolicyController {

    private final GradingPolicyService service;

    @PostMapping
    public ResponseEntity<GradingPolicy> save(@RequestBody GradingPolicy policy) {
        return ResponseEntity.ok(service.saveOrUpdate(policy));
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<GradingPolicy> getByDocument(@PathVariable Long documentId) {
        return service.getByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}