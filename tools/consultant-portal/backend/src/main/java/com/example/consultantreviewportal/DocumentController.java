package com.example.consultantreviewportal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documents;
    private final SuggestionStore suggestions;

    public DocumentController(DocumentService documents, SuggestionStore suggestions) {
        this.documents = documents;
        this.suggestions = suggestions;
    }

    @GetMapping
    public Object listDocuments() throws IOException {
        return documents.listDocuments();
    }

    @GetMapping("/{encodedPath}")
    public Object readDocument(@PathVariable String encodedPath) throws IOException {
        return documents.readDocument(encodedPath);
    }

    @PutMapping("/{encodedPath}")
    public Object saveDocument(@PathVariable String encodedPath, @RequestBody DocumentSaveRequest request) throws IOException {
        return documents.saveDocument(encodedPath, request.content());
    }

    @GetMapping("/{encodedPath}/suggestions")
    public Object suggestionsForDocument(@PathVariable String encodedPath) throws IOException {
        DocumentContent document = documents.readDocument(encodedPath);
        return suggestions.listForDocument(document.relativePath());
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<Map<String, String>> badRequest(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
