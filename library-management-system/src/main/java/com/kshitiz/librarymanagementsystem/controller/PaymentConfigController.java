package com.kshitiz.librarymanagementsystem.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentConfigController {

    @Value("${payment.upi.id:}")
    private String upiId;

    @Value("${spring.application.name:LibraryMS}")
    private String payeeName;

    @GetMapping("/config")
    public Map<String, String> getConfig() {
        return Map.of(
                "upiId", upiId == null ? "" : upiId,
                "payeeName", payeeName
        );
    }
}
