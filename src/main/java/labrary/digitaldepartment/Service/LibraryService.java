package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Library;
import labrary.digitaldepartment.Repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LibraryService {

    private final LibraryRepository libraryRepository;

    public LibraryService(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    public List<Library> findAll() {
        return libraryRepository.findAll();
    }

    public Library findById(Long id) {
        return libraryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found in library with id: " + id));
    }

    public List<Library> search(String query) {
        return libraryRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
    }

    @Transactional
    public Library save(Library library) {
        return libraryRepository.save(library);
    }

    @Transactional
    public void delete(Long id) {
        libraryRepository.deleteById(id);
    }
}