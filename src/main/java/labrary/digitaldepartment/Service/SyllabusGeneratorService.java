package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.Document;
import labrary.digitaldepartment.Entity.Syllabus;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SyllabusGeneratorService {

    public byte[] generateSyllabus(Document document) throws Exception {
        // Используем try-with-resources для автоматического закрытия потоков
        try (InputStream is = getClass().getResourceAsStream("/templates/syllabus_tamplate.docx")) {
            if (is == null) {
                throw new RuntimeException("Шаблон syllabus_tamplate.docx не найден");
            }

            try (XWPFDocument doc = new XWPFDocument(is)) {
                Map<String, String> data = prepareData(document);

                // 1. Обработка всех абзацев документа
                doc.getParagraphs().forEach(p -> replacePlaceholders(p, data));

                // 2. Обработка всех таблиц (включая вложенные ячейки)
                for (XWPFTable table : doc.getTables()) {
                    for (XWPFTableRow row : table.getRows()) {
                        for (XWPFTableCell cell : row.getTableCells()) {
                            cell.getParagraphs().forEach(p -> replacePlaceholders(p, data));
                        }
                    }
                }

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                doc.write(out);
                return out.toByteArray();
            }
        }
    }

    private Map<String, String> prepareData(Document doc) {
        Map<String, String> data = new HashMap<>();

        // Исправленная логика согласно твоему JSON: Document -> Author -> Department
        // Если кафедра привязана к дисциплине — оставь свой вариант,
        // но чаще в таких системах она привязана к автору.
        var author = doc.getAuthor();
        var dept = (author != null) ? author.getDepartment() : null;
        var faculty = (dept != null) ? dept.getFaculty() : null;

        data.put("{{facultyNameEn}}", faculty != null ? faculty.getNameEn() : "Not specified");
        data.put("{{departmentNameEn}}", dept != null ? dept.getNameEn() : "Not specified");

        // Данные силлабуса
        Syllabus syllabus = doc.getSyllabus();
        if (syllabus != null) {
            data.put("{{courseCode}}", nvl(syllabus.getAcademicProgramCode()));
            data.put("{{courseTitle}}", nvl(syllabus.getAcademicProgramTitle()));
            data.put("{{credits}}", String.valueOf(syllabus.getNumberOfCredits()));
            data.put("{{goals}}", nvl(syllabus.getGoals()));
            data.put("{{groupOfAcademicPrograms}}", nvl(syllabus.getGroupOfAcademicPrograms()));
        }

        // Данные автора
        if (author != null) {
            data.put("{{authorName}}", author.getFullName());
            data.put("{{authorPosition}}", nvl(author.getPosition()));
        }

        return data;
    }

    private void replacePlaceholders(XWPFParagraph p, Map<String, String> data) {
        String pText = p.getParagraphText();
        if (pText == null || !pText.contains("{{")) return;

        // Итерируемся по мапе и заменяем ключи на значения
        for (Map.Entry<String, String> entry : data.entrySet()) {
            if (pText.contains(entry.getKey())) {
                replaceTextInRuns(p, entry.getKey(), entry.getValue());
                // Обновляем pText после каждой замены для корректности следующей итерации
                pText = p.getParagraphText();
            }
        }
    }

    private void replaceTextInRuns(XWPFParagraph p, String target, String replacement) {
        List<XWPFRun> runs = p.getRuns();
        if (runs == null || runs.isEmpty()) return;

        // Алгоритм "Схлопывания":
        // Word часто разбивает {{token}} на несколько Run: [ "{", "{tok", "en}}" ]
        // Чтобы замена сработала, мы объединяем текст всех Run в один, делаем замену
        // и перезаписываем первый Run, удаляя остальные.

        StringBuilder fullText = new StringBuilder();
        for (XWPFRun r : runs) {
            String text = r.getText(0);
            fullText.append(text != null ? text : "");
        }

        String content = fullText.toString();
        if (content.contains(target)) {
            String updatedContent = content.replace(target, replacement != null ? replacement : "");

            // 1. Очищаем все Run кроме первого
            for (int i = runs.size() - 1; i > 0; i--) {
                p.removeRun(i);
            }

            // 2. В первый Run записываем итоговый текст
            XWPFRun firstRun = runs.get(0);
            firstRun.setText(updatedContent, 0);
        }
    }

    // Вспомогательная утилита для обработки null
    private String nvl(String value) {
        return value != null ? value : "";
    }
}