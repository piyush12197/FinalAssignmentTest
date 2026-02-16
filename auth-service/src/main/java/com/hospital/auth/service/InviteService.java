package com.hospital.auth.service;

import com.hospital.auth.dto.InviteDTO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InviteService {
    public Map<String, Object> invite(InviteDTO payload) {
        Map<String, Object> data = new HashMap<>();
        data.put("email", payload.getEmail());
        data.put("tenantId", payload.getTenantId());
        data.put("roles", payload.getRoles());
        data.put("activationLink", "/activate?token=placeholder-token");
        return data;
    }

    public Map<String, Object> validate(String token) {
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("valid", true);
        return data;
    }

    public Map<String, Object> activate(InviteDTO payload) {
        Map<String, Object> data = new HashMap<>();
        data.put("token", payload.getToken());
        data.put("activated", true);
        return data;
    }
}
