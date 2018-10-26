export interface DhlTrackingResBody {
    messageLanguage: string;
    messageVersion: string;
    responseText: string;
    responseCode: string;
    items: [DhlTrackingResItems];
}
export interface DhlTrackingResItems {
    id: number;
    shipmentID: string;
    trackingID: string;
    orderNumber: string;
    consignmentNoteNumber: string;
    serviceCode: ServiceCode;
    // 目的地
    destination: Destination;
    weight: string;
    weightUnit: string;
    events: [EventsInterface];
}
export interface ServiceCode {
    code: string;
    mailTerminalId: string;
}
export interface Destination {
    countryCode: string;
}
export interface EventsInterface {
    status: string;
    description: string;
    timestamp: string;
    timezone: string;
    address: AddressInterface;
}
export interface AddressInterface {
    city: string;
    postalCode: string;
    state: string;
    countryCode: string;
}