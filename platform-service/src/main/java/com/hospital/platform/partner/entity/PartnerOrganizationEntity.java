package com.hospital.platform.partner.entity;

import java.util.ArrayList;
import java.util.List;

public class PartnerOrganizationEntity {
    private String id;
    private String name;
    private String type;
    private String tenantId;
    private List<String> connectedHospitals = new ArrayList<>();
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public List<String> getConnectedHospitals() { return connectedHospitals; }
    public void setConnectedHospitals(List<String> connectedHospitals) { this.connectedHospitals = connectedHospitals; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
