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

        String challengeId = auth.startChallenge(" DANA@example.com ", "0501234567");

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

    @Test
    void requestingOtpTwiceReplacesPreviousOtp() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,0501234567\n");
        FakeOtpSender mail = new FakeOtpSender();
        AuthService auth = new AuthService(usersFile.toString(), 10, 12, mail);

        String firstChallengeId = auth.startChallenge("dana@example.com", "0501234567");
        String firstOtp = mail.otp;
        String secondChallengeId = auth.startChallenge("dana@example.com", "0501234567");

        assertThat(secondChallengeId).isNotEqualTo(firstChallengeId);
        assertThatThrownBy(() -> auth.verify(firstChallengeId, firstOtp))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid or expired OTP");
        assertThat(auth.authenticate(auth.verify(secondChallengeId, mail.otp))).contains("dana@example.com");
    }

    @Test
    void wrongOtpDoesNotPreventLaterCorrectOtp() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,0501234567\n");
        FakeOtpSender mail = new FakeOtpSender();
        AuthService auth = new AuthService(usersFile.toString(), 10, 12, mail);

        String challengeId = auth.startChallenge("dana@example.com", "0501234567");

        assertThatThrownBy(() -> auth.verify(challengeId, "000000".equals(mail.otp) ? "111111" : "000000"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid or expired OTP");
        assertThat(auth.authenticate(auth.verify(challengeId, mail.otp))).contains("dana@example.com");
    }

    @Test
    void expiredOtpFailsAndIsCleanedUp() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,0501234567\n");
        FakeOtpSender mail = new FakeOtpSender();
        AuthService auth = new AuthService(usersFile.toString(), -1, 12, mail);

        String challengeId = auth.startChallenge("dana@example.com", "0501234567");

        assertThatThrownBy(() -> auth.verify(challengeId, mail.otp))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid or expired OTP");
        assertThatThrownBy(() -> auth.verify(challengeId, mail.otp))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid or expired OTP");
    }

    @Test
    void successfulOtpClearsPendingOtp() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,0501234567\n");
        FakeOtpSender mail = new FakeOtpSender();
        AuthService auth = new AuthService(usersFile.toString(), 10, 12, mail);

        String challengeId = auth.startChallenge("dana@example.com", "0501234567");
        String otp = mail.otp;

        String token = auth.verify(challengeId, otp);

        assertThat(auth.authenticate(token)).contains("dana@example.com");
        assertThatThrownBy(() -> auth.verify(challengeId, otp))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid or expired OTP");
    }

    @Test
    void trimsOtpInput() throws Exception {
        Path usersFile = tempDir.resolve("authorized-users.csv");
        Files.writeString(usersFile, "dana@example.com,0501234567\n");
        FakeOtpSender mail = new FakeOtpSender();
        AuthService auth = new AuthService(usersFile.toString(), 10, 12, mail);

        String challengeId = auth.startChallenge("dana@example.com", "0501234567");

        assertThat(auth.authenticate(auth.verify(challengeId, " " + mail.otp + " "))).contains("dana@example.com");
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
