package com.courtroomai.dsa_service;

public class LegalCase {
    private String caseId;
    private String title;
    private String summary;
    private int year;
    private String category;

    public LegalCase(String caseId, String title, String summary, int year, String category) {
        this.caseId = caseId;
        this.title = title;
        this.summary = summary;
        this.year = year;
        this.category = category;
    }

    public String getCaseId() {
        return caseId;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public int getYear() {
        return year;
    }

    public String getCategory() {
        return category;

    }

    @Override
    public String toString() {
        return title + "(" + year + ")-" + summary;
    }
}
