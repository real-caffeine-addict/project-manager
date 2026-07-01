package com.example.consultantreviewportal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class ResendOtpMailService implements OtpSender{
    private final String apiKey;
    private final String from;
    private final RestClient restClient = RestClient.create("https://api.resend.com");

    public ResendOtpMailService(
            @Value("${resend.api-key:}") String apiKey,
            @Value("${app.otp-mail-from:}") String from
    ) {
        this.apiKey = apiKey;
        this.from = from;
    }

    @Override
    public void sendOtp(String email, String otp) {
        if (!StringUtils.hasText(apiKey)) {
            throw new IllegalStateException("Resend API key is not configured.");
        }
        if (!StringUtils.hasText(from)) {
            throw new IllegalStateException("OTP mail sender is not configured.");
        }
        Map<String, Object> payload = Map.of(
                "from", from,
                "to", email,
                "subject", "Consultant Review Portal OTP",
                "text", "Your Consultant Review Portal code is: " + otp + "\n\nThis code expires soon."
        );

        restClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }
}