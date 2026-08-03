package com.kshitiz.librarymanagementsystem.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kshitiz.librarymanagementsystem.dto.AiAskRequest;
import com.kshitiz.librarymanagementsystem.entity.Book;
import com.kshitiz.librarymanagementsystem.exception.BookNotFoundException;
import com.kshitiz.librarymanagementsystem.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class AiAssistantService {

    private static final Logger logger = LoggerFactory.getLogger(AiAssistantService.class);

    private final BookRepository bookRepository;
    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String openaiModel;

    public AiAssistantService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .build();
    }

    public String askAboutBook(int bookId, AiAskRequest request) {
        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AI helper is not configured. Set OPENAI_API_KEY on the server.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        String authorName = book.getAuthor() != null ? book.getAuthor().getName() : "Unknown";

        String systemPrompt = "You are a helpful reading assistant for the book \"" + book.getTitle()
                + "\" by " + authorName + ". Help the reader understand the content they are reading. "
                + "Be concise and clear."
                + (request.getSelectedText() != null && !request.getSelectedText().isBlank()
                        ? " The reader has selected this text: \"" + request.getSelectedText() + "\""
                        : "");

        Map<String, Object> body = Map.of(
                "model", openaiModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", request.getQuestion())
                ),
                "max_tokens", 300
        );

        try {
            String rawResponse = restClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode content = root.at("/choices/0/message/content");

            if (content.isMissingNode()) {
                logger.warn("Unexpected OpenAI response shape: {}", rawResponse);
                return "No answer received from the AI helper.";
            }
            return content.asText();

        } catch (org.springframework.web.client.RestClientResponseException e) {
            logger.error("OpenAI request failed with status {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            String hint;
            if (e.getStatusCode().value() == 401) {
                hint = "OpenAI rejected the API key (invalid or revoked).";
            } else if (e.getStatusCode().value() == 429) {
                hint = "OpenAI rate-limited or out-of-quota response. Check your OpenAI billing/usage.";
            } else {
                hint = "OpenAI returned an error (" + e.getStatusCode().value() + ").";
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, hint);
        } catch (Exception e) {
            logger.error("AI helper request failed", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Failed to get a response from the AI helper. Please try again.");
        }
    }
}
