package labrary.digitaldepartment.Service;

import labrary.digitaldepartment.Entity.*;
import labrary.digitaldepartment.Entity.Document;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTR;
import org.apache.xmlbeans.XmlCursor;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTRow;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTText;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SyllabusGeneratorService {

    private static final int TABLE_COURSE_SCHEDULE = 1;
    private static final int TABLE_PRACTICE        = 2;
    private static final int TABLE_SIW             = 3;
    private static final int TABLE_SIWT            = 4;
    private static final int TABLE_GRADING_POLICY  = 5;

    private static final int DATA_ROW_START = 1;
    private static final int DATA_ROW_COUNT = 15;

    // ═════════════════════════════════════════════════════════════
    // ГЛАВНЫЙ МЕТОД
    // ═════════════════════════════════════════════════════════════

    public byte[] generateSyllabus(Document document) throws Exception {
        try (InputStream is = getClass().getResourceAsStream("/templates/syllabus_tamplate_fixed.docx")) {
            if (is == null) throw new RuntimeException("Шаблон syllabus_tamplate_fixed.docx не найден");

            try (XWPFDocument doc = new XWPFDocument(is)) {

                int totalLectures = 0, totalPractice = 0, totalSiw = 0, totalSiwt = 0;
                if (document.getCourseVolumes() != null && !document.getCourseVolumes().isEmpty()) {
                    CourseVolume cv = document.getCourseVolumes().get(0);
                    totalLectures = nvlInt(cv.getLectures());
                    totalPractice = nvlInt(cv.getPractice());
                    totalSiw      = nvlInt(cv.getSiw());
                    totalSiwt     = nvlInt(cv.getSiwt());
                }

                Map<Integer, WeeklyTopic> weekMap = new HashMap<>();
                if (document.getWeeklyTopics() != null) {
                    weekMap = document.getWeeklyTopics().stream()
                            .collect(Collectors.toMap(
                                    WeeklyTopic::getWeekNumber, t -> t, (t1, t2) -> t1));
                }

                System.out.println("[DEBUG] weekMap size=" + weekMap.size() + " keys=" + weekMap.keySet());

                expandTable(doc, TABLE_COURSE_SCHEDULE, totalLectures, weekMap, "schedule");
                expandTable(doc, TABLE_PRACTICE,        totalPractice, weekMap, "practice");
                expandTable(doc, TABLE_SIW,             totalSiw,      weekMap, "siw");
                expandTable(doc, TABLE_SIWT,            totalSiwt,     weekMap, "siwt");

                expandGradingPolicyTable(doc, document);

                Map<String, String> data = prepareData(document);
                data.putAll(prepareAssessmentCriteriaTags(document.getSyllabus()));
                data.put("{{totalLectures}}",  String.valueOf(totalLectures));
                data.put("{{totalPractices}}", String.valueOf(totalPractice));
                data.put("{{totalSiw}}",       String.valueOf(totalSiw));
                data.put("{{totalSiwt}}",      String.valueOf(totalSiwt));
                data.put("{{totalHours}}",     String.valueOf(
                        totalLectures + totalPractice + totalSiw + totalSiwt));

                // Заменяем плейсхолдеры в обычных параграфах документа
                doc.getParagraphs().forEach(p -> replacePlaceholders(p, data));

                // Заменяем плейсхолдеры в таблицах — через cell-уровень для split-параграфов
                for (XWPFTable table : doc.getTables()) {
                    for (XWPFTableRow row : table.getRows()) {
                        for (XWPFTableCell cell : row.getTableCells()) {
                            replacePlaceholdersInCell(cell, data);
                        }
                    }
                }

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                doc.write(out);
                return out.toByteArray();
            }
        }
    }


    private void replacePlaceholdersInCell(XWPFTableCell cell, Map<String, String> data) {
        // Сначала пробуем обычную замену внутри каждого параграфа
        for (XWPFParagraph p : cell.getParagraphs()) {
            replacePlaceholders(p, data);
        }

        // Затем ищем split-плейсхолдеры на уровне всей ячейки
        for (Map.Entry<String, String> entry : data.entrySet()) {
            replaceCrossParaPlaceholder(cell, entry.getKey(), entry.getValue());
        }
    }

    /**
     * Ищет плейсхолдер target в конкатенации всех <w:t> ячейки.
     * Если находит — заменяет его, записывая результат в нужные <w:t> теги
     * напрямую через CTText (XML-уровень), избегая XmlValueDisconnectedException.
     */
    private void replaceCrossParaPlaceholder(XWPFTableCell cell, String target, String replacement) {
        // Собираем все CTText элементы ячейки в порядке обхода
        List<CTText> ctTexts = new ArrayList<>();
        for (XWPFParagraph p : cell.getParagraphs()) {
            for (XWPFRun r : p.getRuns()) {
                // Получаем CTText напрямую через CTR, минуя XWPFRun.getText()
                CTR ctr = r.getCTR();
                for (CTText ct : ctr.getTArray()) {
                    ctTexts.add(ct);
                }
            }
        }

        if (ctTexts.isEmpty()) return;

        // Склеиваем всё в одну строку, запоминая границы каждого CTText
        StringBuilder sb = new StringBuilder();
        int[] starts = new int[ctTexts.size()];
        int[] ends   = new int[ctTexts.size()];
        for (int i = 0; i < ctTexts.size(); i++) {
            starts[i] = sb.length();
            String val = ctTexts.get(i).getStringValue();
            sb.append(val != null ? val : "");
            ends[i] = sb.length();
        }

        String fullText = sb.toString();
        int pos = fullText.indexOf(target);
        if (pos < 0) return; // плейсхолдер не найден в этой ячейке — выходим

        int targetEnd = pos + target.length();
        String rep = replacement != null ? replacement : "";

        // Находим первый CTText, в котором начинается плейсхолдер
        int firstIdx = -1;
        for (int i = 0; i < ctTexts.size(); i++) {
            if (starts[i] <= pos && pos < ends[i]) {
                firstIdx = i;
                break;
            }
        }
        if (firstIdx < 0) return;

        // Строим новое значение для первого CTText:
        // часть до плейсхолдера + замена + часть после конца плейсхолдера (если есть)
        String beforeTarget = fullText.substring(starts[firstIdx], pos);
        // Ищем, до какого CTText доходит конец плейсхолдера
        int lastIdx = firstIdx;
        for (int i = firstIdx; i < ctTexts.size(); i++) {
            if (ends[i] >= targetEnd) {
                lastIdx = i;
                break;
            }
        }
        String afterTarget = fullText.substring(targetEnd, ends[lastIdx]);

        // Пишем результат в первый CTText
        ctTexts.get(firstIdx).setStringValue(beforeTarget + rep + afterTarget);

        // Очищаем промежуточные CTText (между firstIdx и lastIdx включительно)
        for (int i = firstIdx + 1; i <= lastIdx; i++) {
            ctTexts.get(i).setStringValue("");
        }
    }

    // ═════════════════════════════════════════════════════════════
    // ТАБЛИЦЫ РАСПИСАНИЯ
    // ═════════════════════════════════════════════════════════════

    private void expandTable(XWPFDocument doc,
                             int tableIndex,
                             int neededRows,
                             Map<Integer, WeeklyTopic> weekMap,
                             String tableType) {
        System.out.println("[DEBUG] expandTable: type=" + tableType + " neededRows=" + neededRows);
        if (neededRows <= 0) return;

        XWPFTable    table          = doc.getTables().get(tableIndex);
        XWPFTableRow templateRow    = table.getRow(DATA_ROW_START);
        int          existingRows   = DATA_ROW_COUNT;

        if (neededRows > existingRows) {
            int insertAt = DATA_ROW_START + existingRows;
            for (int i = existingRows + 1; i <= neededRows; i++) {
                XWPFTableRow newRow = cloneRow(table, templateRow, insertAt++);
                fillRowPlaceholders(newRow, i, weekMap, tableType);
            }
        } else if (neededRows < existingRows) {
            for (int i = existingRows; i > neededRows; i--) {
                table.removeRow(DATA_ROW_START + i - 1);
            }
        }

        int rowsToFill = Math.min(neededRows, existingRows);
        for (int i = 1; i <= rowsToFill; i++) {
            XWPFTableRow row = table.getRow(DATA_ROW_START + i - 1);
            if (row != null) fillRowPlaceholders(row, i, weekMap, tableType);
        }
    }

    private XWPFTableRow cloneRow(XWPFTable table, XWPFTableRow templateRow, int beforeRowIndex) {
        CTRow        clonedCT  = (CTRow) templateRow.getCtRow().copy();
        XWPFTableRow newRow    = new XWPFTableRow(clonedCT, table);
        XWPFTableRow existing  = table.getRow(beforeRowIndex);

        if (existing != null) {
            existing.getCtRow().getDomNode().getParentNode()
                    .insertBefore(clonedCT.getDomNode(), existing.getCtRow().getDomNode());
            try {
                java.lang.reflect.Field f = XWPFTable.class.getDeclaredField("tableRows");
                f.setAccessible(true);
                ((List<XWPFTableRow>) f.get(table)).add(beforeRowIndex, newRow);
            } catch (Exception e) {
                table.addRow(newRow);
            }
        } else {
            table.addRow(newRow);
        }
        return newRow;
    }

    private void fillRowPlaceholders(XWPFTableRow row,
                                     int rowNum,
                                     Map<Integer, WeeklyTopic> weekMap,
                                     String tableType) {
        WeeklyTopic t   = weekMap.get(rowNum);
        String      idx = String.valueOf(rowNum);

        System.out.println("[DEBUG] fillRow: type=" + tableType
                + " rowNum=" + rowNum
                + " hasData=" + (t != null));

        Map<String, String> rowData = new HashMap<>();
        rowData.put("{{rowNum}}", idx);

        switch (tableType) {
            case "schedule" -> {
                rowData.put("{{lect"  + idx + "}}", t != null ? nvl(t.getLectureTopic())      : "");
                rowData.put("{{ref"   + idx + "}}", t != null ? nvl(t.getLectureReferences()) : "");
                rowData.put("{{lh"    + idx + "}}", t != null && t.getLectureHours()  != null ? String.valueOf(t.getLectureHours())  : "1");
                rowData.put("{{pH"    + idx + "}}", t != null && t.getPracticeHours() != null ? String.valueOf(t.getPracticeHours()) : "1");
                rowData.put("{{siwtH" + idx + "}}", t != null && t.getSrspHours()     != null ? String.valueOf(t.getSrspHours())     : "1");
                rowData.put("{{siwH"  + idx + "}}", t != null && t.getSpzHours()      != null ? String.valueOf(t.getSpzHours())      : "1");
            }
            case "practice" -> {
                rowData.put("{{practTopic" + idx + "}}", t != null ? nvl(t.getPracticeTopic())         : "");
                rowData.put("{{pH"         + idx + "}}", t != null && t.getPracticeHours() != null ? String.valueOf(t.getPracticeHours()) : "1");
                rowData.put("{{practRef"   + idx + "}}", t != null ? nvl(t.getPracticeReferences())   : "");
                rowData.put("{{practForm"  + idx + "}}", t != null ? nvl(t.getPracticeReportingForm()): "");
                rowData.put("{{practDead"  + idx + "}}", t != null ? nvl(t.getPracticeDeadline())     : "");
            }
            case "siw" -> {
                rowData.put("{{siwTopic" + idx + "}}", t != null ? nvl(t.getSpzTopic())         : "");
                rowData.put("{{siwH"     + idx + "}}", t != null && t.getSpzHours() != null ? String.valueOf(t.getSpzHours()) : "1");
                rowData.put("{{siwRef"   + idx + "}}", t != null ? nvl(t.getSpzReferences())   : "");
                rowData.put("{{siwForm"  + idx + "}}", t != null ? nvl(t.getSpzReportingForm()): "");
                rowData.put("{{siwDead"  + idx + "}}", t != null ? nvl(t.getSpzDeadline())     : "");
            }
            case "siwt" -> {
                rowData.put("{{siwtTopic" + idx + "}}", t != null ? nvl(t.getSrspTopic())         : "");
                rowData.put("{{siwtH"     + idx + "}}", t != null && t.getSrspHours() != null ? String.valueOf(t.getSrspHours()) : "1");
                rowData.put("{{siwtRef"   + idx + "}}", t != null ? nvl(t.getSrspReferences())   : "");
                rowData.put("{{siwtForm"  + idx + "}}", t != null ? nvl(t.getSrspReportingForm()): "");
                rowData.put("{{siwtDead"  + idx + "}}", t != null ? nvl(t.getSrspDeadline())     : "");
            }
        }

        for (XWPFTableCell cell : row.getTableCells()) {
            // 1. Сначала обрабатываем статичные цифры (номера строк), если они там есть
            for (XWPFParagraph p : cell.getParagraphs()) {
                try {
                    String text = p.getParagraphText(); // Вызываем ДО любых деструктивных изменений XML
                    if (text != null && text.trim().matches("\\d{1,2}")) {
                        replaceTextInRuns(p, text.trim(), idx);
                    }
                } catch (Exception e) {
                    // Логгируем на всякий случай, если структура параграфа повреждена изначально
                    System.out.println("[WARN] Сбой при обработке текста параграфа: " + e.getMessage());
                }
            }

            // 2. Делаем ВСЕ замены плейсхолдеров ОДНИМ безопасным XML-методом на уровне ячейки.
            // Он берет сырые структуры CTText и не ломается от "отвязанных" ранов POI.
            for (Map.Entry<String, String> entry : rowData.entrySet()) {
                replaceCrossParaPlaceholder(cell, entry.getKey(), entry.getValue());
            }
        }
    }

    // ═════════════════════════════════════════════════════════════
    // ТАБЛИЦА ОЦЕНИВАНИЯ
    // ═════════════════════════════════════════════════════════════

    private void expandGradingPolicyTable(XWPFDocument doc, Document document) {
        Syllabus syllabus = document.getSyllabus();
        if (syllabus == null || syllabus.getGradingPolicies() == null
                || syllabus.getGradingPolicies().isEmpty()) return;

        List<GradingPolicy> policies = syllabus.getGradingPolicies().stream()
                .sorted(Comparator.comparingInt(p -> nvlInt(p.getSortOrder())))
                .collect(Collectors.toList());

        XWPFTable    table       = doc.getTables().get(TABLE_GRADING_POLICY);
        XWPFTableRow templateRow = table != null ? table.getRow(1) : null;
        if (templateRow == null) return;

        String lastPeriod = null;
        for (int i = 0; i < policies.size(); i++) {
            GradingPolicy policy     = policies.get(i);
            XWPFTableRow  currentRow = (i == 0) ? templateRow : cloneRow(table, templateRow, i + 1);
            fillGradingPolicyRow(currentRow, policy, lastPeriod);
            lastPeriod = policy.getPeriod();
        }
    }

    private void fillGradingPolicyRow(XWPFTableRow row, GradingPolicy policy, String lastPeriod) {
        List<XWPFTableCell> cells = row.getTableCells();
        if (cells.size() < 4) return;

        Map<String, String> rowData = new HashMap<>();
        rowData.put("{{gp_period}}", !policy.getPeriod().equals(lastPeriod) ? nvl(policy.getPeriod()) : "");
        String indent = policy.isSubItem() ? "    " : "";
        rowData.put("{{gp_name}}",  indent + nvl(policy.getAssignmentName()));
        rowData.put("{{gp_score}}", policy.getScore() != null ? String.valueOf(policy.getScore()) : "");
        rowData.put("{{gp_total}}", policy.getTotal() != null ? String.valueOf(policy.getTotal()) : "");

        for (XWPFTableCell cell : cells) {
            for (XWPFParagraph p : cell.getParagraphs()) {
                replacePlaceholders(p, rowData);
                if (policy.isBold()) {
                    p.getRuns().forEach(r -> r.setBold(true));
                }
            }
        }
    }

    // ═════════════════════════════════════════════════════════════
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ═════════════════════════════════════════════════════════════

    private Map<String, String> prepareAssessmentCriteriaTags(Syllabus syllabus) {
        Map<String, String> tags = new HashMap<>();
        if (syllabus == null || syllabus.getAssessmentCriteria() == null) return tags;
        for (int i = 0; i <= 5; i++) tags.put("{{crit" + i + "}}", "");
        for (AssessmentCriterion cr : syllabus.getAssessmentCriteria()) {
            if (cr.getPoints() != null)
                tags.put("{{crit" + cr.getPoints() + "}}", nvl(cr.getCriterion()));
        }
        return tags;
    }

    private Map<String, String> prepareData(Document doc) {
        Map<String, String> data   = new HashMap<>();
        var author  = doc.getAuthor();
        var dept    = author  != null ? author.getDepartment() : null;
        var faculty = dept    != null ? dept.getFaculty()      : null;

        data.put("{{facultyNameEn}}",    faculty != null ? nvl(faculty.getNameEn()) : "");
        data.put("{{departmentNameEn}}", dept    != null ? nvl(dept.getNameEn())    : "");

        Syllabus s = doc.getSyllabus();
        if (s != null) {
            data.put("{{courseCode}}",              nvl(s.getAcademicProgramCode()));
            data.put("{{courseTitle}}",             nvl(s.getAcademicProgramTitle()));
            data.put("{{groupOfAcademicPrograms}}", nvl(s.getGroupOfAcademicPrograms()));
            data.put("{{courseCycle}}",             nvl(s.getCourseCycle()));
            data.put("{{numberOfCredits}}",         String.valueOf(nvlInt(s.getNumberOfCredits())));
            data.put("{{goals}}",                   nvl(s.getGoals()));
            data.put("{{objectives}}",              nvl(s.getObjectives()));
            data.put("{{LearningOutcomes}}",        nvl(s.getLearningOutcomes()));
            data.put("{{courseDescription}}",       nvl(s.getCourseDescription()));
            data.put("{{coursePolicy}}",            nvl(s.getCoursePolicy()));
            data.put("{{literature}}",              formatLiterature(s));
            data.put("{{finalAssessment}}",         nvl(s.getFinalAssessment()));
        }

        data.put("{{academicYear}}",   nvl(doc.getAcademicYear()));
        data.put("{{semester}}",       String.valueOf(nvlInt(doc.getSemester())));
        data.put("{{authorName}}",     author != null ? nvl(author.getFullName())  : "");
        data.put("{{authorPosition}}", author != null ? nvl(author.getPosition())  : "");
        return data;
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

        StringBuilder sb = new StringBuilder();
        for (XWPFRun r : runs) {
            String t = r.getText(0);
            sb.append(t != null ? t : "");
        }

        String content = sb.toString();
        if (!content.contains(target)) return;

        String updated = content.replace(target, replacement != null ? replacement : "");
        for (int i = runs.size() - 1; i > 0; i--) p.removeRun(i);

        XWPFRun first = runs.get(0);
        first.setText(updated, 0);
        first.setFontFamily("Times New Roman");
        first.setFontSize(10);
    }

    private String formatLiterature(Syllabus syllabus) {
        if (syllabus.getLiterature() == null || syllabus.getLiterature().isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < syllabus.getLiterature().size(); i++) {
            var lit = syllabus.getLiterature().get(i);
            sb.append(i + 1).append(". ")
                    .append(nvl(lit.getAuthor())).append(", \"")
                    .append(nvl(lit.getTitle())).append("\"\n");
        }
        return sb.toString();
    }

    private String  nvl(Integer v) { return v != null ? String.valueOf(v) : ""; }
    private String  nvl(String  v) { return v != null ? v : ""; }
    private Integer nvlInt(Integer v) { return v != null ? v : 0; }
}