package labrary.digitaldepartment.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "library")
public class Library {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String isbn;

    @Column(columnDefinition = "TEXT")
    private String url;
}