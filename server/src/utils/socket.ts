import cookie from "cookie";
import { Server, Socket } from "socket.io";
import { ApiError } from "../utils/ApiError.js";
import { SocketEventEnum } from "./constants.js";
import { Request } from "express";
import { validateSessionToken } from "./authSession.js";

const mountJoinSpaceEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.JOIN_SPACE_EVENT, (spaceId) => {
    console.log(`User joined the space 🤝. chatId: `, spaceId);
    socket.join(spaceId);
  });
};

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.TYPING_EVENT, (spaceId) => {
    socket.in(spaceId).emit(SocketEventEnum.TYPING_EVENT, spaceId);
  });
};

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(SocketEventEnum.STOP_TYPING_EVENT, (spaceId) => {
    socket.in(spaceId).emit(SocketEventEnum.STOP_TYPING_EVENT, spaceId);
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
      console.log("User connected 🗼. userId: ", user.id);

      // socket.emit(SocketEventEnum.CONNECTED_EVENT, `${user.id.toString()}`);

      mountJoinSpaceEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(SocketEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
    } catch (error) {
      console.error("An unexpected error occurred Here");
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
