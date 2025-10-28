package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.service.OrderService;
import com.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request, 
                                       @RequestHeader("Authorization") String token) {
        try {
            // Extract username from token
            String username = extractUsernameFromToken(token);
            if (username == null) {
                return ResponseEntity.badRequest().body("Invalid token");
            }
            
            // Calculate total amount
            Double totalAmount = request.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

            // Create order
            Order order = new Order();
            order.setUserName(username);
            order.setTotalAmount(totalAmount);
            order.setPaymentMethod(request.getPaymentMethod());
            order.setShippingAddress(request.getShippingAddress());
            order.setStatus("PAID");

            // Add order items
            for (OrderItemRequest itemRequest : request.getItems()) {
                OrderItem orderItem = new OrderItem(
                    itemRequest.getProductId(),
                    itemRequest.getProductName(),
                    itemRequest.getPrice(),
                    itemRequest.getQuantity()
                );
                order.addOrderItem(orderItem);
            }

            Order savedOrder = orderService.createOrder(order);

            // Create response
            OrderResponse response = new OrderResponse();
            response.setId(savedOrder.getId());
            response.setUserName(savedOrder.getUserName());
            response.setTotalAmount(savedOrder.getTotalAmount());
            response.setStatus(savedOrder.getStatus());
            response.setPaymentMethod(savedOrder.getPaymentMethod());
            response.setShippingAddress(savedOrder.getShippingAddress());
            response.setCreatedAt(savedOrder.getCreatedAt());
            response.setItems(savedOrder.getOrderItems().stream().map(item -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setProductId(item.getProductId());
                itemResponse.setProductName(item.getProductName());
                itemResponse.setPrice(item.getPrice());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setSubtotal(item.getSubtotal());
                return itemResponse;
            }).collect(Collectors.toList()));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String token) {
        try {
            String username = extractUsernameFromToken(token);
            if (username == null) {
                return ResponseEntity.badRequest().body("Invalid token");
            }
            
            List<Order> orders = orderService.getOrdersByUsername(username);

            List<OrderResponse> response = orders.stream().map(order -> {
                OrderResponse orderResponse = new OrderResponse();
                orderResponse.setId(order.getId());
                orderResponse.setUserName(order.getUserName());
                orderResponse.setTotalAmount(order.getTotalAmount());
                orderResponse.setStatus(order.getStatus());
                orderResponse.setPaymentMethod(order.getPaymentMethod());
                orderResponse.setShippingAddress(order.getShippingAddress());
                orderResponse.setCreatedAt(order.getCreatedAt());
                orderResponse.setItems(order.getOrderItems().stream().map(item -> {
                    OrderItemResponse itemResponse = new OrderItemResponse();
                    itemResponse.setProductId(item.getProductId());
                    itemResponse.setProductName(item.getProductName());
                    itemResponse.setPrice(item.getPrice());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setSubtotal(item.getSubtotal());
                    return itemResponse;
                }).collect(Collectors.toList()));
                return orderResponse;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching orders: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            List<OrderResponse> response = orders.stream().map(order -> {
                OrderResponse orderResponse = new OrderResponse();
                orderResponse.setId(order.getId());
                orderResponse.setUserName(order.getUserName());
                orderResponse.setTotalAmount(order.getTotalAmount());
                orderResponse.setStatus(order.getStatus());
                orderResponse.setPaymentMethod(order.getPaymentMethod());
                orderResponse.setShippingAddress(order.getShippingAddress());
                orderResponse.setCreatedAt(order.getCreatedAt());
                return orderResponse;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching orders: " + e.getMessage());
        }
    }

    // Extract username from JWT token
    private String extractUsernameFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            try {
                return jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}