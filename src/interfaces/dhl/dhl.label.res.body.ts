export interface DhlLabelResBody {
    labelResponse: {
        hdr: {
            messageType: string;
            messageDateTime: Date;
            messageVersion: string;
            messageLanguage: string;
        },
        bd: {
            labels: [{
                shipmentID: string;
                deliveryConfirmationNo: string;
                labelURL: string;
                content: string;
                responseStatus: {
                    code: string;
                    message: string;
                    messageDetails: [
                        {messageDetails: string}
                        ]
                }
            }],
            responseStatus: {
                code: string;
                message: string;
                messageDetails: string;
            }
        }
    };
}