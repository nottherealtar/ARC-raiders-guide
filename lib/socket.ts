"use client";

import { io, Socket } from "socket.io-client";

// Socket.IO client singleton
// Only initialize on the client-side to avoid SSR issues
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (typeof window === "undefined") {
    // Return a dummy object during SSR
    return {} as Socket;
  }

  if (!socket) {
    socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });
  }

  return socket;
};

// Export the socket instance for convenience
export const socketClient = typeof window !== "undefined" ? getSocket() : null;
