export interface DhlTrackingReqBody {
    customerAccountId: string;
    soldToAccountId: string;
    pickupAccountId: string;
    ePODRequired: string;
    trackingReferenceNumber: string[];
}