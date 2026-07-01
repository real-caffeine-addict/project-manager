package com.example.consultantreviewportal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Profile("smtp-mail")
public class OtpMailService implements OtpSender {
    private static final Logger LOGGER = LoggerFactory.getLogger(OtpMailService.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final boolean consoleFallback;

    public OtpMailService(ObjectProvider<JavaMailSender> mailSender,
                          @Value("${spring.mail.username:}") String username,
                          @Value("${app.otp-mail-from:}") String from,
                          @Value("${app.otp-console-fallback:false}") boolean consoleFallback) {
        this.mailSender = mailSender.getIfAvailable();
        this.from = StringUtils.hasText(from) ? from : username;
        this.consoleFallback = consoleFallback;
    }

    @Override
    public void sendOtp(String email, String otp) {
        if (mailSender == null) {
            if (consoleFallback) {
                LOGGER.warn("auth_event=otp_console_fallback email={}", maskEmail(email));
                return;
            }
            throw new IllegalStateException("Mail sender is not configured.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (StringUtils.hasText(from)) {
            message.setFrom(from);
        }
        message.setTo(email);
        message.setSubject("Consultant Review Portal OTP");
        message.setText("Your Consultant Review Portal code is: " + otp + "\n\nThis code expires soon.");
        mailSender.send(message);
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
}
