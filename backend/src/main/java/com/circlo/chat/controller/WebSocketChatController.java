package com.circlo.chat.controller;

import com.circlo.auth.config.JwtTokenUtil;
import com.circlo.chat.dto.ChatMessageDTO;
import com.circlo.chat.dto.SendMessageRequest;
import com.circlo.chat.entity.ChatGroup;
import com.circlo.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketChatController {

  private final ChatService chatService;
  private final JwtTokenUtil jwtTokenUtil;

  @MessageMapping("/chat/{groupId}")
  public void sendMessage(
      @DestinationVariable Long groupId,
      @Payload SendMessageRequest request,
      SimpMessageHeaderAccessor headerAccessor) {

    try {
      String authToken = headerAccessor.getFirstNativeHeader("Authorization");
      if (authToken != null && authToken.startsWith("Bearer ")) {
        String token = authToken.substring(7);
        Long userId = jwtTokenUtil.getUserIdFromToken(token);

        chatService.sendMessage(groupId, userId, request);
      } else {
        log.error("No valid authorization token found in WebSocket message");
      }
    } catch (Exception e) {
      log.error("Error sending message: {}", e.getMessage());
    }
  }

}
