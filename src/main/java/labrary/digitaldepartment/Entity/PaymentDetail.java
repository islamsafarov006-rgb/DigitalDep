package labrary.digitaldepartment.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "payment_details")
@Getter
@Setter
public class PaymentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String position;
    private String paymentType;
    private Integer hoursCount;
    @Column(name = "staff_load")
    private BigDecimal staffLoad;

    @Column(name = "hourly_load")
    private BigDecimal hourlyLoad;

    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;
}

