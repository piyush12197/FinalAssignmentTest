package com.hospital.platform.partner.entity;

import java.util.ArrayList;
import java.util.List;

public class PartnerOrderEntity {
    private String id;
    private String sourceTenantId;
    private String providerTenantId;
    private String type;
    private String referenceId;
    private String status;
    private String createdAt;
    private List<String> timeline = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSourceTenantId() { return sourceTenantId; }
    public void setSourceTenantId(String sourceTenantId) { this.sourceTenantId = sourceTenantId; }
    public String getProviderTenantId() { return providerTenantId; }
    public void setProviderTenantId(String providerTenantId) { this.providerTenantId = providerTenantId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public List<String> getTimeline() { return timeline; }
    public void setTimeline(List<String> timeline) { this.timeline = timeline; }
}
