export type ContractOfferStatus =
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";

export interface ContractOffer {
    id: string;

    personId: string;
    organizationId: string;

    salary: number;

    startDate: string;
    endDate: string;

    status: ContractOfferStatus;
}