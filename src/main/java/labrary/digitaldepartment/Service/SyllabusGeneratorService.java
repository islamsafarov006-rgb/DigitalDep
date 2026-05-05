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
import java.util.stream.Collectors;

@Service
public class SyllabusGeneratorService {

    public byte[] generateSyllabus(Document document) throws Exception {
        try (InputStream is = getClass().getResourceAsStream("/templates/syllabus_tamplate.docx")) {
            if (is == null) {
                throw new RuntimeException("Шаблон syllabus_tamplate.docx не найден");
            }

            try (XWPFDocument doc = new XWPFDocument(is)) {
                Map<String, String> data = prepareData(document);

                doc.getParagraphs().forEach(p -> replacePlaceholders(p, data));

                for (XWPFTable table : doc.getTables()) {
                    fillSimpleFieldsInTable(table, data);

                    String tableText = table.getText();

                    if (tableText.contains("Course topics") || tableText.contains("Week/date")) {
                        fillCourseScheduleWithTotals(table, document.getWeeklyTopics());
                    }

                    else if (tableText.contains("practical classes") || tableText.contains("Topic Title")) {
                        fillPracticalTable(table, document.getWeeklyTopics());
                    }
                }

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                doc.write(out);
                return out.toByteArray();
            }
        }
    }

    private void fillCourseScheduleWithTotals(XWPFTable table, List<WeeklyTopic> topics) {
        int startRow = 1;
        int sumLect = 0, sumPract = 0, sumSiwt = 0, sumSiw = 0;

        for (int i = 0; i < 15; i++) {
            XWPFTableRow row = table.getRow(startRow + i);

            if (row == null) {
                row = table.createRow();
            }

            WeeklyTopic topic = (topics != null && i < topics.size()) ? topics.get(i) : null;

            safeSetText(row.getCell(0), String.valueOf(i + 1));
            safeSetText(row.getCell(1), topic != null ? nvl(topic.getLectureTopic()) : "");
            safeSetText(row.getCell(2), topic != null ? nvl(topic.getReferences()) : "");

            int h = 1;
            safeSetText(row.getCell(3), String.valueOf(h));
            safeSetText(row.getCell(4), String.valueOf(h));
            safeSetText(row.getCell(5), String.valueOf(h));
            safeSetText(row.getCell(6), String.valueOf(h));

            sumLect += h; sumPract += h; sumSiwt += h; sumSiw += h;
        }

        XWPFTableRow totalRow = table.getRow(startRow + 15);
        if (totalRow == null) {
            totalRow = table.createRow();
        }

        int grandTotal = sumLect + sumPract + sumSiwt + sumSiw;

        safeSetText(totalRow.getCell(1), "Total hours:");
        safeSetText(totalRow.getCell(2), String.valueOf(grandTotal));
        safeSetText(totalRow.getCell(3), String.valueOf(sumLect));
        safeSetText(totalRow.getCell(4), String.valueOf(sumPract));
        safeSetText(totalRow.getCell(5), String.valueOf(sumSiwt));
        safeSetText(totalRow.getCell(6), String.valueOf(sumSiw));
    }

    private void fillPracticalTable(XWPFTable table, List<WeeklyTopic> topics) {
        if (topics == null) return;

        List<WeeklyTopic> practiceTopics = topics.stream()
                .filter(t -> t.getPracticeTopic() != null && !t.getPracticeTopic().trim().isEmpty())
                .collect(Collectors.toList());

        int startRow = 1;
        for (int i = 0; i < practiceTopics.size(); i++) {
            XWPFTableRow row = table.getRow(startRow + i);
            if (row == null) row = table.createRow();

            WeeklyTopic topic = practiceTopics.get(i);

            safeSetText(row.getCell(0), String.valueOf(i + 1));
            safeSetText(row.getCell(1), nvl(topic.getPracticeTopic()));
            safeSetText(row.getCell(2), String.valueOf(nvlInt(topic.getHours())));
            safeSetText(row.getCell(3), nvl(topic.getReferences()));
            safeSetText(row.getCell(4), nvl(topic.getReportingForm()));
            safeSetText(row.getCell(5), nvl(topic.getDeadline()));
        }
    }


    private void safeSetText(XWPFTableCell cell, String text) {
        if (cell == null) return;
        for (int i = cell.getParagraphs().size() - 1; i >= 0; i--) {
            cell.removeParagraph(i);
        }
        XWPFParagraph p = cell.addParagraph();
        XWPFRun r = p.createRun();
        r.setText(text != null ? text : "");
        r.setFontFamily("Times New Roman");
        r.setFontSize(10);
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

        data.put("{{academicYear}}", nvl(doc.getAcademicYear()));
        data.put("{{semester}}", String.valueOf(nvlInt(doc.getSemester())));

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
            sb.append(i + 1).append(". ").append(nvl(lit.getAuthor())).append(", \"")
                    .append(nvl(lit.getTitle())).append("\"\n");
        }
        return sb.toString();
    }

    private String nvl(String value) { return value != null ? value : ""; }
    private Integer nvlInt(Integer value) { return value != null ? value : 0; }
}