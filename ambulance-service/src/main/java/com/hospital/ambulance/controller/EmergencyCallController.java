package com.hospital.ambulance.controller;

import com.hospital.ambulance.entity.EmergencyCallEntity;
import com.hospital.ambulance.service.EmergencyCallService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/platform/v1/emergency/calls")
public class EmergencyCallController {
    private final EmergencyCallService emergencyCallService;

    public EmergencyCallController(EmergencyCallService emergencyCallService) {
        this.emergencyCallService = emergencyCallService;
    }

    @PostMapping
    public ApiResponse<EmergencyCallEntity> createCall(@RequestBody EmergencyCallEntity payload) {
        return new ApiResponse<>(true, "Emergency call created", emergencyCallService.createCall(payload));
    }

    @GetMapping
    public ApiResponse<List<EmergencyCallEntity>> getCalls(@RequestParam(required = false) String status) {
        return new ApiResponse<>(true, "Emergency calls fetched", emergencyCallService.getCalls(status));
    }

    @PostMapping("/{id}/dispatch")
    public ApiResponse<EmergencyCallEntity> dispatch(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return new ApiResponse<>(true, "Dispatch successful",
                emergencyCallService.dispatch(id, payload.get("ambulanceId"), payload.get("driverId")));
    }

    @PostMapping("/{id}/update-status")
    public ApiResponse<EmergencyCallEntity> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return new ApiResponse<>(true, "Status updated", emergencyCallService.updateStatus(id, payload.get("status")));
    }
}
