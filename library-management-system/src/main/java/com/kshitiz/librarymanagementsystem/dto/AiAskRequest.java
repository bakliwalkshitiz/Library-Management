package com.kshitiz.librarymanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class AiAskRequest {

    @NotBlank(message = "Question cannot be blank")
    private String question;

    private String selectedText;

    public AiAskRequest() {}

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getSelectedText() { return selectedText; }
    public void setSelectedText(String selectedText) { this.selectedText = selectedText; }
}
