package com.circlo.chat.controller;

import com.circlo.auth.config.JwtTokenUtil;
import com.circlo.chat.dto.ChatGroupDTO;
import com.circlo.chat.dto.ChatMessageDTO;
import com.circlo.chat.entity.ChatGroup;
import com.circlo.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

  private final ChatService chatService;
  private final JwtTokenUtil jwtTokenUtil;

  @GetMapping("/groups/activity/{activityId}")
  public ResponseEntity<ChatGroupDTO> getGroupByActivity(@PathVariable Long activityId) {
    ChatGroupDTO group = chatService.getGroupByActivityId(activityId);
    return ResponseEntity.ok(group);
  }

  @GetMapping("/groups/{groupId}/messages")
  public ResponseEntity<List<ChatMessageDTO>> getMessages(
      @PathVariable Long groupId,
      @RequestHeader("Authorization") String authHeader,
      @RequestParam(required = false) Integer limit) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    List<ChatMessageDTO> messages = chatService.getGroupMessages(groupId, userId, limit);
    return ResponseEntity.ok(messages);
  }

}
