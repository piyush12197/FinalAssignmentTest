package com.hospital.ambulance.entity;

import java.util.ArrayList;
import java.util.List;

public class AmbulanceTripEntity {
    private String id;
    private String tenantId;
    private String emergencyCallId;
    private String ambulanceId;
    private String driverId;
    private String startTime;
    private String arrivalTime;
    private String hospitalArrivalTime;
    private List<String> vitalsDuringTransit = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getEmergencyCallId() { return emergencyCallId; }
    public void setEmergencyCallId(String emergencyCallId) { this.emergencyCallId = emergencyCallId; }
    public String getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(String ambulanceId) { this.ambulanceId = ambulanceId; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getHospitalArrivalTime() { return hospitalArrivalTime; }
    public void setHospitalArrivalTime(String hospitalArrivalTime) { this.hospitalArrivalTime = hospitalArrivalTime; }
    public List<String> getVitalsDuringTransit() { return vitalsDuringTransit; }
    public void setVitalsDuringTransit(List<String> vitalsDuringTransit) { this.vitalsDuringTransit = vitalsDuringTransit; }
}
