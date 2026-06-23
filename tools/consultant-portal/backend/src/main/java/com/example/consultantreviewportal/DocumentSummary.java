package com.example.consultantreviewportal;

public record DocumentSummary(
        String filename,
        String title,
        String relativePath,
        String encodedPath,
        String lastModified
) {
}
