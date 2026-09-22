export type ContractStatus =
    | "PROPOSED"
    | "ACTIVE"
    | "EXPIRING"
    | "TERMINATED"
    | "COMPLETED"
    | "REJECTED";

export interface Contract {
    id: string;

    personId: string;
    organizationId: string;

    startDate: string;
    endDate: string;

    salary: number;

    status: ContractStatus;
}