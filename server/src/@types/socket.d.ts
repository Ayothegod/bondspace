import "socket.io";
import type { User, Session } from "@prisma/client";

declare module "socket.io" {
  interface Socket {
    user?: User
  }
}
