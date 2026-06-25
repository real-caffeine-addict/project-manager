package com.example.consultantreviewportal;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class SuggestionStoreTest {
    @TempDir
    Path tempDir;

    @Test
    void createsSuggestionAndPersistsIt() throws Exception {
        SuggestionStore store = new SuggestionStore(new ObjectMapper(), tempDir.resolve("suggestions.json").toString());

        Suggestion created = store.create(validSuggestion());

        assertThat(created.id).isNotBlank();
        assertThat(created.status).isEqualTo("Open");
        assertThat(store.list()).hasSize(1);
    }

    @Test
    void updatesSuggestionStatus() throws Exception {
        SuggestionStore store = new SuggestionStore(new ObjectMapper(), tempDir.resolve("suggestions.json").toString());
        Suggestion created = store.create(validSuggestion());

        Suggestion updated = store.updateStatus(created.id, "Needs Discussion");

        assertThat(updated.status).isEqualTo("Needs Discussion");
        assertThat(store.list().get(0).status).isEqualTo("Needs Discussion");
    }

    @Test
    void updatesOwnerComment() throws Exception {
        SuggestionStore store = new SuggestionStore(new ObjectMapper(), tempDir.resolve("suggestions.json").toString());
        Suggestion created = store.create(validSuggestion());

        Suggestion updated = store.updateOwnerComment(created.id, "נבדוק עם בעל התהליך");

        assertThat(updated.ownerComment).isEqualTo("נבדוק עם בעל התהליך");
    }

    @Test
    void deletesSuggestion() throws Exception {
        SuggestionStore store = new SuggestionStore(new ObjectMapper(), tempDir.resolve("suggestions.json").toString());
        Suggestion created = store.create(validSuggestion());

        store.delete(created.id);

        assertThat(store.list()).isEmpty();
    }

    private Suggestion validSuggestion() {
        Suggestion suggestion = new Suggestion();
        suggestion.documentPath = "doc.md";
        suggestion.documentTitle = "Document";
        suggestion.type = "Question";
        suggestion.severity = "Medium";
        suggestion.explanation = "Need to clarify this part.";
        suggestion.consultantName = "Consultant";
        return suggestion;
    }
}
