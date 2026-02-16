package com.hospital.platform.partner.controller;

import com.hospital.platform.partner.entity.PartnerOrderEntity;
import com.hospital.platform.partner.entity.PartnerOrganizationEntity;
import com.hospital.platform.partner.service.PartnerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/platform/v1/partners")
public class PartnerController {
    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping
    public ApiResponse<List<PartnerOrganizationEntity>> listPartners() {
        return new ApiResponse<>(true, "Partners fetched", partnerService.listPartners());
    }

    @GetMapping("/orders")
    public ApiResponse<List<PartnerOrderEntity>> listOrders() {
        return new ApiResponse<>(true, "Partner orders fetched", partnerService.listOrders());
    }

    @PostMapping("/orders/{id}/status")
    public ApiResponse<PartnerOrderEntity> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return new ApiResponse<>(true, "Partner order status updated", partnerService.updateOrderStatus(id, payload.get("status")));
    }

    @PostMapping("/connect")
    public ApiResponse<PartnerOrganizationEntity> connect(@RequestBody Map<String, String> payload) {
        return new ApiResponse<>(
                true,
                "Partner connected",
                partnerService.connect(payload.get("partnerId"), payload.get("hospitalTenantId"))
        );
    }
}
