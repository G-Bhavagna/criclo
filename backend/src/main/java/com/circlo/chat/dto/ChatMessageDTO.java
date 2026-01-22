package com.circlo.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {

  private Long id;
  private Long groupId;
  private Long senderId;
  private String senderName;
  private Long userId; // Alias for senderId for compatibility
  private String userName; // Alias for senderName for compatibility
  private String content;
  private String type;
  private String timestamp;
  private String sentAt; // Alias for timestamp for compatibility

}
