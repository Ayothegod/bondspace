import cookie from "cookie";
// import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
ChatEventEnum;
import { ApiError } from "../utils/ApiError.js";
import { ChatEventEnum } from "./constants.js";
import { Request } from "express";
import { validateSessionToken } from "./authSession.js";

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
    // E.g. When user types we don't want to emit that event to specific participant.
    // We want to just emit that to the chat where the typing is happening
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
      console.log("token: ", token);

      socket.user = user;

      socket.join(user.id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT, `${user.id.toString()}`);
      console.log("User connected 🗼. userId: ", user.id.toString());

      // TODO: emit message
      // socket.on("message", (data) => {
      //   console.log(data);

      //   // TODO: still needed since user may not be cconnected at all
      //   // let user
      //   // if(data.userSocket === socket.user?.id){
      //   //   console.log("Yeah!!!");
      //   // }
      //   socket.to(data.chatId).emit("message", {
      //     message: data.message,
      //     user: socket.user?.username,
      //   });
      //   // socket.emit("message", {
      //   //   message: data.message,
      //   //   user: socket.user?.username,
      //   // });
      // });

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
      if (error instanceof MyCustomError) {
        console.error(error);
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          error?.message ||
            "Something went wrong while connecting to the socket."
        );
      } else {
        console.error("An unexpected error occurred Here");
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Something went wrong while connecting to the socket."
        );
      }
    }
  });
};

const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: string,
  payload: any
) => {
  console.log(`socket emitted from: roomID-${roomId}, with event: ${event}`);

  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
