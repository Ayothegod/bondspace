import cookie from "cookie";
import { Server, Socket } from "socket.io";
import { ApiError } from "../utils/ApiError.js";
import { SocketEventEnum } from "./constants.js";
import { Request } from "express";
import { validateSessionToken } from "./authSession.js";

const mountJoinSpaceEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.JOIN_SPACE_EVENT, (spaceId) => {
    console.log(`User joined space`);
    socket.join(spaceId);
  });
};

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined  chat`);
    socket.join(chatId);
    // console.log(`Socket ${socket.id} joined chat ${chatId}`);
    // console.log("Rooms after joining:", Array.from(socket.rooms));
  });
};

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.TYPING_EVENT, (chatId) => {
    // console.log(`User typing from chat 🤝: `, chatId);
    socket.in(chatId).emit(SocketEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(SocketEventEnum.STOP_TYPING_EVENT, chatId);
    // console.log(`User stopped typing from chat 🤝: `, chatId);
    // console.log("Rooms:", socket.rooms); 

  });
};

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

      socket.join(user.id);
      socket.emit(SocketEventEnum.CONNECTED_EVENT, `${user.id}`);
      console.log("User connected: ", user.id);

      mountJoinSpaceEvent(socket);
      mountJoinChatEvent(socket)
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(SocketEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
    } catch (error) {
      socket.emit(
        SocketEventEnum.SOCKET_ERROR_EVENT,
        "Something went wrong while connecting the space to the socket."
      );
    }
  });
};

const emitSocketEvent = (
  req: Request,
  spaceId: string,
  event: string,
  payload: any
) => {
  console.log(`NOTE: Space-${spaceId} on event ${event}`);

  req.app.get("io").in(spaceId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
