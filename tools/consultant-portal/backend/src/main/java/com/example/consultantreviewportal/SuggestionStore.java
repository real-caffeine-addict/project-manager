package com.example.consultantreviewportal;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class SuggestionStore {
    private static final Set<String> TYPES = Set.of("Correction", "Missing Scenario", "Domain Risk",
            "Contractual Risk", "Terminology", "Process Improvement", "Question");
    private static final Set<String> SEVERITIES = Set.of("Low", "Medium", "High", "Blocking");
    private static final Set<String> STATUSES = Set.of("Open", "Accepted", "Rejected", "Needs Discussion");

    private final ObjectMapper objectMapper;
    private final Path storageFile;

    public SuggestionStore(ObjectMapper objectMapper,
                           @Value("${app.suggestions-file:../data/suggestions.json}") String storageFile) {
        this.objectMapper = objectMapper.findAndRegisterModules();
        this.storageFile = Path.of(storageFile).toAbsolutePath().normalize();
    }

    public synchronized List<Suggestion> list() throws IOException {
        return readAll();
    }

    public synchronized List<Suggestion> listForDocument(String documentPath) throws IOException {
        return readAll().stream()
                .filter(suggestion -> documentPath.equals(suggestion.documentPath))
                .toList();
    }

    public synchronized Suggestion create(Suggestion suggestion) throws IOException {
        validateNewSuggestion(suggestion);
        List<Suggestion> suggestions = readAll();
        String now = Instant.now().toString();
        suggestion.id = UUID.randomUUID().toString();
        suggestion.createdAt = now;
        suggestion.updatedAt = now;
        suggestion.status = "Open";
        suggestion.ownerComment = blankToNull(suggestion.ownerComment);
        suggestions.add(suggestion);
        writeAll(suggestions);
        return suggestion;
    }

    public synchronized Suggestion updateStatus(String id, String status) throws IOException {
        if (!STATUSES.contains(status)) {
            throw new IllegalArgumentException("Unknown status.");
        }
        List<Suggestion> suggestions = readAll();
        Suggestion suggestion = findById(suggestions, id);
        suggestion.status = status;
        suggestion.updatedAt = Instant.now().toString();
        writeAll(suggestions);
        return suggestion;
    }

    public synchronized Suggestion updateOwnerComment(String id, String ownerComment) throws IOException {
        List<Suggestion> suggestions = readAll();
        Suggestion suggestion = findById(suggestions, id);
        suggestion.ownerComment = blankToNull(ownerComment);
        suggestion.updatedAt = Instant.now().toString();
        writeAll(suggestions);
        return suggestion;
    }

    public synchronized void delete(String id) throws IOException {
        List<Suggestion> suggestions = readAll();
        boolean removed = suggestions.removeIf(suggestion -> suggestion.id.equals(id));
        if (!removed) {
            throw new IllegalArgumentException("Suggestion was not found.");
        }
        writeAll(suggestions);
    }

    private List<Suggestion> readAll() throws IOException {
        if (!Files.exists(storageFile)) {
            return new ArrayList<>();
        }
        return objectMapper.readValue(storageFile.toFile(), new TypeReference<>() {
        });
    }

    private void writeAll(List<Suggestion> suggestions) throws IOException {
        Files.createDirectories(storageFile.getParent());
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(storageFile.toFile(), suggestions);
    }

    private Suggestion findById(List<Suggestion> suggestions, String id) {
        return suggestions.stream()
                .filter(suggestion -> suggestion.id.equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Suggestion was not found."));
    }

    private void validateNewSuggestion(Suggestion suggestion) {
        if (!StringUtils.hasText(suggestion.documentPath)
                || !StringUtils.hasText(suggestion.documentTitle)
                || !StringUtils.hasText(suggestion.explanation)
                || !StringUtils.hasText(suggestion.consultantName)) {
            throw new IllegalArgumentException("Document, explanation, and consultant name are required.");
        }
        if (!TYPES.contains(suggestion.type)) {
            throw new IllegalArgumentException("Unknown suggestion type.");
        }
        if (!SEVERITIES.contains(suggestion.severity)) {
            throw new IllegalArgumentException("Unknown severity.");
        }
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value : null;
    }
}
