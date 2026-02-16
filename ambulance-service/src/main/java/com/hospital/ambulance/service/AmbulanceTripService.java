package com.hospital.ambulance.service;

import com.hospital.ambulance.entity.AmbulanceTripEntity;
import org.springframework.stereotype.Service;

@Service
public class AmbulanceTripService {
    public AmbulanceTripEntity getTrip(String id) {
        AmbulanceTripEntity entity = new AmbulanceTripEntity();
        entity.setId(id);
        return entity;
    }

    public AmbulanceTripEntity appendVitals(String id, String vitalsPayload) {
        AmbulanceTripEntity entity = new AmbulanceTripEntity();
        entity.setId(id);
        entity.getVitalsDuringTransit().add(vitalsPayload);
        return entity;
    }
}
