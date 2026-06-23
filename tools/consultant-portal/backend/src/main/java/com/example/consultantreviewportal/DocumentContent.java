package com.example.consultantreviewportal;

public record DocumentContent(
        String filename,
        String title,
        String relativePath,
        String encodedPath,
        String lastModified,
        String content
) {
}
