package com.kshitiz.librarymanagementsystem.dto;

public class AiAskResponse {

    private String answer;

    public AiAskResponse() {}
    public AiAskResponse(String answer) { this.answer = answer; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
