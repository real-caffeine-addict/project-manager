package com.example.consultantreviewportal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    private final Path usersFile;
    private final OtpSender mail;
    private final Duration otpTtl;
    private final Duration sessionTtl;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpChallenge> challenges = new ConcurrentHashMap<>();
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public AuthService(@Value("${app.auth-users-file}") String usersFile,
                       @Value("${app.otp-valid-minutes:10}") long otpMinutes,
                       @Value("${app.auth-session-hours:12}") long sessionHours,
                       OtpSender mail) {
        this.usersFile = Path.of(usersFile).toAbsolutePath().normalize();
        this.otpTtl = Duration.ofMinutes(otpMinutes);
        this.sessionTtl = Duration.ofHours(sessionHours);
        this.mail = mail;
    }

    public String startChallenge(String email, String mobile) throws IOException {
        AuthUser user = findAuthorizedUser(email, mobile)
                .orElseThrow(() -> new IllegalArgumentException("Email and mobile are not authorized."));
        String otp = String.format("%06d", random.nextInt(1_000_000));
        String challengeId = UUID.randomUUID().toString();
        challenges.put(challengeId, new OtpChallenge(user.email(), otp, Instant.now().plus(otpTtl)));
        mail.sendOtp(user.email(), otp);
        return challengeId;
    }

    public String verify(String challengeId, String otp) {
        if (!StringUtils.hasText(challengeId) || !StringUtils.hasText(otp)) {
            throw new IllegalArgumentException("OTP is required.");
        }

        OtpChallenge challenge = challenges.remove(challengeId);
        if (challenge == null || challenge.expiresAt().isBefore(Instant.now()) || !challenge.otp().equals(otp.trim())) {
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        String token = UUID.randomUUID().toString();
        sessions.put(token, new Session(challenge.email(), Instant.now().plus(sessionTtl)));
        return token;
    }

    public Optional<String> authenticate(String token) {
        if (!StringUtils.hasText(token)) {
            return Optional.empty();
        }
        Session session = sessions.get(token);
        if (session == null) {
            return Optional.empty();
        }
        if (session.expiresAt().isBefore(Instant.now())) {
            sessions.remove(token);
            return Optional.empty();
        }
        return Optional.of(session.email());
    }

    public void logout(String token) {
        if (StringUtils.hasText(token)) {
            sessions.remove(token);
        }
    }

    private Optional<AuthUser> findAuthorizedUser(String email, String mobile) throws IOException {
        String normalizedEmail = normalizeEmail(email);
        String normalizedMobile = normalizeMobile(mobile);
        if (!StringUtils.hasText(normalizedEmail) || !StringUtils.hasText(normalizedMobile)) {
            return Optional.empty();
        }
        if (!Files.exists(usersFile)) {
            throw new IllegalArgumentException("Authorized users file is not configured on this server.");
        }

        try (var lines = Files.lines(usersFile)) {
            return lines
                    .map(String::trim)
                    .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                    .map(line -> line.split(",", -1))
                    .filter(parts -> parts.length >= 2)
                    .map(parts -> new AuthUser(normalizeEmail(parts[0]), normalizeMobile(parts[1])))
                    .filter(user -> user.email().equals(normalizedEmail) && user.mobile().equals(normalizedMobile))
                    .findFirst();
        }
    }

    private String normalizeEmail(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeMobile(String value) {
        return value == null ? "" : value.replaceAll("\\D", "");
    }

    private record OtpChallenge(String email, String otp, Instant expiresAt) {
    }

    private record Session(String email, Instant expiresAt) {
    }
}
