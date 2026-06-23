package com.example.consultantreviewportal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;

@Service
public class DocumentService {
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault());

    private final Path docsRoot;

    public DocumentService(@Value("${app.docs-folder:./docs}") String docsFolder) {
        this.docsRoot = Path.of(docsFolder).toAbsolutePath().normalize();
    }

    public List<DocumentSummary> listDocuments() throws IOException {
        if (!Files.exists(docsRoot)) {
            Files.createDirectories(docsRoot);
        }
        try (var stream = Files.walk(docsRoot)) {
            return stream
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".md"))
                    .map(this::summary)
                    .sorted(Comparator.comparing(DocumentSummary::relativePath))
                    .toList();
        }
    }

    public DocumentContent readDocument(String encodedPath) throws IOException {
        Path file = resolveMarkdownFile(encodedPath, true);
        DocumentSummary summary = summary(file);
        return new DocumentContent(
                summary.filename(),
                summary.title(),
                summary.relativePath(),
                summary.encodedPath(),
                summary.lastModified(),
                Files.readString(file, StandardCharsets.UTF_8)
        );
    }

    public DocumentContent saveDocument(String encodedPath, String content) throws IOException {
        Path file = resolveMarkdownFile(encodedPath, true);
        Files.writeString(file, content == null ? "" : content, StandardCharsets.UTF_8);
        return readDocument(encodedPath);
    }

    private DocumentSummary summary(Path file) {
        String relativePath = docsRoot.relativize(file.toAbsolutePath().normalize()).toString().replace('\\', '/');
        String filename = file.getFileName().toString();
        return new DocumentSummary(
                filename,
                detectTitle(file, filename),
                relativePath,
                encode(relativePath),
                lastModified(file)
        );
    }

    private Path resolveMarkdownFile(String encodedPath, boolean mustExist) throws IOException {
        String relativePath = decode(encodedPath);
        if (!StringUtils.hasText(relativePath) || Path.of(relativePath).isAbsolute()) {
            throw new IllegalArgumentException("Invalid document path.");
        }

        Path file = docsRoot.resolve(relativePath).toAbsolutePath().normalize();
        if (!file.startsWith(docsRoot)) {
            throw new IllegalArgumentException("Document path is outside the configured folder.");
        }
        if (!file.getFileName().toString().endsWith(".md")) {
            throw new IllegalArgumentException("Only Markdown files can be used.");
        }
        if (mustExist && (!Files.exists(file) || !Files.isRegularFile(file))) {
            throw new IllegalArgumentException("Markdown document was not found.");
        }
        return file;
    }

    private String detectTitle(Path file, String fallback) {
        try (var lines = Files.lines(file, StandardCharsets.UTF_8)) {
            return lines
                    .map(String::trim)
                    .filter(line -> line.startsWith("# "))
                    .map(line -> line.substring(2).trim())
                    .filter(StringUtils::hasText)
                    .findFirst()
                    .orElse(fallback);
        } catch (IOException ignored) {
            return fallback;
        }
    }

    private String lastModified(Path file) {
        try {
            return DATE_FORMAT.format(Files.getLastModifiedTime(file).toInstant());
        } catch (IOException ignored) {
            return "";
        }
    }

    static String encode(String path) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(path.getBytes(StandardCharsets.UTF_8));
    }

    static String decode(String encodedPath) {
        try {
            return new String(Base64.getUrlDecoder().decode(encodedPath), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid encoded document path.");
        }
    }
}
