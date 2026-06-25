package com.example.consultantreviewportal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.ResponseEntity;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class SuggestionControllerTest {
    @TempDir
    Path tempDir;

    @Test
    void exportsSuggestionsAsMarkdownAndCsv() throws Exception {
        SuggestionStore store = new SuggestionStore(new com.fasterxml.jackson.databind.ObjectMapper(), tempDir.resolve("suggestions.json").toString());
        Suggestion suggestion = new Suggestion();
        suggestion.documentPath = "doc.md";
        suggestion.documentTitle = "Document";
        suggestion.type = "Correction";
        suggestion.severity = "High";
        suggestion.explanation = "Change the wording.";
        suggestion.consultantName = "Consultant";
        store.create(suggestion);

        SuggestionController controller = new SuggestionController(store);
        ResponseEntity<String> markdown = controller.exportMarkdown();
        ResponseEntity<String> csv = controller.exportCsv();

        assertThat(markdown.getBody()).contains("Consultant Review Suggestions", "Change the wording.");
        assertThat(csv.getBody()).contains("documentPath", "doc.md", "Correction");
    }

    @Test
    void deletesSuggestion() throws Exception {
        SuggestionStore store = new SuggestionStore(new com.fasterxml.jackson.databind.ObjectMapper(), tempDir.resolve("suggestions.json").toString());
        Suggestion suggestion = new Suggestion();
        suggestion.documentPath = "doc.md";
        suggestion.documentTitle = "Document";
        suggestion.type = "Correction";
        suggestion.severity = "High";
        suggestion.explanation = "Change the wording.";
        suggestion.consultantName = "Consultant";
        Suggestion created = store.create(suggestion);

        SuggestionController controller = new SuggestionController(store);
        ResponseEntity<Void> response = controller.deleteSuggestion(created.id);

        assertThat(response.getStatusCode().value()).isEqualTo(204);
        assertThat(store.list()).isEmpty();
    }
}
