package com.example.consultantreviewportal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);

    private final Path usersFile;
    private final OtpSender mail;
    private final Duration otpTtl;
    private final Duration sessionTtl;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpChallenge> challenges = new ConcurrentHashMap<>();
    private final Map<String, String> challengeIdsByUser = new ConcurrentHashMap<>();
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
        return startChallenge(email, mobile, "");
    }

    public synchronized String startChallenge(String email, String mobile, String remoteIp) throws IOException {
        String normalizedEmail = normalizeEmail(email);
        String normalizedMobile = normalizeMobile(mobile);
        AuthUser user = findAuthorizedUser(email, mobile)
                .orElseThrow(() -> {
                    LOGGER.warn("auth_event=otp_request_rejected reason=unauthorized email={} mobile={} remote_ip={}",
                            maskEmail(normalizedEmail), maskMobile(normalizedMobile), logValue(remoteIp));
                    return new IllegalArgumentException("Email and mobile are not authorized.");
                });
        String otp = String.format("%06d", random.nextInt(1_000_000));
        String challengeId = UUID.randomUUID().toString();
        String userKey = userKey(user);
        String previousChallengeId = challengeIdsByUser.put(userKey, challengeId);
        if (previousChallengeId != null) {
            challenges.remove(previousChallengeId);
        }
        challenges.put(challengeId, new OtpChallenge(user.email(), userKey, otp, Instant.now().plus(otpTtl)));
        LOGGER.info("auth_event=otp_requested email={} mobile={} remote_ip={}",
                maskEmail(user.email()), maskMobile(user.mobile()), logValue(remoteIp));
        try {
            mail.sendOtp(user.email(), otp);
            LOGGER.info("auth_event=otp_email_send_success email={} remote_ip={}",
                    maskEmail(user.email()), logValue(remoteIp));
        } catch (RuntimeException ex) {
            challenges.remove(challengeId);
            challengeIdsByUser.remove(userKey, challengeId);
            LOGGER.warn("auth_event=otp_email_send_failure email={} remote_ip={} error={}",
                    maskEmail(user.email()), logValue(remoteIp), ex.getClass().getSimpleName());
            throw ex;
        }
        return challengeId;
    }

    public String verify(String challengeId, String otp) {
        return verify(challengeId, otp, "");
    }

    public synchronized String verify(String challengeId, String otp, String remoteIp) {
        if (!StringUtils.hasText(challengeId) || !StringUtils.hasText(otp)) {
            LOGGER.warn("auth_event=otp_verify_failure reason=malformed_request challenge_id={} remote_ip={}",
                    logChallengeId(challengeId), logValue(remoteIp));
            throw new IllegalArgumentException("OTP is required.");
        }

        OtpChallenge challenge = challenges.get(challengeId);
        if (challenge == null) {
            LOGGER.warn("auth_event=otp_verify_failure reason=not_found challenge_id={} remote_ip={}",
                    logChallengeId(challengeId), logValue(remoteIp));
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }
        if (challenge.expiresAt().isBefore(Instant.now())) {
            challenges.remove(challengeId);
            challengeIdsByUser.remove(challenge.userKey(), challengeId);
            LOGGER.warn("auth_event=otp_verify_failure reason=expired challenge_id={} email={} remote_ip={}",
                    logChallengeId(challengeId), maskEmail(challenge.email()), logValue(remoteIp));
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }
        if (!challenge.otp().equals(otp.trim())) {
            LOGGER.warn("auth_event=otp_verify_failure reason=mismatch challenge_id={} email={} remote_ip={}",
                    logChallengeId(challengeId), maskEmail(challenge.email()), logValue(remoteIp));
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        challenges.remove(challengeId);
        challengeIdsByUser.remove(challenge.userKey(), challengeId);
        String token = UUID.randomUUID().toString();
        sessions.put(token, new Session(challenge.email(), Instant.now().plus(sessionTtl)));
        LOGGER.info("auth_event=otp_verify_success challenge_id={} email={} remote_ip={}",
                logChallengeId(challengeId), maskEmail(challenge.email()), logValue(remoteIp));
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

    private String userKey(AuthUser user) {
        return user.email() + "|" + user.mobile();
    }

    private String maskEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return "";
        }
        int at = email.indexOf('@');
        if (at <= 1) {
            return "***" + (at >= 0 ? email.substring(at) : "");
        }
        return email.charAt(0) + "***" + email.substring(at);
    }

    private String maskMobile(String mobile) {
        if (!StringUtils.hasText(mobile)) {
            return "";
        }
        String trimmed = mobile.trim();
        if (trimmed.length() <= 4) {
            return "***";
        }
        return "***" + trimmed.substring(trimmed.length() - 4);
    }

    private String logValue(String value) {
        return StringUtils.hasText(value) ? value.trim() : "unknown";
    }

    private String logChallengeId(String challengeId) {
        if (!StringUtils.hasText(challengeId)) {
            return "unknown";
        }
        String trimmed = challengeId.trim();
        return trimmed.length() <= 8 ? trimmed : trimmed.substring(0, 8);
    }

    private record OtpChallenge(String email, String userKey, String otp, Instant expiresAt) {
    }

    private record Session(String email, Instant expiresAt) {
    }
}
