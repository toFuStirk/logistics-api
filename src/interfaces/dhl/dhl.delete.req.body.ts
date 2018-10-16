export interface DhlDeleteReqBody {
    customerAccountId: number;
    pickupAccountId: string;
    soldToAccountId: string;
    shipmentItems: {shipmentID: string}[];
}