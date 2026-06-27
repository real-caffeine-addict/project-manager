package com.example.consultantreviewportal;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {
    static final String SESSION_COOKIE = "consultant_portal_session";

    private final AuthService auth;
    private final boolean secureCookie;

    public AuthController(AuthService auth, @Value("${app.auth-secure-cookie:false}") boolean secureCookie) {
        this.auth = auth;
        this.secureCookie = secureCookie;
    }

    @PostMapping("/start")
    public OtpChallengeResponse start(@RequestBody AuthRequest request, HttpServletRequest httpRequest) throws IOException {
        return new OtpChallengeResponse(auth.startChallenge(request.email(), request.mobile(), remoteIp(httpRequest)));
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthStatus> verify(@RequestBody OtpVerifyRequest request, HttpServletRequest httpRequest) {
        String token = auth.verify(request.challengeId(), request.otp(), remoteIp(httpRequest));
        ResponseCookie cookie = ResponseCookie.from(SESSION_COOKIE, token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofHours(12))
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthStatus(true, auth.authenticate(token).orElse("")));
    }

    @GetMapping("/status")
    public AuthStatus status(HttpServletRequest request) {
        return auth.authenticate(readCookie(request)).map(email -> new AuthStatus(true, email))
                .orElseGet(() -> new AuthStatus(false, null));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthStatus> logout(HttpServletRequest request) {
        auth.logout(readCookie(request));
        ResponseCookie cookie = ResponseCookie.from(SESSION_COOKIE, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthStatus(false, null));
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, String>> badRequest(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler({IOException.class})
    public ResponseEntity<Map<String, String>> configurationError(IOException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", "Could not read authorized users file."));
    }

    @ExceptionHandler({MailException.class})
    public ResponseEntity<Map<String, String>> mailError(MailException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", "Could not send OTP email. Check SMTP settings."));
    }

    static String readCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return "";
        }
        return Arrays.stream(cookies)
                .filter(cookie -> SESSION_COOKIE.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse("");
    }

    private static String remoteIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",", 2)[0].trim();
        }
        return request.getRemoteAddr();
    }
}
