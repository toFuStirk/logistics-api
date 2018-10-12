// 参数未写完成， valueAddedServices， shipmentContents
export interface DhlLabelReqBody {
    customerAccountId: number;
    pickupAccountId: string;
    soldToAccountId: string;
    pickupDateTime: string;
    inlineLabelReturn: 'Y'|'N'|'U'|'NULL';
    handoverMethod: number;
    pickupAddress: [PickupAddress];
    /*如果产品代码是PDR，而shipmentID最初是通过DHL发货，则为可选。*/
    shipperAddress: [ShipperAddress];
    shipmentItems: [ShipmentItems];
    label: [Label];
}
export interface PickupAddress {
    companyName: string;
    name: string;
    address1: string;
    address2: string;
    address3: string;
    city: string;
    state: string;
    district: string;
    country: string;
    postCode: string;
    phone: string;
    email: string;
}
export interface ShipperAddress extends PickupAddress {
    sendEmail: string;
}
export interface ShipmentItems {
    consigneeAddress: [ConsigneeAddress];
    returnAddress: [PickupAddress];
    // 最长32位,90天之内不能重复
    shipmentID: string;
    // 退货指示 仅使用与国内运输
    returnMode: string;
    // 不使用
    deliveryConfirmationNo: string;
    // 包裹描述，跨境强制， DHL首次可用
    packageDesc: string;
    totalWeight: number;
    totalWeightUOM: string;
    dimensionUOM: string;
    height: number;
    length: number;
    width: number;
    // 默认为null
    customerReference1: string;
    customerReference2: string;
    // 航运服务
    productCode: string;
    // 术语
    incoterm: string;
    contentIndicator: string;
    codValue: string;
    insuranceValue: number;
    freightCharge: number;
    totalValue: number;
    currency: string;
    remarks: string;
    workshareIndicator: string;
    billingReference1: string;
    billingReference2: string;
    deliveryOption: string;
    isMult: string;
    invoiceNumber: string;
    invoiceDate: Date;
    reverseCharge: string;
    igstPaymentStatus: string;
    termsOfInvoice: string;
    returnProductCode: string;
    locationID: string;
    shipmentPieces: [ShipmentPieces];
    valueAddedServices: [ValueAddedServices];
}
export interface ConsigneeAddress extends PickupAddress {
    // Consignee Identification Number
    idNumber: string;
    // Consignee Identification Type. For possible values, refer to Identification Type in Appendix page.
    idType: string;
}
export interface ShipmentPieces {
    // 将在提供的发货ID后追加的件号
    pieceID: number;
    announcedWeight: [AnnouncedWeight];
    codAmount: number;
    insuranceAmount: number;
    billingReference1: string;
    billingReference2: string;
    pieceDescription: string;
}
export interface AnnouncedWeight {
    weight: number;
    unit: string;
}
export interface Label {
    pageSize: string;
    format: 'PNG'|'ZPL'|'PDF';
    layout: '1x1'|'4x1';
}
export interface ValueAddedServices {
    valueAddedService: [ValueAddedService];
}
export interface ValueAddedService {
    vasCode: string;
    attributes: {attributeName: string, attributeValue: string };
}