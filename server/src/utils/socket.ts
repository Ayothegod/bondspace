import cookie from "cookie";
// import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
ChatEventEnum;
import { ApiError } from "../utils/ApiError.js";
import { ChatEventEnum, SpaceEventEnum } from "./constants.js";
import { Request } from "express";
import { validateSessionToken } from "./authSession.js";

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

class MyCustomError extends Error {
  constructor(public customProperty: string) {
    super("This is a custom error message");
    this.name = "MyCustomError";
  }
}

const initializeSocketIO = (io: Server) => {
  return io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let token = cookies?.authSession;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const validateToken = await validateSessionToken(token);
      if (!validateToken.session || !validateToken.user) {
        throw new ApiError(401, "Invalid access token");
      }

      const { user } = validateToken;
      socket.user = user;

      socket.join(user.id.toString());
      socket.emit(SpaceEventEnum.CONNECTED_EVENT, `${user.id.toString()}`);

      socket.emit(ChatEventEnum.CONNECTED_EVENT, `${user.id.toString()}`);
      console.log("User connected 🗼. userId: ", user.id.toString());

      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
    } catch (error) {
      console.error("An unexpected error occurred Here");
      socket.emit(
        SpaceEventEnum.SOCKET_ERROR_EVENT,
        "Something went wrong while connecting the space to the socket."
      );

      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        "Something went wrong while connecting the chat to the socket."
      );
    }
  });
};

const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: string,
  payload: any
) => {
  console.log(`NOTE: roomID-${roomId} on event ${event}`);

  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
