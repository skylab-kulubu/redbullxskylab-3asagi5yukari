import { useSocket } from "@/providers/SocketProvider";
import { Racer } from "@/lib/types";

export type { Racer };

export const useRacers = () => {
    const { racers, loading } = useSocket();
    return { racers, loading };
};
