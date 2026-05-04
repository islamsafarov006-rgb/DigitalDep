package labrary.digitaldepartment.Controller;

import labrary.digitaldepartment.DTO.LoginRequest;
import labrary.digitaldepartment.Entity.User;
import labrary.digitaldepartment.Enums.UserRole;
import labrary.digitaldepartment.Service.JwtService;
import labrary.digitaldepartment.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {

            user.setPassword(passwordEncoder.encode(user.getPassword()));

            if (user.getRole() == null) user.setRole(UserRole.TEACHER);

            User savedUser = userService.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка при регистрации: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String cleanIin = loginRequest.getIin().trim();

        return userService.findByIin(cleanIin)
                .map(user -> {
                    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный пароль");
                    }

                    java.util.Map<String, Object> claims = new java.util.HashMap<>();
                    claims.put("fio", user.getFullName());
                    claims.put("email", user.getEmail());
                    claims.put("position", user.getPosition());
                    claims.put("role", user.getRole().name());

                    if (user.getDepartment() != null) {
                        claims.put("department", user.getDepartment().getNameEn());
                    }

                    String token = jwtService.generateToken(user.getIin(), claims);
                    return ResponseEntity.ok(token);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь не найден"));
    }
}