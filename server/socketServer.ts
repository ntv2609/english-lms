import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected to Socket.io");

        // Listen for notification event from the frontend
        socket.on("notification", (data) => {
            // Broadcast the notification to all connected clients (specifically for admin dashboard)
            io.emit("newNotification", data);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected from Socket.io");
        });
    });
};