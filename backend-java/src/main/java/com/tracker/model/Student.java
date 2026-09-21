package com.tracker.model;

public class Student {
    private int studentId;
    private String rollNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private int semester;
    private double cumulativeAverage;

    public Student() {}

    public Student(int studentId, String rollNumber, String firstName, String lastName, String email, String department, int semester) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.semester = semester;
    }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public double getCumulativeAverage() { return cumulativeAverage; }
    public void setCumulativeAverage(double cumulativeAverage) { this.cumulativeAverage = cumulativeAverage; }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String toJson() {
        return String.format(
            "{\"student_id\":%d,\"roll_number\":\"%s\",\"first_name\":\"%s\",\"last_name\":\"%s\",\"full_name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"semester\":%d,\"cumulative_average\":%.2f}",
            studentId, rollNumber, firstName, lastName, getFullName(), email, department, semester, cumulativeAverage
        );
    }
}
