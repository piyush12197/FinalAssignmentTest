package com.hospital.auth.controller;

import com.hospital.auth.dto.InviteDTO;
import com.hospital.auth.service.InviteService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/platform/v1/invites")
public class InviteController {
    private final InviteService inviteService;

    public InviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @PostMapping
    public Map<String, Object> createInvite(@RequestBody InviteDTO payload) {
        return response("Invite placeholder created", inviteService.invite(payload));
    }

    @GetMapping("/validate")
    public Map<String, Object> validateInvite(@RequestParam("token") String token) {
        return response("Invite placeholder validated", inviteService.validate(token));
    }

    @PostMapping("/activate")
    public Map<String, Object> activateInvite(@RequestBody InviteDTO payload) {
        return response("Invite placeholder activated", inviteService.activate(payload));
    }

    private Map<String, Object> response(String message, Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", message);
        result.put("data", data);
        return result;
    }
}
