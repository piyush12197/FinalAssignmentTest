package com.hospital.ambulance.controller;

import com.hospital.ambulance.entity.AmbulanceTripEntity;
import com.hospital.ambulance.service.AmbulanceTripService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/platform/v1/emergency/trips")
public class AmbulanceTripController {
    private final AmbulanceTripService ambulanceTripService;

    public AmbulanceTripController(AmbulanceTripService ambulanceTripService) {
        this.ambulanceTripService = ambulanceTripService;
    }

    @GetMapping("/{id}")
    public ApiResponse<AmbulanceTripEntity> getTrip(@PathVariable String id) {
        return new ApiResponse<>(true, "Trip fetched", ambulanceTripService.getTrip(id));
    }

    @PostMapping("/{id}/vitals")
    public ApiResponse<AmbulanceTripEntity> appendVitals(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        return new ApiResponse<>(true, "Vitals captured", ambulanceTripService.appendVitals(id, payload.toString()));
    }
}
