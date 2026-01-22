package com.circlo.auth.service;

import com.circlo.auth.config.JwtTokenUtil;
import com.circlo.auth.dto.*;
import com.circlo.auth.entity.RefreshToken;
import com.circlo.auth.entity.User;
import com.circlo.auth.entity.UserRole;
import com.circlo.auth.repository.RefreshTokenRepository;
import com.circlo.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenUtil jwtTokenUtil;
  private final AuthenticationManager authenticationManager;

  @Value("${app.jwt.access-token-expiration}")
  private Long accessTokenExpiration;

  @Value("${app.jwt.refresh-token-expiration}")
  private Long refreshTokenExpiration;

  @Transactional
  public AuthResponse signup(SignupRequest request) {
    log.info("Attempting to register user: {}", request.getEmail());

    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already exists");
    }

    User user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .name(request.getName())
        .bio(request.getBio())
        .interests(request.getInterests() != null ? request.getInterests() : new HashSet<>())
        .role(UserRole.USER)
        .enabled(true)
        .accountNonLocked(true)
        .isOnline(false)
        .build();

    user = userRepository.save(user);
    log.info("User registered successfully: {}", user.getEmail());

    return generateAuthResponse(user);
  }

  @Transactional
  public AuthResponse login(LoginRequest request) {
    log.info("Attempting to login user: {}", request.getEmail());

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Update online status
    user.setIsOnline(true);
    user.setLastSeen(LocalDateTime.now());
    userRepository.save(user);

    log.info("User logged in successfully: {}", user.getEmail());

    return generateAuthResponse(user);
  }

  @Transactional
  public AuthResponse refreshToken(RefreshTokenRequest request) {
    String refreshTokenStr = request.getRefreshToken();

    RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
        .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

    if (refreshToken.getRevoked()) {
      throw new RuntimeException("Refresh token has been revoked");
    }

    if (refreshToken.isExpired()) {
      throw new RuntimeException("Refresh token has expired");
    }

    User user = refreshToken.getUser();

    // Generate new access token
    String newAccessToken = jwtTokenUtil.generateAccessToken(
        user.getEmail(),
        user.getId(),
        user.getRole().name());

    return AuthResponse.builder()
        .accessToken(newAccessToken)
        .refreshToken(refreshTokenStr)
        .tokenType("Bearer")
        .expiresIn(accessTokenExpiration)
        .user(convertToDTO(user))
        .build();
  }

  @Transactional
  public void logout(String email) {
    log.info("Logging out user: {}", email);

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    user.setIsOnline(false);
    user.setLastSeen(LocalDateTime.now());
    userRepository.save(user);

    // Revoke all refresh tokens
    refreshTokenRepository.deleteByUser(user);

    log.info("User logged out successfully: {}", email);
  }

  private AuthResponse generateAuthResponse(User user) {
    String accessToken = jwtTokenUtil.generateAccessToken(
        user.getEmail(),
        user.getId(),
        user.getRole().name());

    String refreshTokenStr = jwtTokenUtil.generateRefreshToken(user.getEmail());

    // Save refresh token
    RefreshToken refreshToken = RefreshToken.builder()
        .token(refreshTokenStr)
        .user(user)
        .expiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
        .revoked(false)
        .build();

    refreshTokenRepository.save(refreshToken);

    return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshTokenStr)
        .tokenType("Bearer")
        .expiresIn(accessTokenExpiration)
        .user(convertToDTO(user))
        .build();
  }

  private UserDTO convertToDTO(User user) {
    return UserDTO.builder()
        .id(user.getId())
        .email(user.getEmail())
        .name(user.getName())
        .bio(user.getBio())
        .profileImageUrl(user.getProfileImageUrl())
        .interests(user.getInterests())
        .isOnline(user.getIsOnline())
        .role(user.getRole().name())
        .build();
  }

}
