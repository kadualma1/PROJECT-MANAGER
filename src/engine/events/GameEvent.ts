export type GameEventStatus = 
    | "OPEN"
    | "RESOLVED";

export interface GameEvent {
    id: string;

    saveId: string;

    date: string;

    category: string;

    title: string;
    description: string;

    requiresDecision: boolean;

    status: GameEventStatus;

    resolution?: string;
}