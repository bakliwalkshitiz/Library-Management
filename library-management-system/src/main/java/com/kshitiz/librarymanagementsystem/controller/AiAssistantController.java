package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.AiAskRequest;
import com.kshitiz.librarymanagementsystem.dto.AiAskResponse;
import com.kshitiz.librarymanagementsystem.service.AiAssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books/{bookId}/ai")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/ask")
    public ResponseEntity<AiAskResponse> ask(
            @PathVariable int bookId,
            @Valid @RequestBody AiAskRequest request) {

        String answer = aiAssistantService.askAboutBook(bookId, request);
        return ResponseEntity.ok(new AiAskResponse(answer));
    }
}
