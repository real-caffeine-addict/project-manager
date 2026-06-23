package com.example.consultantreviewportal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DocumentServiceTest {
    @TempDir
    Path docs;

    @Test
    void listsMarkdownFilesAndIgnoresOtherFiles() throws Exception {
        Files.writeString(docs.resolve("phase-zero.md"), "# Phase Zero\n\nContent");
        Files.writeString(docs.resolve("notes.txt"), "No");

        DocumentService service = new DocumentService(docs.toString());

        assertThat(service.listDocuments())
                .hasSize(1)
                .first()
                .satisfies(document -> {
                    assertThat(document.filename()).isEqualTo("phase-zero.md");
                    assertThat(document.title()).isEqualTo("Phase Zero");
                });
    }

    @Test
    void readsAndSavesMarkdownContent() throws Exception {
        Files.writeString(docs.resolve("doc.md"), "# Old");
        DocumentService service = new DocumentService(docs.toString());
        String encodedPath = DocumentService.encode("doc.md");

        assertThat(service.readDocument(encodedPath).content()).contains("# Old");

        service.saveDocument(encodedPath, "# New");

        assertThat(Files.readString(docs.resolve("doc.md"))).isEqualTo("# New");
    }

    @Test
    void rejectsPathTraversal() {
        DocumentService service = new DocumentService(docs.toString());

        assertThatThrownBy(() -> service.readDocument(DocumentService.encode("../outside.md")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("outside");
    }

    @Test
    void rejectsNonMarkdownModification() throws Exception {
        Files.writeString(docs.resolve("notes.txt"), "No");
        DocumentService service = new DocumentService(docs.toString());

        assertThatThrownBy(() -> service.saveDocument(DocumentService.encode("notes.txt"), "changed"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Markdown");
    }
}
