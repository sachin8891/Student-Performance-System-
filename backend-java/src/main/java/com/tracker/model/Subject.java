package com.tracker.model;

public class Subject {
    private int subjectId;
    private String subjectCode;
    private String subjectName;
    private int credits;
    private String facultyName;

    public Subject() {}

    public Subject(int subjectId, String subjectCode, String subjectName, int credits, String facultyName) {
        this.subjectId = subjectId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits;
        this.facultyName = facultyName;
    }

    public int getSubjectId() { return subjectId; }
    public String getSubjectCode() { return subjectCode; }
    public String getSubjectName() { return subjectName; }
    public int getCredits() { return credits; }
    public String getFacultyName() { return facultyName; }

    public String toJson() {
        return String.format(
            "{\"subject_id\":%d,\"subject_code\":\"%s\",\"subject_name\":\"%s\",\"credits\":%d,\"faculty_name\":\"%s\"}",
            subjectId, subjectCode, subjectName, credits, facultyName
        );
    }
}
