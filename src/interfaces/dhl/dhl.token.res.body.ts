export interface DhlTokenResBody{
    accessTokenResponse: {
        token: string,
        token_type: string,
        expires_in_seconds: string,
        client_id: string,
        responseStatus: {
            code: string,
            message: string,
            messageDetails: string
        }
    }

}