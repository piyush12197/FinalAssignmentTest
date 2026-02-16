package com.hospital.ambulance.service;

import com.hospital.ambulance.entity.EmergencyCallEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmergencyCallService {
    public EmergencyCallEntity createCall(EmergencyCallEntity payload) {
        return payload;
    }

    public List<EmergencyCallEntity> getCalls(String status) {
        return new ArrayList<>();
    }

    public EmergencyCallEntity dispatch(String id, String ambulanceId, String driverId) {
        EmergencyCallEntity entity = new EmergencyCallEntity();
        entity.setId(id);
        entity.setAssignedAmbulanceId(ambulanceId);
        entity.setAssignedDriverId(driverId);
        entity.setStatus("DISPATCHED");
        return entity;
    }

    public EmergencyCallEntity updateStatus(String id, String status) {
        EmergencyCallEntity entity = new EmergencyCallEntity();
        entity.setId(id);
        entity.setStatus(status);
        return entity;
    }
}
