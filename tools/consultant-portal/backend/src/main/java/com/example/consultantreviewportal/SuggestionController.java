package com.example.consultantreviewportal;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class SuggestionController {
    private final SuggestionStore store;

    public SuggestionController(SuggestionStore store) {
        this.store = store;
    }

    @GetMapping("/suggestions")
    public List<Suggestion> listSuggestions() throws IOException {
        return store.list();
    }

    @PostMapping("/suggestions")
    public Suggestion createSuggestion(@RequestBody Suggestion suggestion) throws IOException {
        return store.create(suggestion);
    }

    @PatchMapping("/suggestions/{id}/status")
    public Suggestion updateStatus(@PathVariable String id, @RequestBody StatusRequest request) throws IOException {
        return store.updateStatus(id, request.status());
    }

    @PatchMapping("/suggestions/{id}/owner-comment")
    public Suggestion updateOwnerComment(@PathVariable String id, @RequestBody OwnerCommentRequest request) throws IOException {
        return store.updateOwnerComment(id, request.ownerComment());
    }

    @DeleteMapping("/suggestions/{id}")
    public ResponseEntity<Void> deleteSuggestion(@PathVariable String id) throws IOException {
        store.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/suggestions.md")
    public ResponseEntity<String> exportMarkdown() throws IOException {
        StringBuilder output = new StringBuilder("# Consultant Review Suggestions\n\n");
        for (Suggestion suggestion : store.list()) {
            output.append("## ").append(suggestion.documentTitle).append(" - ").append(suggestion.type).append("\n\n")
                    .append("- Path: ").append(suggestion.documentPath).append("\n")
                    .append("- Severity: ").append(suggestion.severity).append("\n")
                    .append("- Status: ").append(suggestion.status).append("\n")
                    .append("- Consultant: ").append(suggestion.consultantName).append("\n");
            if (suggestion.sectionTitle != null) {
                output.append("- Section: ").append(suggestion.sectionTitle).append("\n");
            }
            output.append("\n").append(suggestion.explanation).append("\n\n");
            if (suggestion.suggestedText != null) {
                output.append("Suggested text:\n\n```text\n").append(suggestion.suggestedText).append("\n```\n\n");
            }
            if (suggestion.ownerComment != null) {
                output.append("Owner comment: ").append(suggestion.ownerComment).append("\n\n");
            }
        }
        return downloadable("suggestions.md", "text/markdown", output.toString());
    }

    @GetMapping("/export/suggestions.csv")
    public ResponseEntity<String> exportCsv() throws IOException {
        StringBuilder output = new StringBuilder("id,documentPath,documentTitle,type,severity,status,consultantName,sectionTitle,explanation,ownerComment,createdAt,updatedAt\n");
        for (Suggestion suggestion : store.list()) {
            output.append(csv(suggestion.id)).append(',')
                    .append(csv(suggestion.documentPath)).append(',')
                    .append(csv(suggestion.documentTitle)).append(',')
                    .append(csv(suggestion.type)).append(',')
                    .append(csv(suggestion.severity)).append(',')
                    .append(csv(suggestion.status)).append(',')
                    .append(csv(suggestion.consultantName)).append(',')
                    .append(csv(suggestion.sectionTitle)).append(',')
                    .append(csv(suggestion.explanation)).append(',')
                    .append(csv(suggestion.ownerComment)).append(',')
                    .append(csv(suggestion.createdAt)).append(',')
                    .append(csv(suggestion.updatedAt)).append('\n');
        }
        return downloadable("suggestions.csv", "text/csv", output.toString());
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<Map<String, String>> badRequest(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    private ResponseEntity<String> downloadable(String filename, String contentType, String body) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(new MediaType(MediaType.parseMediaType(contentType), StandardCharsets.UTF_8))
                .body(body);
    }

    private String csv(String value) {
        String safe = value == null ? "" : value;
        return "\"" + safe.replace("\"", "\"\"") + "\"";
    }
}
