import "socket.io";
import type { User, Session } from "@prisma/client";

declare module "socket.io" {
  interface Socket {
    user?: User
  }
}

// { id: string; username: string; email: string; password: string | null; fullname: string | null; }