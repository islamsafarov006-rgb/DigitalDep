package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.Entity.User;
import labrary.digitaldepartment.Enums.UserRole; // Не забудь импорт твоего Enum ролей
import labrary.digitaldepartment.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Не забудь импорт для защиты
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // 🌟 НОВЫЙ МЕТОД: Именно его запрашивает твой Angular компонент распределения часов
    @GetMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN')") // Доступ только для администратора кафедры
    public ResponseEntity<List<User>> getAllTeachers() {
        List<User> teachers = userService.findAll().stream()
                .filter(user -> user.getRole() == UserRole.TEACHER)
                .collect(Collectors.toList());
        return ResponseEntity.ok(teachers);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Список вообще всех пользователей тоже лучше прикрыть
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<User> getByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{deptId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<User> getByDepartment(@PathVariable Long deptId) {
        return userService.findByDepartment(deptId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> create(@RequestBody User user) {
        return new ResponseEntity<>(userService.save(user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return ResponseEntity.ok(userService.save(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}