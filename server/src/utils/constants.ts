export const SocketEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  SOCKET_ERROR_EVENT: "socketError",

  NEW_MESSAGE: "newMessage",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",

  JOIN_CHAT_EVENT: "joinChat",
  UPDATE_CHAT_NAME_EVENT: "updateChatName",

  NEW_SPACE_EVENT: "newSpace",
  JOIN_SPACE_EVENT: "joinSpace",
  LEAVE_SPACE_EVENT: "leaveSpace",
  UPDATE_SPACE_NAME_EVENT: "updateSpaceName",
  END_SPACE: "endSpace",

  NEW_GAME_EVENT: "newGame",
  JOIN_GAME_EVENT: "joinGame",
  START_GAME_EVENT: "startGame",
  END_GAME_EVENT: "endGame",

  // NEW_GAME_EVENT: "newGame",
  // JOIN_GAME_EVENT: "joinGame",
  // START_GAME_EVENT: "startGame",
  // END_GAME_EVENT: "endGame",

  // LEAVE_SPACE_EVENT: "leaveSpace",
  // UPDATE_SPACE_NAME_EVENT: "updateSpaceName",
  // END_SPACE: "endSpace",
});

// ❓ Consider: Add constraints for chips to prevent negative values (can be enforced in code logic).

// type String @db.VarChar(10) // Replace with enum in application code: ["fold", "bet", "raise", "call", "check"]

export const ErrorEventEnum = Object.freeze({
  ALREADY_EXISTS: "ALREADY_EXISTS",
  NO_TOKEN: "NO_TOKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  RATE_LIMITED: "RATE_LIMITED",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  CONNECTION_ERROR: "CONNECTION_ERROR",

  CHAT_NOT_FOUND: "CHAT_NOT_FOUND",
  CHAT_DISABLED: "CHAT_DISABLED",

  MESSAGE_TOO_LONG: "MESSAGE_TOO_LONG",
  INVALID_INPUT: "INVALID_INPUT",

  SERVER_ERROR: "SERVER_ERROR",
});

export const GenErrorEnum = Object.freeze({
  // MESSAGE_TOO_LONG: {
  //   code: "MESSAGE_TOO_LONG",
  //   message: "Message exceeds allowed length.",
  // },
  PERMISSION_DENIED: {
    code: "PERMISSION_DENIED",
    message: "You lack permissions for this action.",
  },
  RATE_LIMITED: {
    code: "RATE_LIMITED",
    message: "You are sending messages too quickly.",
  },
  CONNECTION_ERROR: {
    code: "CONNECTION_ERROR",
    message: "Network issue, please retry.",
  },
});
