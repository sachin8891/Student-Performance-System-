package com.tracker.model;

public class ScoreRecord {
    private int scoreId;
    private int studentId;
    private int assessmentId;
    private double marksObtained;
    private String letterGrade;
    private String remarks;

    public ScoreRecord() {}

    public ScoreRecord(int scoreId, int studentId, int assessmentId, double marksObtained, String letterGrade, String remarks) {
        this.scoreId = scoreId;
        this.studentId = studentId;
        this.assessmentId = assessmentId;
        this.marksObtained = marksObtained;
        this.letterGrade = letterGrade;
        this.remarks = remarks;
    }

    public int getScoreId() { return scoreId; }
    public int getStudentId() { return studentId; }
    public int getAssessmentId() { return assessmentId; }
    public double getMarksObtained() { return marksObtained; }
    public String getLetterGrade() { return letterGrade; }
    public String getRemarks() { return remarks; }

    public String toJson() {
        return String.format(
            "{\"score_id\":%d,\"student_id\":%d,\"assessment_id\":%d,\"marks_obtained\":%.2f,\"letter_grade\":\"%s\",\"remarks\":\"%s\"}",
            scoreId, studentId, assessmentId, marksObtained, letterGrade, remarks != null ? remarks : ""
        );
    }
}
