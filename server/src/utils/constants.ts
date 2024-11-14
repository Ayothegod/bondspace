export const ChatEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: "joinChat",
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: "leaveChat",
  // ? when admin updates a group name
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: "newChat",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when message is deleted
  MESSAGE_DELETE_EVENT: "messageDeleted",
});

export const ErrorEventEnum = Object.freeze({
  ALREADY_EXISTS: "ALREADY_EXISTS",       // e.g., user with email/username exists
  NO_TOKEN: "NO_TOKEN",                   // no token provided in request
  INVALID_TOKEN: "INVALID_TOKEN",         // invalid or malformed token
  EXPIRED_TOKEN: "EXPIRED_TOKEN",         // token has expired
  UNAUTHORIZED: "UNAUTHORIZED",           // user is not authorized to perform action
  USER_NOT_FOUND: "USER_NOT_FOUND",       // user not found in system
  CHAT_NOT_FOUND: "CHAT_NOT_FOUND",       // chat does not exist
  MESSAGE_TOO_LONG: "MESSAGE_TOO_LONG",   // chat message exceeds allowed length
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS", // incorrect username/password
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",       // account locked after too many failed attempts
  PERMISSION_DENIED: "PERMISSION_DENIED", // user lacks permissions for resource
  INVALID_INPUT: "INVALID_INPUT",         // request contains invalid or missing fields
  CONNECTION_ERROR: "CONNECTION_ERROR",   // general connection error
  SERVER_ERROR: "SERVER_ERROR",           // unexpected server error
  RATE_LIMITED: "RATE_LIMITED",           // user has exceeded request limit
  CHAT_DISABLED: "CHAT_DISABLED",         // chat feature temporarily disabled
});

export const AuthErrorEnum = Object.freeze({
  ALREADY_EXISTS: { code: "ALREADY_EXISTS", message: "User already exists." },
  NO_TOKEN: { code: "NO_TOKEN", message: "Authentication token is missing." },
  INVALID_TOKEN: { code: "INVALID_TOKEN", message: "Token is invalid or expired." },
  EXPIRED_TOKEN: { code: "EXPIRED_TOKEN", message: "Session has expired." },
  INVALID_CREDENTIALS: { code: "INVALID_CREDENTIALS", message: "Invalid login credentials." },
  ACCOUNT_LOCKED: { code: "ACCOUNT_LOCKED", message: "Account is locked due to multiple failed attempts." },
  USER_NOT_FOUND: { code: "USER_NOT_FOUND", message: "User not found." },
});

export const ChatErrorEnum = Object.freeze({
  CHAT_NOT_FOUND: { code: "CHAT_NOT_FOUND", message: "Chat room not found." },
  MESSAGE_TOO_LONG: { code: "MESSAGE_TOO_LONG", message: "Message exceeds allowed length." },
  PERMISSION_DENIED: { code: "PERMISSION_DENIED", message: "You lack permissions for this action." },
  RATE_LIMITED: { code: "RATE_LIMITED", message: "You are sending messages too quickly." },
  CONNECTION_ERROR: { code: "CONNECTION_ERROR", message: "Network issue, please retry." },
});