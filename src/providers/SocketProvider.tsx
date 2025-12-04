"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Racer } from "@/lib/types";

interface SocketContextType {
    socket: Socket | null;
    racers: Racer[];
    loading: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    racers: [],
    loading: true
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [racers, setRacers] = useState<Racer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
        const socketInstance = io(socketUrl);
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            console.log("Socket connected");
            socketInstance.emit("request_data");
        });

        socketInstance.on("init_data", (data: Racer[]) => {
            console.log("Init data received:", data);
            if (Array.isArray(data)) setRacers(data);
            setLoading(false);
        });

        socketInstance.on("racers_list", (data: Racer[]) => {
            console.log("Racers list updated:", data);
            if (Array.isArray(data)) setRacers(data);
            setLoading(false);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, racers, loading }}>
            {children}
        </SocketContext.Provider>
    );
};
