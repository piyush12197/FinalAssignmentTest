package com.hospital.platform.partner.service;

import com.hospital.platform.partner.entity.PartnerOrderEntity;
import com.hospital.platform.partner.entity.PartnerOrganizationEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PartnerService {
    public List<PartnerOrganizationEntity> listPartners() {
        return new ArrayList<>();
    }

    public List<PartnerOrderEntity> listOrders() {
        return new ArrayList<>();
    }

    public PartnerOrderEntity updateOrderStatus(String id, String status) {
        PartnerOrderEntity entity = new PartnerOrderEntity();
        entity.setId(id);
        entity.setStatus(status);
        return entity;
    }

    public PartnerOrganizationEntity connect(String partnerId, String hospitalTenantId) {
        PartnerOrganizationEntity entity = new PartnerOrganizationEntity();
        entity.setId(partnerId);
        entity.getConnectedHospitals().add(hospitalTenantId);
        return entity;
    }
}
