export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  UPDATE_CHAT_NAME_EVENT: "updateChatName",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  NEW_CHAT_EVENT: "newChat",
  SOCKET_ERROR_EVENT: "socketError",
  STOP_TYPING_EVENT: "stopTyping",
  TYPING_EVENT: "typing",
  MESSAGE_DELETE_EVENT: "messageDeleted",
});

export const SpaceEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  NEW_SPACE_EVENT: "newSpace",
  JOIN_SPACE_EVENT: "joinSpace",
  LEAVE_SPACE_EVENT: "leaveSpace",
  SOCKET_ERROR_EVENT: "socketError",
  // UPDATE_GROUP_NAME_EVENT: "updateGroupName",
});

export const ErrorEventEnum = Object.freeze({
  ALREADY_EXISTS: "ALREADY_EXISTS", // e.g., user with email/username exists
  NO_TOKEN: "NO_TOKEN", // no token provided in request
  INVALID_TOKEN: "INVALID_TOKEN", // invalid or malformed token
  EXPIRED_TOKEN: "EXPIRED_TOKEN", // token has expired
  UNAUTHORIZED: "UNAUTHORIZED", // user is not authorized to perform action
  USER_NOT_FOUND: "USER_NOT_FOUND", // user not found in system
  CHAT_NOT_FOUND: "CHAT_NOT_FOUND", // chat does not exist
  MESSAGE_TOO_LONG: "MESSAGE_TOO_LONG", // chat message exceeds allowed length
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS", // incorrect username/password
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED", // account locked after too many failed attempts
  PERMISSION_DENIED: "PERMISSION_DENIED", // user lacks permissions for resource
  INVALID_INPUT: "INVALID_INPUT", // request contains invalid or missing fields
  CONNECTION_ERROR: "CONNECTION_ERROR", // general connection error
  SERVER_ERROR: "SERVER_ERROR", // unexpected server error
  RATE_LIMITED: "RATE_LIMITED", // user has exceeded request limit
  CHAT_DISABLED: "CHAT_DISABLED", // chat feature temporarily disabled
});

export const AuthErrorEnum = Object.freeze({
  ALREADY_EXISTS: { code: "ALREADY_EXISTS", message: "User already exists." },
  NO_TOKEN: { code: "NO_TOKEN", message: "Authentication token is missing." },
  INVALID_TOKEN: {
    code: "INVALID_TOKEN",
    message: "Token is invalid or expired.",
  },
  EXPIRED_TOKEN: { code: "EXPIRED_TOKEN", message: "Session has expired." },
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid login credentials.",
  },
  ACCOUNT_LOCKED: {
    code: "ACCOUNT_LOCKED",
    message: "Account is locked due to multiple failed attempts.",
  },
  USER_NOT_FOUND: { code: "USER_NOT_FOUND", message: "User not found." },
});

export const SpaceErrorEnum = Object.freeze({
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
  CONNECTION_ERRO: {
    code: "CONNECTION_ERROR",
    message: "Network issue, please retry.",
  },
});

export const ChatErrorEnum = Object.freeze({
  CHAT_NOT_FOUND: { code: "CHAT_NOT_FOUND", message: "Chat room not found." },
  MESSAGE_TOO_LONG: {
    code: "MESSAGE_TOO_LONG",
    message: "Message exceeds allowed length.",
  },
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
