export type SaveStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "CORRUPTED";

export interface SaveGame {
    id: string;
    name: string;

    seed: number;
    rngState: number;

    schemaVersion: string;
    rulesVersion: string;

    rulesetId: string;

    currentDate: string;

    status: SaveStatus;
}