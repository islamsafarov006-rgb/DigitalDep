package labrary.digitaldepartment.DTO;

import java.util.Date;

public class CamundaTaskDto {
    private String id;
    private String name;
    private String assignee;
    private String processInstanceId;
    private String processDefinitionId;
    private String taskDefinitionKey;
    private Date createTime;

    // 🌟 НОВОЕ ПОЛЕ: Для проброса ID силлабуса на фронтенд
    private String syllabusId;

    // Пустой конструктор
    public CamundaTaskDto() {}

    // Геттеры и Сеттеры
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }

    public String getProcessInstanceId() { return processInstanceId; }
    public void setProcessInstanceId(String processInstanceId) { this.processInstanceId = processInstanceId; }

    public String getProcessDefinitionId() { return processDefinitionId; }
    public void setProcessDefinitionId(String processDefinitionId) { this.processDefinitionId = processDefinitionId; }

    public String getTaskDefinitionKey() { return taskDefinitionKey; }
    public void setTaskDefinitionKey(String taskDefinitionKey) { this.taskDefinitionKey = taskDefinitionKey; }

    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    public String getSyllabusId() {
        return syllabusId;
    }

    public void setSyllabusId(String syllabusId) {
        this.syllabusId = syllabusId;
    }
}