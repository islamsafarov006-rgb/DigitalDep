package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.*;
import labrary.digitaldepartment.Entity.Document;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SyllabusGeneratorService {

    public byte[] generateSyllabus(Document document) throws Exception {
        try (InputStream is = getClass().getResourceAsStream("/templates/syllabus_tamplate.docx")) {
            if (is == null) throw new RuntimeException("Шаблон не найден");

            try (XWPFDocument doc = new XWPFDocument(is)) {
                Map<String, String> data = prepareData(document);

                // 1. Заменяем текст в параграфах
                doc.getParagraphs().forEach(p -> replacePlaceholders(p, data));

                // 2. Обрабатываем таблицы
                for (XWPFTable table : doc.getTables()) {
                    // Сначала заменяем простые плейсхолдеры внутри всех таблиц
                    fillSimpleFieldsInTable(table, data);

                    // Ищем таблицу расписания по ключевому слову в заголовке
                    String tableText = table.getText();
                    if (tableText.contains("Course topics") || tableText.contains("Week/date")) {
                        // ВЫЗЫВАЕМ ВАШ МЕТОД С РАСЧЕТАМИ (исправленный ниже)
                        fillCourseScheduleWithTotals(table, document.getWeeklyTopics());
                    }
                }

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                doc.write(out);
                return out.toByteArray();
            }
        }
    }

    private void fillCourseScheduleWithTotals(XWPFTable table, List<WeeklyTopic> topics) {
        int startRow = 1; // Пропускаем заголовок
        int sumLect = 0, sumPract = 0, sumSiwt = 0, sumSiw = 0;

        for (int i = 0; i < 15; i++) {
            XWPFTableRow row = table.getRow(startRow + i);
            if (row == null) break;

            WeeklyTopic topic = (topics != null && i < topics.size()) ? topics.get(i) : null;

            // Заполняем ячейки с очисткой старого контента
            safeSetText(row.getCell(0), String.valueOf(i + 1)); // №
            safeSetText(row.getCell(1), topic != null ? nvl(topic.getLectureTopic()) : "");
            safeSetText(row.getCell(2), topic != null ? nvl(topic.getReferences()) : "");

            // Часы (по умолчанию 1, как вы просили)
            int h = 1;
            safeSetText(row.getCell(3), String.valueOf(h));
            safeSetText(row.getCell(4), String.valueOf(h));
            safeSetText(row.getCell(5), String.valueOf(h));
            safeSetText(row.getCell(6), String.valueOf(h));

            sumLect += h; sumPract += h; sumSiwt += h; sumSiw += h;
        }

        // Итоговая строка (17-я строка документа, индекс 16)
        XWPFTableRow totalRow = table.getRow(16);
        if (totalRow != null) {
            int grandTotal = sumLect + sumPract + sumSiwt + sumSiw;
            safeSetText(totalRow.getCell(2), String.valueOf(grandTotal));
            safeSetText(totalRow.getCell(3), String.valueOf(sumLect));
            safeSetText(totalRow.getCell(4), String.valueOf(sumPract));
            safeSetText(totalRow.getCell(5), String.valueOf(sumSiwt));
            safeSetText(totalRow.getCell(6), String.valueOf(sumSiw));
        }
    }

    /**
     * Безопасно очищает ячейку и записывает новый текст
     */
    private void safeSetText(XWPFTableCell cell, String text) {
        if (cell == null) return;
        // Удаляем все текущие параграфы в ячейке
        for (int i = cell.getParagraphs().size() - 1; i >= 0; i--) {
            cell.removeParagraph(i);
        }
        // Добавляем новый чистый текст
        XWPFParagraph p = cell.addParagraph();
        XWPFRun r = p.createRun();
        r.setText(text != null ? text : "");
    }

    private void fillWeeklyTable(XWPFTable table, List<WeeklyTopic> topics, String type) {
        int startRow = 1;

        for (int i = 0; i < topics.size(); i++) {
            WeeklyTopic topic = topics.get(i);
            XWPFTableRow row = table.getRow(startRow + i);
            if (row == null) break;

            if (type.equals("lecture")) {
                row.getCell(0).setText(String.valueOf(topic.getWeekNumber()));
                row.getCell(1).setText(nvl(topic.getLectureTopic()));
                row.getCell(2).setText(nvl(topic.getReferences()));
                row.getCell(3).setText(String.valueOf(nvlInt(topic.getHours())));
            } else {
                row.getCell(0).setText(String.valueOf(topic.getWeekNumber()));
                String topicTitle = type.equals("practice") ? topic.getPracticeTopic() :
                        type.equals("srs") ? topic.getSrsTopic() : topic.getSrspTopic();
                row.getCell(1).setText(nvl(topicTitle));
                row.getCell(2).setText(String.valueOf(nvlInt(topic.getHours())));
                row.getCell(3).setText(nvl(topic.getReferences()));
                row.getCell(4).setText(nvl(topic.getReportingForm()));
                row.getCell(5).setText(nvl(topic.getDeadline()));
            }
        }
    }

    private Map<String, String> prepareData(Document doc) {
        Map<String, String> data = new HashMap<>();

        var author = doc.getAuthor();
        var dept = (author != null) ? author.getDepartment() : null;
        var faculty = (dept != null) ? dept.getFaculty() : null;

        data.put("{{facultyNameEn}}", faculty != null ? faculty.getNameEn() : "");
        data.put("{{departmentNameEn}}", dept != null ? dept.getNameEn() : "");

        Syllabus syllabus = doc.getSyllabus();
        if (syllabus != null) {
            data.put("{{courseCode}}", nvl(syllabus.getAcademicProgramCode()));
            data.put("{{courseTitle}}", nvl(syllabus.getAcademicProgramTitle()));
            data.put("{{groupOfAcademicPrograms}}", nvl(syllabus.getGroupOfAcademicPrograms()));
            data.put("{{courseCycle}}", nvl(syllabus.getCourseCycle()));
            data.put("{{numberOfCredits}}", String.valueOf(nvlInt(syllabus.getNumberOfCredits())));
            data.put("{{goals}}", nvl(syllabus.getGoals()));
            data.put("{{objectives}}", nvl(syllabus.getObjectives()));
            data.put("{{LearningOutcomes}}", nvl(syllabus.getLearningOutcomes()));
            data.put("{{courseDescription}}", nvl(syllabus.getCourseDescription()));
            data.put("{{coursePolicy}}", nvl(syllabus.getCoursePolicy()));
            data.put("{{literature}}", formatLiterature(syllabus));
        }

        data.put("{{ academicYear}}", nvl(doc.getAcademicYear()));
        data.put("{{semester}}", String.valueOf(nvlInt(doc.getSemester())));

        String assessment = (syllabus != null) ? nvl(syllabus.getFinalAssessment()) : "";
        data.put(" {{ finalAssessment}}", assessment);

        List<CourseVolume> volumes = doc.getCourseVolumes();
        if (volumes != null && !volumes.isEmpty()) {
            CourseVolume vol = volumes.get(0);
            data.put("{{lectures}}", String.valueOf(nvlInt(vol.getLectures())));
            data.put("{{practice}}", String.valueOf(nvlInt(vol.getPractice())));
            data.put("{{siw}}", String.valueOf(nvlInt(vol.getSiw())));
            data.put("{{siwt}}", String.valueOf(nvlInt(vol.getSiwt())));
            data.put("{{total}}", String.valueOf(nvlInt(vol.getTotal())));
        }

        if (author != null) {
            data.put("{{authorName}}", nvl(author.getFullName()));
            data.put("{{authorPosition}}", nvl(author.getPosition()));
        }

        return data;
    }

    private void fillSimpleFieldsInTable(XWPFTable table, Map<String, String> data) {
        for (XWPFTableRow row : table.getRows()) {
            for (XWPFTableCell cell : row.getTableCells()) {
                cell.getParagraphs().forEach(p -> replacePlaceholders(p, data));
            }
        }
    }

    private void replacePlaceholders(XWPFParagraph p, Map<String, String> data) {
        String pText = p.getParagraphText();
        if (pText == null || !pText.contains("{{")) return;

        for (Map.Entry<String, String> entry : data.entrySet()) {
            if (pText.contains(entry.getKey())) {
                replaceTextInRuns(p, entry.getKey(), entry.getValue());
                pText = p.getParagraphText();
            }
        }
    }

    private void replaceTextInRuns(XWPFParagraph p, String target, String replacement) {
        List<XWPFRun> runs = p.getRuns();
        if (runs == null || runs.isEmpty()) return;
        StringBuilder fullText = new StringBuilder();
        for (XWPFRun r : runs) {
            String text = r.getText(0);
            fullText.append(text != null ? text : "");
        }
        String content = fullText.toString();
        if (content.contains(target)) {
            String updatedContent = content.replace(target, replacement != null ? replacement : "");
            for (int i = runs.size() - 1; i > 0; i--) p.removeRun(i);
            XWPFRun firstRun = runs.get(0);
            firstRun.setText(updatedContent, 0);
        }
    }

    private String formatLiterature(Syllabus syllabus) {
        if (syllabus.getLiterature() == null || syllabus.getLiterature().isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < syllabus.getLiterature().size(); i++) {
            var lit = syllabus.getLiterature().get(i);
            sb.append(i + 1).append(". ").append(nvl(lit.getAuthor())).append(", \"").append(nvl(lit.getTitle())).append("\"\n");
        }
        return sb.toString();
    }

    private String nvl(String value) { return value != null ? value : ""; }
    private Integer nvlInt(Integer value) { return value != null ? value : 0; }

}

