/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import socketio from "socket.io-client";

const getSocket = () => {
  // const token = LocalStorage.get("token");
  return socketio(import.meta.env.VITE_SOCKET_URI, {
    withCredentials: true,
    // auth: { token },
  });
};

const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
}>({
  socket: null,
});

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null
  );
  // console.log(socket);

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);
export { SocketProvider, useSocket };
