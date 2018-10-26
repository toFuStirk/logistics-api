export interface DhlCloseOutReqBody {
    customerAccountId: number;
    pickupAccountId: string;
    soldToAccountId: string;
    handoverID: string;
    generateHandover: string;
    handoverMethod: number;
    emailNotification: string;
    shipmentItems: {shipmentID: string, bagID ?: string }[];
}