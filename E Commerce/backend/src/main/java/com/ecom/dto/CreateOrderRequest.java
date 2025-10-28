package com.ecommerce.dto;

import java.util.List;

public class CreateOrderRequest {
    private String paymentMethod;
    private String shippingAddress;
    private List<OrderItemRequest> items;

    // Constructors
    public CreateOrderRequest() {}

    public CreateOrderRequest(String paymentMethod, String shippingAddress, List<OrderItemRequest> items) {
        this.paymentMethod = paymentMethod;
        this.shippingAddress = shippingAddress;
        this.items = items;
    }

    // Getters and Setters
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}