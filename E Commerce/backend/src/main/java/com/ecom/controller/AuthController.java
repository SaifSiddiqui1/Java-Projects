package com.ecommerce.controller;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import com.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        System.out.println("Register request received: " + registerRequest.getUsername());
        
        // Check if username already exists
        if (userService.usernameExists(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, "Username already exists"));
        }

        // Check if email already exists
        if (userService.emailExists(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, "Email already exists"));
        }

        // Create new user
        User user = new User(
            registerRequest.getUsername(),
            registerRequest.getEmail(),
            registerRequest.getPassword(), // This will be encoded in UserService
            registerRequest.getFullName()
        );

        User savedUser = userService.registerUser(user);
        String token = jwtUtil.generateToken(savedUser.getUsername());

        System.out.println("User registered successfully: " + savedUser.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, savedUser.getUsername(), "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login request received: " + loginRequest.getUsername());
        
        Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, "Invalid username or password"));
        }

        User user = userOptional.get();
        
        // Validate password using UserService
        if (!userService.validatePassword(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, "Invalid username or password"));
        }

        String token = jwtUtil.generateToken(user.getUsername());

        System.out.println("User logged in successfully: " + user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), "Login successful"));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            if (jwtUtil.validateToken(jwt)) {
                String username = jwtUtil.extractUsername(jwt);
                return ResponseEntity.ok(new AuthResponse(jwt, username, "Token is valid"));
            }
        }
        return ResponseEntity.badRequest().body(new AuthResponse(null, null, "Invalid token"));
    }

    @GetMapping("/test")
    public String test() {
        return "Auth API is working!";
    }
}