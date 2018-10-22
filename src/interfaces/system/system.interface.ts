export interface CreatePlatformInterface {
    id?: number;
    platformName: string;
    secondaryName: string;
    allowUserLogin: boolean;
    promptInformation?: string;
    platformCode: string;
    themeColors: string;
}
export interface ExchangeRateInterface {
    id?: number;
    currencyName: string;
    exchangeRate: number;
}