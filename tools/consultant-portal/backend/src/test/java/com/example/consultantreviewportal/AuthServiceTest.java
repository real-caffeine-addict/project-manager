package com.example.consultantreviewportal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
class AuthServiceTest {
    @TempDir
    Path tempDir;

    @Test
    void startsChallengeForAuthorizedEmailAndMobile() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,050-123-4567\n");
        FakeOtpSender mail = new FakeOtpSender();
        AuthService auth = new AuthService(usersFile.toString(), 10, 12, mail);

        String challengeId = auth.startChallenge("DANA@example.com", "0501234567");

        assertThat(challengeId).isNotBlank();
        assertThat(mail.email).isEqualTo("dana@example.com");
        assertThat(mail.otp).matches("\\d{6}");
    }

    @Test
    void rejectsUnknownUsers() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,0501234567\n");
        AuthService auth = new AuthService(usersFile.toString(), 10, 12, new FakeOtpSender());

        assertThatThrownBy(() -> auth.startChallenge("lee@example.com", "0501234567"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not authorized");
    }

    private static class FakeOtpSender implements OtpSender {
        private String email;
        private String otp;

        @Override
        public void sendOtp(String email, String otp) {
            this.email = email;
            this.otp = otp;
        }
    }
}
