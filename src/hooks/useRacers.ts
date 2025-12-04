import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";

export interface Racer {
    id: string;
    name: string;
    email: string;
    phone: string;
    category: string;
    startTime: number | null;
    finishTime: number | null;
    duration: number | null;
    status: 'registered' | 'running' | 'finished';
}

export const useRacers = () => {
    const socket = useSocket();
    const [racers, setRacers] = useState<Racer[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("init_data", (data: Racer[]) => {
            setRacers(data);
        });

        socket.on("racers_list", (data: Racer[]) => {
            setRacers(data);
        });

        return () => {
            socket.off("init_data");
            socket.off("racers_list");
        };
    }, [socket]);

    return racers;
};
