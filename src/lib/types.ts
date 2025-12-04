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
