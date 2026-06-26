package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grading_policy", schema = "business")
public class GradingPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assignmentName;

    // 🌟 Переименовали: убрали префикс 'is'
    // Lombok сгенерирует геттер getBold() (или isBold() для примитива) и сеттер setBold()
    @Column(name = "is_bold")
    private Boolean bold;

    @Column(name = "is_sub_item")
    private Boolean subItem;

    private String period;
    private Integer score;
    private Integer sortOrder;
    private Integer total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syllabus_id", nullable = false)
    @JsonBackReference
    private Syllabus syllabus;

    // 🌟 Добавляем кастомные геттеры "is..." вручную ради совместимости с вашими сервисами,
    // чтобы компилятор сразу успокоился во всех SyllabusService и SyllabusGeneratorService
    public Boolean isBold() {
        return this.bold;
    }

    public Boolean isSubItem() {
        return this.subItem;
    }
}